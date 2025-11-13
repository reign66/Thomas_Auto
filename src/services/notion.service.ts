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

export interface ProspectData {
  name: string;
  website: string;
  email: string;
  phone: string;
  logoUrl: string | null;
  siteType: 'Moderne' | 'Très moderne' | null;
}

/**
 * Extrait les données d'un prospect depuis les propriétés d'une page Notion
 */
function extractProspectDataFromProperties(properties: any, prospectName?: string): ProspectData {
  // Extraire le nom (depuis le titre ou le paramètre)
  let name = prospectName || '';
  const nameProperty = properties?.['Nom Du Prospect'];
  if (nameProperty && nameProperty.type === 'title') {
    const titleArray = nameProperty.title || [];
    if (titleArray.length > 0) {
      name = titleArray.map((t: any) => t.plain_text || '').join('').trim();
    }
  }

  // Extraire le website
  const websiteProperty = properties?.Website;
  const website = websiteProperty?.url || '';

  // Extraire l'email
  const emailProperty = properties?.Email;
  const email = emailProperty?.email || '';

  // Extraire le téléphone
  const phoneProperty = properties?.Téléphone;
  const phone = phoneProperty?.phone_number || '';

  // Extraire le logo
  const logoProperty = properties?.Logo;
  let logoUrl: string | null = null;
  
  if (logoProperty && logoProperty.type === 'files') {
    const files = logoProperty.files;
    if (files && files.length > 0) {
      logoUrl = files[0]?.file?.url || null;
    }
  }

  // Extraire le type de site (select: "Moderne" | "Très moderne")
  let siteType: 'Moderne' | 'Très moderne' | null = null;
  const siteTypeProperty = properties?.['Type de site'];
  if (siteTypeProperty && siteTypeProperty.type === 'select') {
    const selected = siteTypeProperty.select?.name as string | undefined;
    if (selected === 'Moderne' || selected === 'Très moderne') {
      siteType = selected;
    }
  }

  return {
    name,
    website,
    email,
    phone,
    logoUrl,
    siteType,
  };
}

/**
 * Récupère toutes les données d'un prospect depuis Notion (Website + Logo)
 * @param prospectName Nom exact du prospect dans Notion
 * @returns Données du prospect ou null si non trouvé
 */
export async function getProspectByName(prospectName: string): Promise<ProspectData> {
  try {
    logger.info(`🔍 Recherche dans Notion pour : ${prospectName}`);

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
      throw new Error(`Prospect "${prospectName}" introuvable dans Notion`);
    }

    const page = response.results[0] as any;
    const properties = page.properties;

    const prospectData = extractProspectDataFromProperties(properties, prospectName);

    logger.info(`✅ Prospect trouvé : ${prospectData.name}`);
    if (prospectData.logoUrl) {
      logger.info(`🖼️ Logo trouvé : ${prospectData.logoUrl}`);
    } else {
      logger.info(`ℹ️ Pas de logo pour "${prospectData.name}"`);
    }

    return prospectData;
  } catch (error: any) {
    const errorMsg = typeof error.message === 'string' ? error.message : JSON.stringify(error.message);
    logger.error(`❌ Erreur lors de la récupération du prospect "${prospectName}": ${errorMsg}`);
    
    // Si c'est une erreur de database ID (page au lieu de database), donner un message plus clair
    if (errorMsg.includes('is a page, not a database')) {
      throw new Error('NOTION_DATABASE_ID pointe vers une page au lieu d\'une base de données. Vérifiez votre configuration dans Railway.');
    }
    
    throw error;
  }
}

/**
 * Récupère toutes les données d'un prospect depuis Notion par son page ID
 * @param pageId ID de la page Notion
 * @returns Données du prospect
 */
export async function getProspectByPageId(pageId: string): Promise<ProspectData> {
  try {
    logger.info(`🔍 Récupération des données Notion pour la page : ${pageId}`);

    const page = await retryWithDelay(async () => {
      return await notion.pages.retrieve({
        page_id: pageId,
      });
    }) as any;

    const properties = page.properties;
    const prospectData = extractProspectDataFromProperties(properties);

    if (!prospectData.name) {
      throw new Error(`Impossible d'extraire le nom du prospect depuis la page ${pageId}`);
    }

    logger.info(`✅ Données récupérées pour : ${prospectData.name}`);
    if (prospectData.logoUrl) {
      logger.info(`🖼️ Logo trouvé : ${prospectData.logoUrl}`);
    } else {
      logger.info(`ℹ️ Pas de logo pour "${prospectData.name}"`);
    }

    return prospectData;
  } catch (error: any) {
    const errorMsg = typeof error.message === 'string' ? error.message : JSON.stringify(error.message);
    logger.error(`❌ Erreur lors de la récupération du prospect depuis la page ${pageId}: ${errorMsg}`);
    throw error;
  }
}

/**
 * Récupère l'URL du logo d'un prospect depuis Notion (fonction legacy, utiliser getProspectByName)
 * @param prospectName Nom exact du prospect dans Notion
 * @returns URL du logo ou null si non trouvé
 * @deprecated Utiliser getProspectByName à la place
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
