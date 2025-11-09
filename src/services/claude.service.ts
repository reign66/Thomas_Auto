import Anthropic from '@anthropic-ai/sdk';
import { config } from '../config';
import { logger } from '../utils/logger';

const anthropic = new Anthropic({
  apiKey: config.anthropic.apiKey,
});

const CLAUDE_PROMPT_TEMPLATE = `J'ai ce lien URL d'un site que je veux améliorer pour un client qui a un site bien mais que je veux moderniser pour y ajouter du SEO, modernité visuel et plus clair pour les clients qui se rendent sur le site. Je veux aussi arriver à récupérer les images/hyperliens et toutes les ressources sur site qui doivent être héberger quelque part pour les héberger dans mon serveur. Récupères moi tout ça et fais moi un prompt pour que je puisse télécharger tout ça et faire en sorte que mon prompt puisse générer l'entièreté des fonctionnalités du site tout en modernisant. Je donnerai ensuite ça à Lovable qui me finira le travail. Toi tu dois juste me donner les bonnes instructions pour que Lovable effectue cela. J'aimerais mettre en place un site très animé avec des animations modernes avec des fondues, contrastes je veux qu'il ressente du mouvement dans son site pour qu'il pense réellement que ça vaut le coup donc hésite pas à bien préciser ça. selon ce site web : {URL_DU_SITE}`;

const ANIMATIONS_INSTRUCTIONS = `
Instructions complémentaires obligatoires :
a) N'inventes pas de données, utilise uniquement les informations du site source
b) Site source de référence : {URL_SITE_ORIGINAL}
c) Inclus un pop-up cookies conforme RGPD
d) Crée une page CGV (Conditions Générales de Vente) professionnelle
e) Crée une page Politique de Confidentialité conforme RGPD
f) Crée une page Mentions Légales avec : {NOM_PROSPECT} - Hébergeur : Ionos
g) Utilise le logo fourni en référence pour l'identité visuelle du site

ANIMATIONS OBLIGATOIRES :

Librairie : Framer Motion + react-intersection-observer

Composants UX :
- CustomCursor : Halo qui suit la souris
- AnimatedButton : Effet rebond sur hover/clic (stiffness: 400, damping: 17)
- MagneticCard : Rotation 3D magnétique (stiffness: 300, damping: 30)
- ParallaxContainer : Mouvement 3D selon souris (stiffness: 300, damping: 50)
- useInView : Animations au scroll

Fond : Couleurs contrastées (2-3 tons), dégradés progressifs, parallax 3D OU gradient fluide réactif

Animations par section :
- Hero : Cascade (badges→titre→CTA), blur-in + fade + slide-up, parallax fond
- Stats : Stagger, CountUp, hover avec lift
- Services : Cascade cards, magnétique 3D, icônes animées
- Process : Slide-in left, lignes connectées
- Témoignages : Scale-in + fade, hover élévation
- CTA : Gradient dynamique, parallax 3D

Patterns : Fade-In-Up (sections), Blur-In (titres), Scale-In (cards), Slide-In-Left (listes), Stagger (grilles)

Site TRÈS ANIMÉ, fluide et professionnel partout.`;

/**
 * Analyse un site web avec Claude et génère un prompt pour Lovable
 */
export async function analyzeWebsite(
  siteUrl: string,
  scrapedContent: string,
  prospectName: string
): Promise<string> {
  try {
    logger.info(`🤖 Appel Claude API pour analyser : ${siteUrl}`);

    const prompt = CLAUDE_PROMPT_TEMPLATE.replace('{URL_DU_SITE}', siteUrl);
    
    const fullPrompt = `${prompt}\n\nContenu du site scrapé :\n${scrapedContent}`;

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: fullPrompt,
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

    // Ajouter les instructions d'animations
    const animations = ANIMATIONS_INSTRUCTIONS
      .replace('{URL_SITE_ORIGINAL}', siteUrl)
      .replace('{NOM_PROSPECT}', prospectName);

    const finalPrompt = `${claudeResponse}\n\n${animations}`;

    logger.info(`🔨 Construction prompt final : ${finalPrompt.length} caractères`);
    
    return finalPrompt;
  } catch (error: any) {
    logger.error(`❌ Erreur lors de l'analyse Claude :`, error.message);
    throw new Error(`Erreur Claude API : ${error.message}`);
  }
}
