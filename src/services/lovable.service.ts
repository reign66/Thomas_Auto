import { logger } from '../utils/logger';

/**
 * Génère l'URL Lovable avec le prompt et optionnellement le logo
 */
export function generateLovableUrl(
  prompt: string,
  logoUrl?: string | null
): string {
  try {
    logger.info(`🔗 Génération URL Lovable...`);

    // Encoder le prompt
    const encodedPrompt = encodeURIComponent(prompt);

    // URL de base
    let url = `https://lovable.dev/?autosubmit=true#prompt=${encodedPrompt}`;

    // Ajouter le logo si fourni
    if (logoUrl) {
      const encodedLogo = encodeURIComponent(logoUrl);
      url += `&images=${encodedLogo}`;
      logger.info(`🖼️  Logo ajouté à l'URL`);
    } else {
      logger.info(`ℹ️  URL sans logo`);
    }

    // Vérifier la longueur de l'URL (limite ~2000 caractères pour certains navigateurs)
    if (url.length > 2000) {
      logger.warn(`⚠️  URL très longue (${url.length} caractères), peut causer des problèmes`);
    }

    return url;
  } catch (error: any) {
    logger.error(`❌ Erreur lors de la génération de l'URL Lovable :`, error.message);
    throw error;
  }
}
