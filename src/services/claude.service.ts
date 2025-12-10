import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config';
import { logger } from '../utils/logger';
import { generateEnhancedSEOPrompt } from '../prompts/seo-prompt';

const anthropic = new Anthropic({
  apiKey: config.anthropic.apiKey,
});

/**
 * Analyse un site web avec Claude et génère un prompt pour Lovable
 */
export async function analyzeWebsite(
  siteUrl: string,
  scrapedContent: string,
  prospectName: string,
  options?: { 
    siteType?: 'Moderne' | 'Très moderne'; 
    directorName?: string;
    sectorActivity?: string;
    geoZone?: string;
    logoUrl?: string;
  }
): Promise<string> {
  try {
    logger.info(`🤖 Appel Claude API pour analyser : ${siteUrl}`);
    logger.info(`📊 Secteur d'activité : ${options?.sectorActivity || 'À déterminer'}`);
    logger.info(`📍 Zone géographique : ${options?.geoZone || 'À déterminer'}`);
    logger.info(`🎨 Type de site : ${options?.siteType || 'Très moderne'}`);

    // Générer le prompt SEO optimisé
    const seoPrompt = generateEnhancedSEOPrompt(
      siteUrl,
      scrapedContent,
      prospectName,
      options?.sectorActivity,
      options?.geoZone,
      options?.siteType || 'Très moderne'
    );

    // Ajouter les informations du logo si disponible
    let enhancedPrompt = seoPrompt;
    if (options?.logoUrl) {
      enhancedPrompt = enhancedPrompt.replace(
        '[Logo fourni par le client]',
        `Logo URL : ${options.logoUrl}`
      );
    }

    // Appeler Claude avec le prompt SEO optimisé
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5',
      max_tokens: 8192, // Augmenté pour permettre des réponses plus détaillées
      temperature: 0.7, // Pour plus de créativité dans les suggestions SEO
      messages: [
        {
          role: 'user',
          content: enhancedPrompt,
        },
      ],
    });

    const claudeResponse = message.content
      .map((block: any) => {
        if (block.type === 'text') {
          return block.text;
        }
        return '';
      })
      .join('\n');

    logger.info(`✅ Réponse Claude : ${claudeResponse.length} caractères`);

    // Ajouter des instructions finales spécifiques
    const finalInstructions = `
═══════════════════════════════════════
VÉRIFICATION FINALE - CHECKLIST OBLIGATOIRE
═══════════════════════════════════════

Assure-toi que le site généré inclut ABSOLUMENT :

✅ FICHIERS À LA RACINE :
- [ ] /googlec26cc7c36bbf5118.html avec le contenu exact : "google-site-verification: googlec26cc7c36bbf5118.html"
- [ ] /sitemap.xml généré dynamiquement avec TOUTES les pages
- [ ] /robots.txt avec référence au sitemap

✅ FONCTIONNALITÉS TECHNIQUES :
- [ ] Sidebar qui remonte automatiquement en haut lors de la navigation entre pages
- [ ] useEffect hook sur le changement de route pour scroll to top
- [ ] window.scrollTo(0, 0) et sidebar.scrollTop = 0 implémentés

✅ SEO COMPLET :
- [ ] Balises meta uniques par page (title, description, keywords)
- [ ] Open Graph et Twitter Cards sur toutes les pages
- [ ] Schema.org JSON-LD adapté au secteur "${options?.sectorActivity || 'activité'}"
- [ ] Mots-clés géolocalisés pour "${options?.geoZone || 'zone géographique'}"
- [ ] UN SEUL H1 par page avec mot-clé principal

✅ CONTENU OPTIMISÉ :
- [ ] Minimum 1000 mots sur la page d'accueil
- [ ] Minimum 500 mots sur les pages internes
- [ ] FAQ avec schema FAQPage
- [ ] Densité de mots-clés respectée (2-3% principal, 1-2% secondaires)

✅ PERFORMANCE :
- [ ] Images en WebP avec lazy loading
- [ ] Minification CSS/JS/HTML
- [ ] Score PageSpeed > 90
- [ ] Mobile-first responsive

✅ PAGES LÉGALES :
- [ ] Mentions légales avec : ${prospectName} - Hébergeur : Ionos
- [ ] Politique de confidentialité RGPD
- [ ] CGV/CGU
- [ ] Cookie consent banner

✅ ANIMATIONS FRAMER MOTION :
- [ ] CustomCursor avec effet halo
- [ ] Animations au scroll sur toutes les sections
- [ ] Transitions fluides entre pages
- [ ] Effets parallax et 3D

NE PAS OUBLIER :
- Le fichier Google DOIT être accessible à : /googlec26cc7c36bbf5118.html
- La sidebar DOIT remonter en haut automatiquement au changement de page
- Le sitemap.xml DOIT lister toutes les URLs du site
- JAMAIS inventer de données - utiliser UNIQUEMENT le contenu scrapé

Client : ${prospectName}
Secteur : ${options?.sectorActivity || 'À adapter selon le contenu'}
Zone : ${options?.geoZone || 'À adapter selon le contenu'}
`;

    const finalPrompt = `${claudeResponse}\n\n${finalInstructions}`;

    logger.info(`🔨 Construction prompt final SEO optimisé : ${finalPrompt.length} caractères`);
    
    return finalPrompt;
  } catch (error: any) {
    logger.error(`❌ Erreur lors de l'analyse Claude :`, error.message);
    throw new Error(`Erreur Claude API : ${error.message}`);
  }
}
