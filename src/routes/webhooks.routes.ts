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
    
    // Log pour debug - logger tous les headers qui contiennent "calendly" ou "signature"
    const relevantHeaders: Record<string, string> = {};
    Object.keys(req.headers).forEach(key => {
      const lowerKey = key.toLowerCase();
      if (lowerKey.includes('calendly') || lowerKey.includes('signature') || lowerKey.includes('x-')) {
        const value = req.headers[key];
        relevantHeaders[key] = typeof value === 'string' ? (value.length > 50 ? value.substring(0, 50) + '...' : value) : String(value);
      }
    });
    logger.info('🔍 Headers pertinents reçus:', relevantHeaders);
    
    // Utiliser le body brut pour la validation de signature
    const bodyString = req.rawBody || '';
    
    if (!bodyString) {
      logger.error('❌ Body brut manquant pour validation de signature');
      return res.status(400).json({
        success: false,
        error: { message: 'Body manquant' },
      });
    }
    
    logger.debug(`Body length: ${bodyString.length}, Body preview: ${bodyString.substring(0, 200)}...`);

    if (!validateCalendlySignature(signature, bodyString)) {
      logger.error('❌ Signature Calendly invalide');
      return res.status(401).json({
        success: false,
        error: { message: 'Signature invalide' },
      });
    }

    // S'assurer que req.body est bien un objet (pas une chaîne ou un objet indexé par caractères)
    let payload = req.body;
    
    // Si req.body est une chaîne, parser
    if (typeof payload === 'string') {
      try {
        payload = JSON.parse(payload);
      } catch (e) {
        logger.error('❌ Impossible de parser le body JSON');
        return res.status(400).json({
          success: false,
          error: { message: 'Body JSON invalide' },
        });
      }
    }
    
    // Si req.body est un objet indexé par caractères (problème de parsing), utiliser rawBody
    if (payload && typeof payload === 'object' && !Array.isArray(payload) && Object.keys(payload).every(key => /^\d+$/.test(key))) {
      logger.warn('⚠️ Body parsé comme chaîne indexée, re-parsing depuis rawBody');
      try {
        payload = JSON.parse(req.rawBody || '{}');
      } catch (e) {
        logger.error('❌ Impossible de parser le rawBody JSON');
        return res.status(400).json({
          success: false,
          error: { message: 'Body JSON invalide' },
        });
      }
    }
    
    // Log le body parsé pour debug
    logger.info('📦 Body parsé reçu:', JSON.stringify(payload, null, 2).substring(0, 500));

    // 2. Extraire le nom du prospect depuis le webhook
    let name: string;
    try {
      const extracted = extractCalendlyData(payload);
      name = extracted.name;
    } catch (error: any) {
      logger.error(`❌ Erreur lors de l'extraction des données: ${error.message}`);
      logger.error(`Body structure:`, JSON.stringify(payload, null, 2).substring(0, 1000));
      return res.status(400).json({
        success: false,
        error: { message: error.message },
      });
    }

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
      const errorMsg = typeof error.message === 'string' ? error.message : JSON.stringify(error.message);
      logger.error(`❌ Erreur dans le workflow pour ${name}: ${errorMsg}`);
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
