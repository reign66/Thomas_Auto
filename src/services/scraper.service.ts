import axios from 'axios';
import { load, CheerioAPI } from 'cheerio';
import { logger } from '../utils/logger';

/**
 * Résultat du scraping avec contenu et images
 */
export interface ScrapedData {
  content: string;
  logoUrl: string | null;
  images: string[];
  colors: string[];
}

/**
 * Détecte si une image est probablement un logo
 */
function isLikelyLogo(src: string, alt: string, className: string, id: string, parentClasses: string): boolean {
  const indicators = [
    src.toLowerCase().includes('logo'),
    alt.toLowerCase().includes('logo'),
    className.toLowerCase().includes('logo'),
    id.toLowerCase().includes('logo'),
    parentClasses.toLowerCase().includes('logo'),
    src.toLowerCase().includes('brand'),
    className.toLowerCase().includes('brand'),
  ];
  return indicators.some(Boolean);
}

/**
 * Vérifie si une URL d'image est valide et utilisable
 */
function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  if (url.startsWith('data:')) return false; // Exclure les data URIs
  if (url.includes('placeholder')) return false;
  if (url.includes('spacer')) return false;
  if (url.includes('1x1')) return false;
  if (url.includes('pixel')) return false;
  
  // Vérifier les extensions valides
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg', '.gif'];
  const urlLower = url.toLowerCase();
  const hasValidExtension = validExtensions.some(ext => urlLower.includes(ext));
  
  return hasValidExtension || !urlLower.match(/\.(ico|pdf|doc|docx)$/);
}

/**
 * Extrait les couleurs principales depuis les styles CSS inline et les classes
 */
function extractColors($: CheerioAPI): string[] {
  const colors: Set<string> = new Set();
  
  // Extraire les couleurs des styles inline
  $('[style]').each((_, el) => {
    const style = $(el).attr('style') || '';
    
    // Regex pour les couleurs hex
    const hexMatches = style.match(/#[0-9A-Fa-f]{3,6}/g);
    if (hexMatches) {
      hexMatches.forEach(c => colors.add(c));
    }
    
    // Regex pour rgb/rgba
    const rgbMatches = style.match(/rgba?\([^)]+\)/g);
    if (rgbMatches) {
      rgbMatches.forEach(c => colors.add(c));
    }
  });
  
  // Extraire depuis les balises style
  $('style').each((_, el) => {
    const styleContent = $(el).html() || '';
    const hexMatches = styleContent.match(/#[0-9A-Fa-f]{3,6}/g);
    if (hexMatches) {
      hexMatches.forEach(c => colors.add(c));
    }
  });
  
  return Array.from(colors).slice(0, 10);
}

/**
 * Scrape le contenu d'un site web avec extraction des images
 */
export async function scrapeWebsite(url: string): Promise<ScrapedData> {
  try {
    logger.info(`🌐 Scraping du site : ${url}`);

    // Nettoyer l'URL
    const cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      throw new Error(`URL invalide : ${cleanUrl}`);
    }

    const response = await axios.get(cleanUrl, {
      timeout: 30000,
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
    
    // ===== EXTRACTION DES IMAGES (AVANT de supprimer les scripts) =====
    let logoUrl: string | null = null;
    const allImages: Array<{ url: string; alt: string; isLogo: boolean; priority: number }> = [];
    
    // 1. Chercher le favicon/logo dans le head (apple-touch-icon est souvent un bon logo)
    const appleTouchIcon = $('link[rel="apple-touch-icon"]').attr('href');
    const ogImage = $('meta[property="og:image"]').attr('content');
    
    // 2. Chercher les images avec priorité au logo
    $('img[src]').each((index, el) => {
      const src = $(el).attr('src') || '';
      const alt = $(el).attr('alt') || '';
      const className = $(el).attr('class') || '';
      const id = $(el).attr('id') || '';
      const parentClasses = $(el).parent().attr('class') || '';
      
      if (!src || !isValidImageUrl(src)) return;
      
      const fullUrl = src.startsWith('http') ? src : new URL(src, cleanUrl).href;
      const isLogo = isLikelyLogo(src, alt, className, id, parentClasses);
      
      // Calculer la priorité
      let priority = index;
      if (isLogo) priority = -1000; // Logo en premier
      if ($(el).closest('header, nav, .header, .navbar').length > 0) priority -= 500;
      if ($(el).closest('section, .hero, .banner, main').length > 0) priority -= 100;
      if ($(el).closest('footer').length > 0) priority += 500; // Footer moins prioritaire
      
      allImages.push({ url: fullUrl, alt, isLogo, priority });
    });
    
    // 3. Chercher dans les backgrounds CSS
    $('[style*="background"]').each((_, el) => {
      const style = $(el).attr('style') || '';
      const bgMatch = style.match(/url\(['"]?([^'")\s]+)['"]?\)/);
      if (bgMatch && bgMatch[1] && isValidImageUrl(bgMatch[1])) {
        const fullUrl = bgMatch[1].startsWith('http') ? bgMatch[1] : new URL(bgMatch[1], cleanUrl).href;
        allImages.push({ url: fullUrl, alt: 'Background image', isLogo: false, priority: 100 });
      }
    });
    
    // 4. Chercher les vidéos (poster images)
    $('video[poster]').each((_, el) => {
      const poster = $(el).attr('poster');
      if (poster && isValidImageUrl(poster)) {
        const fullUrl = poster.startsWith('http') ? poster : new URL(poster, cleanUrl).href;
        allImages.push({ url: fullUrl, alt: 'Video poster', isLogo: false, priority: 50 });
      }
    });
    
    // Trier par priorité et extraire le logo
    allImages.sort((a, b) => a.priority - b.priority);
    
    // Le logo est la première image marquée comme logo, ou apple-touch-icon
    const logoImage = allImages.find(img => img.isLogo);
    if (logoImage) {
      logoUrl = logoImage.url;
    } else if (appleTouchIcon) {
      logoUrl = appleTouchIcon.startsWith('http') ? appleTouchIcon : new URL(appleTouchIcon, cleanUrl).href;
    }
    
    // Ajouter l'og:image comme image principale si disponible
    if (ogImage && isValidImageUrl(ogImage)) {
      const ogImageUrl = ogImage.startsWith('http') ? ogImage : new URL(ogImage, cleanUrl).href;
      if (!allImages.some(img => img.url === ogImageUrl)) {
        allImages.push({ url: ogImageUrl, alt: 'OG Image', isLogo: false, priority: -50 });
      }
    }
    
    // Extraire les 10 meilleures images (excluant le logo s'il est trouvé)
    const uniqueImages = [...new Set(allImages.map(img => img.url))];
    const finalImages = uniqueImages
      .filter(url => url !== logoUrl)
      .slice(0, 10);
    
    // Extraire les couleurs
    const colors = extractColors($);
    
    // ===== EXTRACTION DU CONTENU TEXTE =====
    // Supprimer les scripts et styles pour le texte
    $('script, style, noscript').remove();

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

    const links: string[] = [];
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      const text = $(el).text().trim();
      if (href && text) {
        links.push(`${text}: ${href}`);
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

LOGO DÉTECTÉ: ${logoUrl || 'Non trouvé'}

IMAGES PRINCIPALES:
${finalImages.slice(0, 10).join('\n')}

COULEURS DÉTECTÉES:
${colors.join(', ')}

URL SOURCE: ${cleanUrl}
`.trim();

    logger.info(`📄 Contenu récupéré : ${content.length} caractères`);
    logger.info(`🖼️  Logo trouvé : ${logoUrl || 'Non'}`);
    logger.info(`🖼️  Images trouvées : ${finalImages.length}`);
    logger.info(`🎨 Couleurs détectées : ${colors.length}`);
    
    return {
      content,
      logoUrl,
      images: finalImages,
      colors,
    };
  } catch (error: any) {
    logger.error(`❌ Erreur lors du scraping de ${url}:`, error.message);
    throw new Error(`Impossible de scraper le site : ${error.message}`);
  }
}
