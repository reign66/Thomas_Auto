import crypto from 'crypto';
import { config } from '../config';
import { logger } from '../utils/logger';

export interface CalendlyWebhookPayload {
  event: string;
  invitee: {
    name: string;
    email: string;
  };
  questions_and_answers?: Array<{
    question: string;
    answer: string;
  }>;
  [key: string]: any;
}

export interface ExtractedCalendlyData {
  name: string;
  email: string;
  siteWeb: string;
}

/**
 * Valide la signature HMAC du webhook Calendly
 */
export function validateCalendlySignature(
  signature: string | undefined,
  body: string
): boolean {
  // Si pas de secret configuré, accepter (développement)
  if (!config.calendly.webhookSecret) {
    logger.warn('⚠️  CALENDLY_WEBHOOK_SECRET non configuré, validation ignorée');
    return true;
  }

  // Si pas de signature fournie mais secret configuré, refuser
  if (!signature) {
    logger.error('❌ Signature manquante dans les headers');
    return false;
  }

  const hmac = crypto.createHmac('sha256', config.calendly.webhookSecret);
  const digest = hmac.update(body).digest('base64');
  const expectedSignature = `sha256=${digest}`;

  // Vérifier que la signature commence par "sha256="
  if (!signature.startsWith('sha256=')) {
    logger.error('❌ Format de signature invalide');
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Extrait les données du webhook Calendly
 * Note: On extrait seulement le nom car le website vient de Notion
 */
export function extractCalendlyData(
  payload: CalendlyWebhookPayload
): ExtractedCalendlyData {
  const name = payload.invitee?.name || '';
  const email = payload.invitee?.email || '';
  
  // Chercher la réponse "Site Web" dans questions_and_answers (optionnel maintenant)
  const siteWebAnswer = payload.questions_and_answers?.find(
    (qa) => qa.question === 'Site Web' || qa.question.toLowerCase().includes('site web')
  );
  
  const siteWeb = siteWebAnswer?.answer || '';

  // Seul le nom est obligatoire maintenant (le website vient de Notion)
  if (!name) {
    throw new Error(
      `Données manquantes dans le webhook: name est requis`
    );
  }

  return { name, email, siteWeb };
}
