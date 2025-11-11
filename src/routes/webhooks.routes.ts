import express, { Request, Response } from 'express';
import { validateCalendlySignature, extractCalendlyData } from '../services/calendly.service';
import { generateSiteWorkflow } from '../workflows/generate-site.workflow';
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
    // Calendly peut envoyer la signature dans différents headers
    const signature = 
      (req.headers['calendly-webhook-signature'] as string) ||
      (req.headers['x-calendly-webhook-signature'] as string) ||
      (req.headers['calendly-signature'] as string);
    
    // Log pour debug
    logger.debug('Headers reçus:', {
      'calendly-webhook-signature': req.headers['calendly-webhook-signature'] ? 'présent' : 'absent',
      'x-calendly-webhook-signature': req.headers['x-calendly-webhook-signature'] ? 'présent' : 'absent',
      'calendly-signature': req.headers['calendly-signature'] ? 'présent' : 'absent',
      'content-type': req.headers['content-type'],
    });
    
    // Utiliser le body brut si disponible, sinon stringify le body parsé
    const bodyString = req.rawBody || JSON.stringify(req.body);
    
    logger.debug(`Body length: ${bodyString.length}, Body preview: ${bodyString.substring(0, 100)}...`);

    if (!validateCalendlySignature(signature, bodyString)) {
      logger.error('❌ Signature Calendly invalide');
      return res.status(401).json({
        success: false,
        error: { message: 'Signature invalide' },
      });
    }

    // 2. Extraire le nom du prospect depuis le webhook
    const { name } = extractCalendlyData(req.body);

    logger.info(`🔔 Webhook Calendly reçu pour : ${name}`);

    // 3. Retourner 200 OK immédiatement (pour que Calendly ne réessaie pas)
    res.status(200).json({
      success: true,
      message: 'Webhook reçu, traitement en cours',
    });

    // 4. Lancer le workflow de génération en arrière-plan (asynchrone)
    // On ne fait pas await pour retourner la réponse immédiatement à Calendly
    generateSiteWorkflow(name).catch((error: any) => {
      // Les erreurs sont déjà gérées dans le workflow avec des emails
      logger.error(`❌ Erreur dans le workflow pour ${name}:`, error.message);
    });

    return;
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
