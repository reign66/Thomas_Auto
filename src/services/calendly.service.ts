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
 * Supporte deux formats :
 * - Format v1 : t=timestamp,v1=signature (nouveau format Calendly)
 * - Format legacy : sha256=signature (ancien format)
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

  // Log pour debug (sans exposer la signature complète)
  logger.debug(`🔍 Signature reçue: ${signature.substring(0, 30)}... (longueur: ${signature.length})`);

  // Format v1 : t=timestamp,v1=signature
  if (signature.startsWith('t=')) {
    // Parser le format v1 : t=timestamp,v1=signature
    const parts = signature.split(',');
    const timestampMatch = parts[0]?.match(/t=(\d+)/);
    const signatureMatch = parts[1]?.match(/v1=([a-f0-9]+)/);

    if (!timestampMatch || !signatureMatch) {
      logger.error(`❌ Format de signature v1 invalide. Reçu: "${signature.substring(0, 50)}..."`);
      return false;
    }

    const timestamp = timestampMatch[1];
    const receivedSignature = signatureMatch[1];

    // Vérifier que le timestamp n'est pas trop ancien (max 5 minutes)
    const currentTime = Math.floor(Date.now() / 1000);
    const signatureTime = parseInt(timestamp, 10);
    const timeDiff = Math.abs(currentTime - signatureTime);

    if (timeDiff > 300) {
      logger.error(`❌ Signature trop ancienne (différence: ${timeDiff}s, max: 300s)`);
      return false;
    }

    // Calculer la signature attendue
    // Format v1 : HMAC-SHA256(timestamp + "." + body, secret) en hexadécimal
    const payload = `${timestamp}.${body}`;
    const hmac = crypto.createHmac('sha256', config.calendly.webhookSecret);
    const expectedSignature = hmac.update(payload).digest('hex');

    // Comparer les signatures
    const isValid = crypto.timingSafeEqual(
      Buffer.from(receivedSignature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );

    if (!isValid) {
      logger.error('❌ Signature HMAC v1 invalide (ne correspond pas au secret)');
      logger.debug(`Expected starts with: ${expectedSignature.substring(0, 20)}...`);
    } else {
      logger.debug('✅ Signature v1 valide');
    }

    return isValid;
  }

  // Format legacy : sha256=signature (base64)
  if (signature.startsWith('sha256=')) {
    const hmac = crypto.createHmac('sha256', config.calendly.webhookSecret);
    const digest = hmac.update(body).digest('base64');
    const expectedSignature = `sha256=${digest}`;

    const isValid = crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );

    if (!isValid) {
      logger.error('❌ Signature HMAC legacy invalide (ne correspond pas au secret)');
    } else {
      logger.debug('✅ Signature legacy valide');
    }

    return isValid;
  }

  // Format inconnu
  logger.error(`❌ Format de signature inconnu. Reçu: "${signature.substring(0, 50)}..." (attendu: "t=...,v1=..." ou "sha256=...")`);
  return false;
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
