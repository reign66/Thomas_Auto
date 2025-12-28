import { getProspectByName, ProspectData, updateProspectByPageId } from '../services/notion.service';
import { scrapeWebsite, ScrapedData } from '../services/scraper.service';
import { analyzeWebsite } from '../services/claude.service';
import { generateLovableUrl } from '../services/lovable.service';
import { sendLovableUrlEmail, sendErrorEmail } from '../services/email.service';
import { logger } from '../utils/logger';

/**
 * Workflow centralisé de génération de site
 * @param prospectNameOrData Nom du prospect (depuis le webhook Calendly) ou données du prospect (depuis le webhook Notion)
 * @param pageId ID de la page Notion (optionnel, pour mettre à jour Notion avec l'URL Lovable)
 */
export async function generateSiteWorkflow(
  prospectNameOrData: string | ProspectData,
  pageId?: string
): Promise<void> {
  try {
    // 1. Récupérer les données du prospect
    let prospectData: ProspectData;
    
    if (typeof prospectNameOrData === 'string') {
      // Mode Calendly : on cherche par nom
      const prospectName = prospectNameOrData;
      logger.info(`🚀 Démarrage du workflow pour : ${prospectName}`);
      
      try {
        prospectData = await getProspectByName(prospectName);
      } catch (error: any) {
        const errorMsg = `Le prospect "${prospectName}" n'a pas été trouvé dans Notion`;
        const errorDetails = typeof error.message === 'string' ? error.message : JSON.stringify(error.message);
        logger.error(`❌ ${errorMsg}: ${errorDetails}`);
        await sendErrorEmail(prospectName, errorMsg, errorDetails);
        throw error;
      }
    } else {
      // Mode Notion : on utilise directement les données
      prospectData = prospectNameOrData;
      logger.info(`🚀 Démarrage du workflow pour : ${prospectData.name} (depuis Notion)`);
    }

    // Vérifier que le website est présent
    if (!prospectData.website) {
      const errorMsg = `Le prospect "${prospectData.name}" n'a pas de site web dans Notion`;
      logger.error(`❌ ${errorMsg}`);
      await sendErrorEmail(prospectData.name, errorMsg);
      throw new Error(errorMsg);
    }

    // 2. Scraper le site web (récupère contenu + logo + images + couleurs)
    let scrapedData: ScrapedData;
    try {
      scrapedData = await scrapeWebsite(prospectData.website);
      logger.info(`📊 Scraping terminé : ${scrapedData.images.length} images, logo: ${scrapedData.logoUrl ? 'Oui' : 'Non'}`);
    } catch (error: any) {
      const errorMsg = `Erreur lors du scraping du site : ${prospectData.website}`;
      const errorDetails = typeof error.message === 'string' ? error.message : JSON.stringify(error.message);
      logger.error(`❌ ${errorMsg}: ${errorDetails}`);
      await sendErrorEmail(prospectData.name, errorMsg, errorDetails);
      throw error;
    }

    // Déterminer le logo à utiliser (priorité : Notion > Scraping)
    const logoUrl = prospectData.logoUrl || scrapedData.logoUrl;
    if (logoUrl) {
      logger.info(`🖼️  Logo final : ${logoUrl.substring(0, 50)}...`);
    } else {
      logger.warn(`⚠️  Aucun logo trouvé pour ${prospectData.name}`);
    }

    // 3. Analyser avec Claude
    let claudePrompt: string;
    try {
      claudePrompt = await analyzeWebsite(
        prospectData.website,
        scrapedData.content,
        prospectData.name,
        {
          siteType: prospectData.siteType || 'Très moderne',
          directorName: prospectData.name,
          sectorActivity: prospectData.sectorActivity,
          geoZone: prospectData.geoZone,
          logoUrl: logoUrl || undefined,
          colors: scrapedData.colors,
        }
      );
    } catch (error: any) {
      const errorMsg = `Erreur lors de l'analyse Claude pour ${prospectData.website}`;
      const errorDetails = typeof error.message === 'string' ? error.message : JSON.stringify(error.message);
      logger.error(`❌ ${errorMsg}: ${errorDetails}`);
      await sendErrorEmail(prospectData.name, errorMsg, errorDetails);
      throw error;
    }

    // 4. Générer l'URL Lovable avec logo + images
    const lovableUrl = generateLovableUrl(claudePrompt, logoUrl, scrapedData.images);

    logger.info(`🔗 URL Lovable générée`);
    logger.info('========================================');
    logger.info(`🎯 URL LOVABLE POUR ${prospectData.name} :`);
    logger.info(lovableUrl);
    logger.info('========================================');

    // 5. Mettre à jour Notion avec l'URL Lovable si pageId est fourni
    if (pageId) {
      try {
        await updateProspectByPageId(pageId, lovableUrl);
        logger.info(`✅ Notion mis à jour avec l'URL Lovable pour la page ${pageId}`);
      } catch (error: any) {
        // On log l'erreur mais on continue le workflow
        logger.error(`❌ Erreur lors de la mise à jour Notion, mais le workflow continue: ${error.message}`);
      }
    }

    // 6. Envoyer l'email avec l'URL
    try {
      await sendLovableUrlEmail({
        prospectName: prospectData.name,
        lovableUrl,
        originalWebsite: prospectData.website,
      });
      logger.info(`✅ Workflow terminé avec succès pour : ${prospectData.name}`);
    } catch (error: any) {
      // Si l'envoi d'email échoue, on log l'erreur mais on ne throw pas
      // L'URL est déjà dans les logs Railway, on peut la récupérer manuellement
      logger.error(`❌ Erreur lors de l'envoi de l'email, mais l'URL est disponible dans les logs`);
      logger.error(`URL Lovable : ${lovableUrl}`);
      // On envoie quand même un email d'erreur pour informer
      await sendErrorEmail(
        prospectData.name,
        'Erreur lors de l\'envoi de l\'email avec l\'URL Lovable',
        `L'URL a été générée avec succès mais l'envoi d'email a échoué. URL : ${lovableUrl}`
      );
    }
  } catch (error: any) {
    // Les erreurs sont déjà gérées dans chaque étape avec des emails d'erreur
    // On log juste l'erreur finale
    const errorMsg = typeof error.message === 'string' ? error.message : JSON.stringify(error.message);
    const prospectName = typeof prospectNameOrData === 'string' ? prospectNameOrData : prospectNameOrData.name;
    logger.error(`❌ Workflow échoué pour ${prospectName}: ${errorMsg}`);
    throw error;
  }
}
