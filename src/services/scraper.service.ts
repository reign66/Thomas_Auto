import axios from 'axios';
import { load } from 'cheerio';
import { logger } from '../utils/logger';

/**
 * Scrape le contenu d'un site web
 */
export async function scrapeWebsite(url: string): Promise<string> {
  try {
    logger.info(`🌐 Scraping du site : ${url}`);

    // Nettoyer l'URL
    const cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      throw new Error(`URL invalide : ${cleanUrl}`);
    }

    const response = await axios.get(cleanUrl, {
      timeout: 30000, // 30 secondes
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'fr-FR,fr;q=0.9,en;q=0.8',
      },
      maxRedirects: 5,
    });

    const $ = load(response.data);

    // Extraire le contenu principal
    const title = $('title').text().trim();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    
    // Supprimer les scripts et styles
    $('script, style, noscript').remove();

    // Extraire le texte des sections principales
    const headings: string[] = [];
    $('h1, h2, h3, h4, h5, h6').each((_, el) => {
      const text = $(el).text().trim();
      if (text) headings.push(text);
    });

    const paragraphs: string[] = [];
    $('p, li, span, div').each((_, el) => {
      const text = $(el).text().trim();
      if (text && text.length > 20) {
        paragraphs.push(text);
      }
    });

    // Extraire les liens
    const links: string[] = [];
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      const text = $(el).text().trim();
      if (href && text) {
        links.push(`${text}: ${href}`);
      }
    });

    // Extraire les images
    const images: string[] = [];
    $('img[src]').each((_, el) => {
      const src = $(el).attr('src');
      const alt = $(el).attr('alt') || '';
      if (src) {
        const fullUrl = src.startsWith('http') ? src : new URL(src, cleanUrl).href;
        images.push(`${alt || 'Image'}: ${fullUrl}`);
      }
    });

    // Construire le contenu structuré
    const content = `
TITRE: ${title}

DESCRIPTION: ${metaDescription}

EN-TÊTES:
${headings.join('\n')}

CONTENU:
${paragraphs.slice(0, 50).join('\n\n')}

LIENS:
${links.slice(0, 30).join('\n')}

IMAGES:
${images.slice(0, 20).join('\n')}

URL SOURCE: ${cleanUrl}
`.trim();

    logger.info(`📄 Contenu récupéré : ${content.length} caractères`);
    return content;
  } catch (error: any) {
    logger.error(`❌ Erreur lors du scraping de ${url}:`, error.message);
    throw new Error(`Impossible de scraper le site : ${error.message}`);
  }
}
