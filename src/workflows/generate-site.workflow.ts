import { getProspectByName } from '../services/notion.service';
import { scrapeWebsite } from '../services/scraper.service';
import { analyzeWebsite } from '../services/claude.service';
import { generateLovableUrl } from '../services/lovable.service';
import { sendLovableUrlEmail, sendErrorEmail } from '../services/email.service';
import { logger } from '../utils/logger';

/**
 * Workflow centralisé de génération de site
 * @param prospectName Nom du prospect (depuis le webhook Calendly)
 */
export async function generateSiteWorkflow(prospectName: string): Promise<void> {
  try {
    logger.info(`🚀 Démarrage du workflow pour : ${prospectName}`);

    // 1. Récupérer les données du prospect depuis Notion
    let prospectData;
    try {
      prospectData = await getProspectByName(prospectName);
    } catch (error: any) {
      const errorMsg = `Le prospect "${prospectName}" n'a pas été trouvé dans Notion`;
      const errorDetails = typeof error.message === 'string' ? error.message : JSON.stringify(error.message);
      logger.error(`❌ ${errorMsg}: ${errorDetails}`);
      await sendErrorEmail(prospectName, errorMsg, errorDetails);
      throw error;
    }

    // Vérifier que le website est présent
    if (!prospectData.website) {
      const errorMsg = `Le prospect "${prospectName}" n'a pas de site web dans Notion`;
      logger.error(`❌ ${errorMsg}`);
      await sendErrorEmail(prospectName, errorMsg);
      throw new Error(errorMsg);
    }

    // 2. Scraper le site web
    let scrapedContent: string;
    try {
      scrapedContent = await scrapeWebsite(prospectData.website);
    } catch (error: any) {
      const errorMsg = `Erreur lors du scraping du site : ${prospectData.website}`;
      const errorDetails = typeof error.message === 'string' ? error.message : JSON.stringify(error.message);
      logger.error(`❌ ${errorMsg}: ${errorDetails}`);
      await sendErrorEmail(prospectName, errorMsg, errorDetails);
      throw error;
    }

    // 3. Analyser avec Claude
    let claudePrompt: string;
    try {
      claudePrompt = await analyzeWebsite(
        prospectData.website,
        scrapedContent,
        prospectName,
        {
          siteType: prospectData.siteType || 'Très moderne',
          directorName: prospectData.name,
        }
      );
    } catch (error: any) {
      const errorMsg = `Erreur lors de l'analyse Claude pour ${prospectData.website}`;
      const errorDetails = typeof error.message === 'string' ? error.message : JSON.stringify(error.message);
      logger.error(`❌ ${errorMsg}: ${errorDetails}`);
      await sendErrorEmail(prospectName, errorMsg, errorDetails);
      throw error;
    }

    // 4. Générer l'URL Lovable
    const lovableUrl = generateLovableUrl(claudePrompt, prospectData.logoUrl);

    logger.info(`🔗 URL Lovable générée`);
    logger.info('========================================');
    logger.info(`🎯 URL LOVABLE POUR ${prospectName} :`);
    logger.info(lovableUrl);
    logger.info('========================================');

    // 5. Envoyer l'email avec l'URL
    try {
      await sendLovableUrlEmail({
        prospectName: prospectData.name,
        lovableUrl,
        originalWebsite: prospectData.website,
      });
      logger.info(`✅ Workflow terminé avec succès pour : ${prospectName}`);
    } catch (error: any) {
      // Si l'envoi d'email échoue, on log l'erreur mais on ne throw pas
      // L'URL est déjà dans les logs Railway, on peut la récupérer manuellement
      logger.error(`❌ Erreur lors de l'envoi de l'email, mais l'URL est disponible dans les logs`);
      logger.error(`URL Lovable : ${lovableUrl}`);
      // On envoie quand même un email d'erreur pour informer
      await sendErrorEmail(
        prospectName,
        'Erreur lors de l\'envoi de l\'email avec l\'URL Lovable',
        `L'URL a été générée avec succès mais l'envoi d'email a échoué. URL : ${lovableUrl}`
      );
    }
  } catch (error: any) {
    // Les erreurs sont déjà gérées dans chaque étape avec des emails d'erreur
    // On log juste l'erreur finale
    const errorMsg = typeof error.message === 'string' ? error.message : JSON.stringify(error.message);
    logger.error(`❌ Workflow échoué pour ${prospectName}: ${errorMsg}`);
    throw error;
  }
}
