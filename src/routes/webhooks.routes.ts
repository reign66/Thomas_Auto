import express, { Request, Response } from 'express';
import { validateCalendlySignature, extractCalendlyData } from '../services/calendly.service';
import { getProspectByPageId } from '../services/notion.service';
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

interface NotionWebhookRequest extends Request {
  body: any;
}

/**
 * POST /webhooks/notion
 * Reçoit le webhook Notion (déclenché par le bouton "Go site") et déclenche le workflow complet
 */
router.post('/notion', async (req: NotionWebhookRequest, res: Response) => {
  try {
    logger.info('🔔 Webhook Notion reçu');
    
    // Parfois le body est mal parsé (chaque caractère indexé séparément)
    // On doit le reconstruire si c'est le cas
    let payload = req.body;
    
    // Détecter si le body est une chaîne indexée par caractères ({"0":"{","1":"\n",...})
    if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
      const keys = Object.keys(payload);
      if (keys.length > 0 && keys.every(key => /^\d+$/.test(key))) {
        logger.info('⚠️ Body détecté comme chaîne indexée, reconstruction...');
        // Reconstruire la chaîne depuis les caractères indexés
        const maxIndex = Math.max(...keys.map(k => parseInt(k, 10)));
        let reconstructed = '';
        for (let i = 0; i <= maxIndex; i++) {
          if (payload[i] !== undefined) {
            reconstructed += payload[i];
          }
        }
        try {
          payload = JSON.parse(reconstructed);
          logger.info('✅ Body reconstruit avec succès');
        } catch (e) {
          logger.error('❌ Impossible de parser le body reconstruit');
          logger.error('Body reconstruit (début):', reconstructed.substring(0, 500));
        }
      }
    }
    
    logger.debug('Body parsé:', JSON.stringify(payload, null, 2).substring(0, 500));

    // Notion envoie différents formats de webhook selon le type d'automatisation
    // Format automation button : { source: {...}, data: { object: "page", id: "...", properties: {...} } }
    // Format 1 : { page_id: "..." } (automatisation simple)
    // Format 2 : { payload: { page_id: "..." } } (automatisation avec payload)
    // Format 3 : { data: { page_id: "..." } } (autre format possible)
    
    let pageId: string | undefined;
    
    // Essayer différents formats
    if (payload?.data?.id && payload?.data?.object === 'page') {
      // Format automation button Notion
      pageId = payload.data.id;
    } else if (payload?.page_id) {
      pageId = payload.page_id;
    } else if (payload?.payload?.page_id) {
      pageId = payload.payload.page_id;
    } else if (payload?.data?.page_id) {
      pageId = payload.data.page_id;
    } else if (payload?.page?.id) {
      pageId = payload.page.id;
    } else if (payload?.id) {
      // Si c'est directement l'ID de la page
      pageId = payload.id;
    }

    if (!pageId) {
      logger.error('❌ Page ID manquant dans le webhook Notion');
      logger.error('Structure du body:', JSON.stringify(payload, null, 2).substring(0, 1000));
      return res.status(400).json({
        success: false,
        error: { message: 'Page ID manquant dans le webhook' },
      });
    }

    logger.info(`📄 Page ID reçu : ${pageId}`);

    // Retourner 200 OK immédiatement (pour que Notion ne réessaie pas)
    res.status(200).json({
      success: true,
      message: 'Webhook reçu, traitement en cours',
    });

    // Lancer le workflow de génération en arrière-plan (asynchrone)
    try {
      // Récupérer les données du prospect depuis Notion
      const prospectData = await getProspectByPageId(pageId);
      
      // Lancer le workflow avec les données directement et le pageId pour mettre à jour Notion
      generateSiteWorkflow(prospectData, pageId).catch((error: any) => {
        const errorMsg = typeof error.message === 'string' ? error.message : JSON.stringify(error.message);
        logger.error(`❌ Erreur dans le workflow pour ${prospectData.name}: ${errorMsg}`);
      });
    } catch (error: any) {
      const errorMsg = typeof error.message === 'string' ? error.message : JSON.stringify(error.message);
      logger.error(`❌ Erreur lors de la récupération des données Notion pour la page ${pageId}: ${errorMsg}`);
    }

    return;
  } catch (error: any) {
    logger.error(`❌ Erreur dans le webhook Notion :`, error.message);
    
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
