import express, { Request, Response } from 'express';
import { validateCalendlySignature, extractCalendlyData } from '../services/calendly.service';
import { getProspectLogo, updateProspect } from '../services/notion.service';
import { scrapeWebsite } from '../services/scraper.service';
import { analyzeWebsite } from '../services/claude.service';
import { generateLovableUrl } from '../services/lovable.service';
import { logger } from '../utils/logger';

const router = express.Router();

interface CalendlyWebhookRequest extends Request {
  body: any;
  rawBody?: string;
}

/**
 * POST /webhooks/calendly
 * Reçoit le webhook Calendly et déclenche le workflow complet
 */
router.post('/calendly', async (req: CalendlyWebhookRequest, res: Response) => {
  try {
    // 1. Valider la signature HMAC
    const signature = req.headers['calendly-webhook-signature'] as string;
    // Utiliser le body brut si disponible, sinon stringify le body parsé
    const bodyString = req.rawBody || JSON.stringify(req.body);

    if (!validateCalendlySignature(signature, bodyString)) {
      logger.error('❌ Signature Calendly invalide');
      return res.status(401).json({
        success: false,
        error: { message: 'Signature invalide' },
      });
    }

    // 2. Extraire les données du webhook
    const { name, email, siteWeb } = extractCalendlyData(req.body);

    logger.info(`🔔 Webhook Calendly reçu pour : ${name}`);
    logger.info(`📧 Email : ${email}`);
    logger.info(`🌐 Site Web : ${siteWeb}`);

    // 3. Récupérer le logo depuis Notion
    const logoUrl = await getProspectLogo(name);

    // 4. Scraper le site web
    const scrapedContent = await scrapeWebsite(siteWeb);

    // 5. Analyser avec Claude
    const claudePrompt = await analyzeWebsite(siteWeb, scrapedContent, name);

    // 6. Générer l'URL Lovable
    const lovableUrl = generateLovableUrl(claudePrompt, logoUrl);

    // 7. Mettre à jour Notion
    await updateProspect(name, lovableUrl, new Date());

    // 8. Logger l'URL de façon très visible
    logger.info('========================================');
    logger.info(`🎯 URL LOVABLE POUR ${name} :`);
    logger.info(lovableUrl);
    logger.info('========================================');

    // 9. Retourner la réponse
    return res.status(200).json({
      success: true,
      data: {
        prospectName: name,
        lovableUrl,
        hasLogo: !!logoUrl,
      },
    });
  } catch (error: any) {
    logger.error(`❌ Erreur dans le webhook Calendly :`, error.message);
    
    // Si c'est une erreur de validation, retourner 400
    if (error.message.includes('manquantes') || error.message.includes('invalide')) {
      return res.status(400).json({
        success: false,
        error: { message: error.message },
      });
    }

    // Sinon, erreur serveur
    return res.status(500).json({
      success: false,
      error: {
        message: 'Erreur lors du traitement du webhook',
        ...(process.env.NODE_ENV === 'development' && { details: error.message }),
      },
    });
  }
});

export default router;
