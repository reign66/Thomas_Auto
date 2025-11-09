import { Client } from '@notionhq/client';
import { config } from '../config';
import { logger } from '../utils/logger';

const notion = new Client({
  auth: config.notion.apiKey,
});

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 seconde

/**
 * Retry avec délai exponentiel
 */
async function retryWithDelay<T>(
  fn: () => Promise<T>,
  retries = MAX_RETRIES,
  delay = RETRY_DELAY
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      logger.warn(`⚠️  Erreur, nouvelle tentative dans ${delay}ms... (${retries} restantes)`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retryWithDelay(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

/**
 * Récupère l'URL du logo d'un prospect depuis Notion
 * @param prospectName Nom exact du prospect dans Notion
 * @returns URL du logo ou null si non trouvé
 */
export async function getProspectLogo(prospectName: string): Promise<string | null> {
  try {
    logger.info(`🔍 Recherche logo dans Notion pour : ${prospectName}`);

    const response = await retryWithDelay(async () => {
      return await notion.databases.query({
        database_id: config.notion.databaseId,
        filter: {
          property: 'Nom Du Prospect',
          title: {
            equals: prospectName,
          },
        },
      });
    });

    if (response.results.length === 0) {
      logger.warn(`⚠️  Prospect "${prospectName}" introuvable dans Notion`);
      return null;
    }

    const page = response.results[0] as any;
    const logoProperty = page.properties?.Logo;

    if (!logoProperty || logoProperty.type !== 'files') {
      logger.info(`ℹ️  Pas de logo pour "${prospectName}"`);
      return null;
    }

    const files = logoProperty.files;
    if (!files || files.length === 0) {
      logger.info(`ℹ️  Pas de logo pour "${prospectName}"`);
      return null;
    }

    const logoUrl = files[0]?.file?.url;
    if (!logoUrl) {
      logger.info(`ℹ️  Logo trouvé mais URL invalide pour "${prospectName}"`);
      return null;
    }

    logger.info(`🖼️  Logo trouvé : ${logoUrl}`);
    return logoUrl;
  } catch (error: any) {
    logger.error(`❌ Erreur lors de la récupération du logo pour "${prospectName}":`, error.message);
    return null; // On continue sans logo
  }
}

/**
 * Met à jour un prospect dans Notion
 */
export async function updateProspect(
  prospectName: string,
  lovableUrl: string,
  appointmentDate: Date
): Promise<void> {
  try {
    logger.info(`📊 Mise à jour Notion pour : ${prospectName}`);

    // D'abord, trouver le prospect
    const response = await retryWithDelay(async () => {
      return await notion.databases.query({
        database_id: config.notion.databaseId,
        filter: {
          property: 'Nom Du Prospect',
          title: {
            equals: prospectName,
          },
        },
      });
    });

    if (response.results.length === 0) {
      logger.warn(`⚠️  Prospect "${prospectName}" introuvable pour mise à jour`);
      return;
    }

    const pageId = response.results[0].id;

    // Mettre à jour les propriétés
    await retryWithDelay(async () => {
      return await notion.pages.update({
        page_id: pageId,
        properties: {
          'Website Lovable': {
            url: lovableUrl,
          },
          'Date du rendez-vous': {
            date: {
              start: appointmentDate.toISOString(),
            },
          },
          'Site à faire': {
            checkbox: true,
          },
        },
      });
    });

    logger.info(`✅ Notion mis à jour pour "${prospectName}"`);
  } catch (error: any) {
    logger.error(`❌ Erreur lors de la mise à jour Notion pour "${prospectName}":`, error.message);
    // On ne fait pas échouer le processus si Notion échoue
  }
}
