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
    siteType?: 'Moderne' | 'Très moderne' | 'Rassurant'; 
    directorName?: string;
    sectorActivity?: string;
    geoZone?: string;
    logoUrl?: string;
    colors?: string[];
  }
): Promise<string> {
  try {
    logger.info(`🤖 Appel Claude API pour analyser : ${siteUrl}`);
    logger.info(`📊 Secteur d'activité : ${options?.sectorActivity || 'À déterminer'}`);
    logger.info(`📍 Zone géographique : ${options?.geoZone || 'À déterminer'}`);
    logger.info(`🎨 Type de site : ${options?.siteType || 'Très moderne'}`);
    if (options?.colors?.length) {
      logger.info(`🎨 Couleurs détectées : ${options.colors.join(', ')}`);
    }

    // Générer le prompt SEO optimisé avec le type de design approprié
    const seoPrompt = generateEnhancedSEOPrompt(
      siteUrl,
      scrapedContent,
      prospectName,
      options?.sectorActivity,
      options?.geoZone,
      options?.siteType || 'Très moderne',
      options?.colors
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

    // Instructions d'animations selon le type de site
    let animationsChecklist = '';
    const siteType = options?.siteType || 'Très moderne';
    
    if (siteType === 'Très moderne') {
      animationsChecklist = `
✅ ANIMATIONS FRAMER MOTION (TRÈS MODERNE) :
- [ ] CustomCursor avec effet halo lumineux
- [ ] Animations au scroll sur TOUTES les sections
- [ ] Transitions fluides entre pages avec AnimatePresence
- [ ] Effets parallax et 3D sur les cards
- [ ] Glassmorphism et gradients animés
- [ ] CountUp animé pour les statistiques
- [ ] Micro-interactions sur tous les éléments`;
    } else if (siteType === 'Moderne') {
      animationsChecklist = `
✅ ANIMATIONS SOBRES (MODERNE) :
- [ ] PAS de curseur personnalisé
- [ ] Fade-in simple au scroll
- [ ] Hover subtils sur les boutons (scale: 1.02)
- [ ] Transitions courtes (0.2-0.3s)
- [ ] PAS d'effets 3D complexes
- [ ] Focus sur la lisibilité et l'UX`;
    } else if (siteType === 'Rassurant') {
      animationsChecklist = `
✅ DESIGN RASSURANT - ÉLÉMENTS OBLIGATOIRES :
- [ ] PAS d'animations distrayantes
- [ ] Section équipe avec photos
- [ ] Section services détaillée avec bénéfices
- [ ] Témoignages clients mis en avant
- [ ] Éléments de réassurance (expérience, certifications)
- [ ] Numéro de téléphone VISIBLE en header
- [ ] Design épuré avec beaucoup d'espace blanc
- [ ] Couleurs sobres du site original respectées`;
    }

    // Ajouter des instructions finales spécifiques
    const finalInstructions = `
═══════════════════════════════════════
VÉRIFICATION FINALE - CHECKLIST OBLIGATOIRE
═══════════════════════════════════════

TYPE DE DESIGN : ${siteType}

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

${animationsChecklist}

✅ DIRECTION ARTISTIQUE (DA) :
- [ ] Couleurs du site original RESPECTÉES
- [ ] Logo du client utilisé
- [ ] Images du site original intégrées
- [ ] Ambiance visuelle cohérente avec l'original

NE PAS OUBLIER :
- Le fichier Google DOIT être accessible à : /googlec26cc7c36bbf5118.html
- La sidebar DOIT remonter en haut automatiquement au changement de page
- Le sitemap.xml DOIT lister toutes les URLs du site
- JAMAIS inventer de données - utiliser UNIQUEMENT le contenu scrapé
- RESPECTER la DA et les couleurs du site original

Client : ${prospectName}
Secteur : ${options?.sectorActivity || 'À adapter selon le contenu'}
Zone : ${options?.geoZone || 'À adapter selon le contenu'}
Type de design : ${siteType}
`;

    const finalPrompt = `${claudeResponse}\n\n${finalInstructions}`;

    logger.info(`🔨 Construction prompt final SEO optimisé : ${finalPrompt.length} caractères`);
    
    return finalPrompt;
  } catch (error: any) {
    logger.error(`❌ Erreur lors de l'analyse Claude :`, error.message);
    throw new Error(`Erreur Claude API : ${error.message}`);
  }
}
