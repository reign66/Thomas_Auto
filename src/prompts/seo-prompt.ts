export const SEO_PROMPT_TEMPLATE = `Tu es un expert SEO et développeur web. Je veux que tu analyses le site {URL_DU_SITE} et que tu génères un prompt détaillé pour Lovable afin de créer un site web ULTRA optimisé pour le SEO. 

Contenu du site scrapé :
{SCRAPED_CONTENT}

MAINTENANT, GÉNÈRE UN PROMPT COMPLET POUR LOVABLE QUI DOIT CRÉER :

═══════════════════════════════════════
INFORMATIONS DU CLIENT
═══════════════════════════════════════

Nom du client : {NOM_PROSPECT}
URL du site original : {URL_SITE_ORIGINAL}
Secteur d'activité : {SECTEUR_ACTIVITE}
Zone géographique : {ZONE_GEO}
Type de site : {TYPE_SITE}
Logo du client : {LOGO_URL}
Couleurs du site original : {COULEURS_SITE}

═══════════════════════════════════════
INSTRUCTIONS POUR LOVABLE - CRÉATION DU SITE
═══════════════════════════════════════

Crée un site web optimisé pour le SEO basé sur le site original {URL_SITE_ORIGINAL}. 

RÈGLES ABSOLUES :
1. Ne jamais inventer de données. Utilise UNIQUEMENT les informations du site original.
2. RESPECTER la direction artistique (DA) du site original : couleurs, style, ambiance.
3. Utiliser le logo fourni en priorité absolue.
4. Intégrer les images du site original pour garder la cohérence visuelle.

1. FICHIERS OBLIGATOIRES À LA RACINE :

A. Fichier de vérification Google (public/googlec26cc7c36bbf5118.html) :
\`\`\`html
google-site-verification: googlec26cc7c36bbf5118.html
\`\`\`

B. Fichier sitemap.xml (public/sitemap.xml) - généré dynamiquement avec toutes les pages :
\`\`\`xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>{URL_COMPLETE}/</loc>
    <lastmod>{DATE_ACTUELLE}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Ajouter toutes les autres pages -->
</urlset>
\`\`\`

C. Fichier robots.txt (public/robots.txt) :
\`\`\`
User-agent: *
Allow: /
Disallow: /admin/
Sitemap: {URL_COMPLETE}/sitemap.xml
\`\`\`

2. STRUCTURE SEO COMPLÈTE :

POUR CHAQUE PAGE, implémenter :

A. Balises META optimisées :
- Title unique : "[Mot-clé principal] | {NOM_PROSPECT} - [Localisation]" (max 60 caractères)
- Meta description unique avec appel à l'action (150-160 caractères)
- Meta keywords pertinents pour le secteur
- Canonical URL
- Open Graph complet (og:title, og:description, og:image, og:url, og:type)
- Twitter Card (twitter:card, twitter:title, twitter:description, twitter:image)
- Viewport : <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">

B. Schema.org JSON-LD selon le type d'activité :
\`\`\`javascript
const schemaOrgData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness", // ou Organization selon le cas
  "name": "{NOM_PROSPECT}",
  "description": "Description de l'entreprise basée sur le contenu scrapé",
  "url": "{URL_COMPLETE}",
  "telephone": "{TELEPHONE}",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "{ADRESSE}",
    "addressLocality": "{VILLE}",
    "postalCode": "{CODE_POSTAL}",
    "addressCountry": "FR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "{LATITUDE}",
    "longitude": "{LONGITUDE}"
  },
  "openingHours": "{HORAIRES}",
  "priceRange": "€€",
  "areaServed": "{ZONE_GEO}"
};
\`\`\`

3. HIÉRARCHIE HTML SÉMANTIQUE :
- UN SEUL H1 par page avec le mot-clé principal
- Structure H2 > H3 > H4 logique
- Balises sémantiques : <header>, <nav>, <main>, <article>, <section>, <aside>, <footer>

4. CONTENU OPTIMISÉ :
- Page d'accueil : minimum 1000 mots structurés
- Pages internes : minimum 500-800 mots
- Densité mots-clés : 2-3% pour principal, 1-2% pour secondaires
- FAQ avec 5-10 questions (schema FAQPage)
- Témoignages clients si disponibles

5. IMAGES OPTIMISÉES :
- Format WebP avec fallback JPG/PNG
- Alt descriptif avec mots-clés : alt="{description} {mot-clé}"
- Title informatif
- Loading="lazy" pour toutes les images sauf hero
- Compression < 200KB
- Noms de fichiers descriptifs

6. FONCTIONNALITÉ SIDEBAR IMPORTANTE :
Implémente une fonction JavaScript qui remonte automatiquement la sidebar en haut de la page lors de la navigation :

\`\`\`javascript
// Hook pour remonter la sidebar au changement de page
useEffect(() => {
  const handleRouteChange = () => {
    // Remonter la sidebar
    const sidebar = document.querySelector('.sidebar, aside, [data-sidebar]');
    if (sidebar) {
      sidebar.scrollTop = 0;
    }
    // Remonter aussi la page principale
    window.scrollTo(0, 0);
  };

  // Écouter les changements de route
  window.addEventListener('popstate', handleRouteChange);
  
  // Pour React Router
  return () => {
    window.removeEventListener('popstate', handleRouteChange);
  };
}, [location]); // location depuis useLocation() de React Router
\`\`\`

{DESIGN_INSTRUCTIONS}

8. PERFORMANCE WEB :
- Minification CSS/JS/HTML
- Lazy loading images et composants
- Critical CSS inline
- Cache headers configurés
- Objectifs : PageSpeed > 90, LCP < 2.5s, CLS < 0.1

9. RESPONSIVE MOBILE-FIRST :
- Design Mobile-first (mobile d'abord)
- Breakpoints : 320px, 768px, 1024px, 1440px
- Touch-friendly (boutons 44x44px minimum)
- Menu hamburger fonctionnel
- Texte lisible sans zoom (16px minimum)

10. PAGES OBLIGATOIRES :
- Accueil (avec toutes les sections du site original)
- Services/Produits (détaillés)
- À propos
- Contact avec formulaire
- Mentions légales : {NOM_PROSPECT} - Hébergeur : Ionos
- CGV/CGU
- Politique de confidentialité RGPD
- Plan du site HTML
- Page 404 personnalisée

11. INTÉGRATIONS :
- Google Analytics 4 (GA4) avec ID : {GA_ID}
- Cookie consent RGPD
- Formulaire de contact fonctionnel
- Click-to-call sur numéros de téléphone
- Liens mailto pour emails

12. MAILLAGE INTERNE :
- 3-5 liens internes par page minimum
- Breadcrumbs sur toutes les pages
- Menu footer avec liens principaux
- Ancres descriptives (pas de "cliquez ici")

13. URLS OPTIMISÉES :
- Format : /categorie/sous-categorie
- Tirets pour séparer les mots
- Minuscules uniquement
- Mots-clés dans l'URL

14. SÉCURITÉ :
- HTTPS obligatoire
- Headers de sécurité (CSP, X-Frame-Options, etc.)
- Validation des formulaires côté client et serveur
- Protection CSRF

15. ACCESSIBILITÉ WCAG 2.1 :
- Contraste texte/fond 4.5:1 minimum
- Navigation au clavier
- Attributs ARIA appropriés
- Skip links
- Focus visible

16. COULEURS ET DESIGN :
- Palette basée sur le logo et l'identité visuelle
- Dégradés modernes et contrastes
- Mode sombre optionnel
- Animations fluides partout

IMPORTANT : 
- Utilise React + TypeScript + Tailwind CSS + Framer Motion
- Crée un site TRÈS ANIMÉ et moderne
- N'invente AUCUNE donnée - utilise uniquement le contenu scrapé
- Implémente TOUTES les optimisations SEO listées
- La sidebar doit OBLIGATOIREMENT remonter en haut lors de la navigation entre pages
- Le fichier de vérification Google doit être accessible à /googlec26cc7c36bbf5118.html
- Le sitemap.xml doit être généré et accessible à /sitemap.xml

Commence par créer la structure complète du site avec tous les fichiers nécessaires, puis implémente chaque page avec le contenu scrapé et toutes les optimisations SEO.`;

export const ENHANCED_SEO_INSTRUCTIONS = `
═══════════════════════════════════════
OPTIMISATIONS SEO SUPPLÉMENTAIRES
═══════════════════════════════════════

1. ANALYSE DES MOTS-CLÉS DU SECTEUR :
Basé sur le secteur d'activité "{SECTEUR_ACTIVITE}", intégrer ces mots-clés stratégiques :
- Mots-clés principaux : [extraire du contenu scrapé]
- Mots-clés secondaires : [variations et synonymes]
- Mots-clés longue traîne : [phrases spécifiques au secteur]
- Mots-clés géolocalisés : "{SERVICE} {VILLE}", "{SERVICE} {REGION}"

2. CONTENU SPÉCIFIQUE AU SECTEUR :
Créer des sections adaptées au secteur "{SECTEUR_ACTIVITE}" :
- Section expertise métier
- Cas d'usage spécifiques
- Problématiques clients résolues
- Certifications et labels si mentionnés

3. OPTIMISATION LOCALE RENFORCÉE :
- Mentions de la zone géographique "{ZONE_GEO}" dans :
  * Title de chaque page
  * H1 et H2 stratégiques
  * Footer avec zone de service
  * Page contact avec carte Google Maps intégrée

4. BALISAGE SCHEMA.ORG AVANCÉ :
Ajouter selon le secteur :
- Service schema pour chaque service
- FAQPage pour la FAQ
- BreadcrumbList pour le fil d'Ariane
- Review/AggregateRating si témoignages
- Product si e-commerce
- Event si événements

5. STRATÉGIE DE LIENS INTERNES :
- Créer un cocon sémantique autour des services principaux
- Liens contextuels dans le contenu (3-5 par page)
- Menu méga avec descriptions
- Liens "En savoir plus" vers pages détaillées
- Cross-linking entre services complémentaires

6. PERFORMANCE TECHNIQUE AVANCÉE :
- Preload des fonts critiques
- DNS-prefetch pour domaines tiers
- Resource hints (preconnect, prefetch)
- Service Worker pour cache offline
- Compression Brotli si supportée

7. RICH SNIPPETS :
Implémenter pour améliorer l'affichage Google :
- Étoiles de notation
- Prix si applicable
- Disponibilité services
- FAQ dépliable
- Breadcrumbs visuels

8. MONITORING SEO :
Intégrer les scripts de suivi :
- Google Search Console verification
- Bing Webmaster Tools
- Schema markup testing
- Core Web Vitals monitoring

Le site doit être prêt à se positionner en première page Google pour les requêtes :
- "{SERVICE} {VILLE}"
- "{SECTEUR_ACTIVITE} {REGION}"
- "Meilleur {SERVICE} près de moi"
- Variantes et combinaisons

TOUS ces éléments doivent être implémentés en plus des instructions précédentes.`;

// ═══════════════════════════════════════
// TEMPLATES DE DESIGN PAR TYPE DE SITE
// ═══════════════════════════════════════

/**
 * TRÈS MODERNE - Beaucoup d'animations, effets visuels avancés
 */
export const DESIGN_TRES_MODERNE = `
7. ANIMATIONS AVANCÉES (Framer Motion) - STYLE TRÈS MODERNE :

Ce site doit être ULTRA ANIMÉ avec des effets visuels impressionnants.

Composants animés OBLIGATOIRES :
- CustomCursor avec effet halo lumineux suivant la souris
- AnimatedButton avec rebond (stiffness: 400, damping: 10)
- MagneticCard avec rotation 3D au hover (rotateX, rotateY)
- ParallaxContainer pour effets de profondeur multicouches
- GlowingBorder sur les éléments interactifs
- AnimatedGradient en arrière-plan
- TextReveal pour les titres (caractère par caractère)
- Morphing shapes en SVG animé

Patterns d'animation OBLIGATOIRES :
- Fade-In-Up pour les sections (duration: 0.8, ease: "easeOut")
- Blur-In pour les titres (blur: 10px → 0px)
- Scale-In pour les cards (scale: 0.8 → 1)
- Slide-In-Left/Right pour les listes alternées
- Stagger pour les grilles (delayChildren: 0.1)
- CountUp animé pour les statistiques
- Parallax scrolling sur les images
- 3D tilt effect au hover sur les cards
- Smooth page transitions avec AnimatePresence
- Floating elements avec animation infinie
- Glassmorphism avec backdrop-filter
- Gradient animations sur les boutons

Effets visuels avancés :
- Noise/grain texture subtile en overlay
- Cursor trail effect
- Smooth scroll avec Lenis
- Reveal animations au scroll (every section)
- Micro-interactions sur tous les éléments cliquables
`;

/**
 * MODERNE - Animations sobres, professionnelles
 */
export const DESIGN_MODERNE = `
7. ANIMATIONS SOBRES (Framer Motion) - STYLE MODERNE PROFESSIONNEL :

Ce site doit être élégant avec des animations SUBTILES et professionnelles.
PAS d'effets tape-à-l'œil. Privilégier la lisibilité et l'expérience utilisateur fluide.

Composants animés (sobres) :
- Pas de CustomCursor personnalisé (garder le curseur natif)
- Boutons avec hover simple (scale: 1.02, transition: 0.2s)
- Cards avec élévation au hover (shadow + translateY: -4px)
- Pas de rotation 3D complexe

Patterns d'animation AUTORISÉS :
- Fade-In simple pour les sections (duration: 0.5)
- Pas de Blur-In
- Scale léger pour les cards (0.98 → 1)
- Slide-In subtil (translateY: 20px → 0)
- Stagger léger pour les grilles (delayChildren: 0.05)
- CountUp pour les statistiques uniquement

À ÉVITER ABSOLUMENT :
- Effets parallax complexes
- Curseur personnalisé
- Animations infinies distrayantes
- 3D transforms excessifs
- Glassmorphism exagéré
- Trop de mouvement

Style visuel :
- Design épuré et aéré
- Espaces blancs généreux
- Typographie claire et lisible
- Couleurs du site original respectées
- Transitions douces (0.2-0.3s max)
- Focus sur le contenu, pas sur les effets
`;

/**
 * RASSURANT - Design épuré, centré services/équipe, images business
 */
export const DESIGN_RASSURANT = `
7. DESIGN RASSURANT ET PROFESSIONNEL :

Ce site doit RASSURER le visiteur. Design épuré, sérieux, centré sur la confiance.
OBJECTIF : Montrer le professionnalisme, l'expertise, l'humain derrière l'entreprise.

STYLE VISUEL OBLIGATOIRE :
- Design ÉPURÉ et MINIMALISTE
- Beaucoup d'espace blanc (padding généreux)
- Couleurs sobres du site original + tons neutres (gris, beige, blanc cassé)
- Typographie classique et très lisible (pas de fonts fantaisie)
- Pas d'animations distrayantes

ANIMATIONS MINIMALES :
- Uniquement fade-in au scroll (duration: 0.4s)
- Hover subtil sur les boutons (opacity ou léger scale)
- Pas de curseur personnalisé
- Pas d'effets 3D
- Pas de parallax
- Transitions très courtes (0.15-0.2s)

CONTENU À METTRE EN AVANT (PRIORITÉ) :

1. SECTION ÉQUIPE OBLIGATOIRE :
   - Photos de l'équipe si disponibles dans les images
   - Sinon, utiliser des images professionnelles de travail d'équipe
   - Présentation des membres clés avec leurs rôles
   - Créer une connexion humaine

2. SECTION SERVICES DÉTAILLÉE :
   - Chaque service avec icône sobre
   - Description claire des bénéfices client
   - Images en lien avec chaque service
   - Processus de travail expliqué

3. TÉMOIGNAGES/AVIS CLIENTS :
   - Section prominente avec citations
   - Photos clients si disponibles
   - Étoiles de notation
   - Logos clients/partenaires

4. ÉLÉMENTS DE RÉASSURANCE :
   - Années d'expérience
   - Nombre de clients satisfaits
   - Certifications et labels
   - Garanties proposées
   - Numéro de téléphone VISIBLE en header

5. IMAGES À UTILISER :
   - Images du travail réel de l'entreprise
   - Photos de l'équipe au travail
   - Réalisations/projets concrets
   - Éviter les photos stock génériques
   - Privilégier l'authenticité

STRUCTURE DE PAGE RECOMMANDÉE :
- Hero sobre avec proposition de valeur claire
- Section "Pourquoi nous choisir" avec icônes
- Services présentés en grille simple
- Témoignages clients
- Section équipe avec photos
- FAQ pour répondre aux questions fréquentes
- Call-to-action clair (contact/devis)

PALETTE DE COULEURS :
- Reprendre les couleurs principales du site original
- Ajouter du blanc/gris clair pour l'espace
- Une couleur d'accent pour les CTA
- Éviter les couleurs vives ou agressives
`;

export function generateEnhancedSEOPrompt(
  siteUrl: string,
  scrapedContent: string,
  prospectName: string,
  sectorActivity?: string,
  geoZone?: string,
  siteType: 'Moderne' | 'Très moderne' | 'Rassurant' = 'Très moderne',
  colors?: string[]
): string {
  // Sélectionner le template de design selon le type de site
  let designInstructions: string;
  switch (siteType) {
    case 'Moderne':
      designInstructions = DESIGN_MODERNE;
      break;
    case 'Rassurant':
      designInstructions = DESIGN_RASSURANT;
      break;
    case 'Très moderne':
    default:
      designInstructions = DESIGN_TRES_MODERNE;
      break;
  }

  // Formater les couleurs détectées
  const colorsString = colors && colors.length > 0 
    ? colors.join(', ')
    : '[À extraire du site original]';

  // Remplacer les variables dans le template
  let prompt = SEO_PROMPT_TEMPLATE
    .replace(/{URL_DU_SITE}/g, siteUrl)
    .replace(/{SCRAPED_CONTENT}/g, scrapedContent)
    .replace(/{NOM_PROSPECT}/g, prospectName)
    .replace(/{URL_SITE_ORIGINAL}/g, siteUrl)
    .replace(/{SECTEUR_ACTIVITE}/g, sectorActivity || '[À déterminer depuis le contenu]')
    .replace(/{ZONE_GEO}/g, geoZone || '[À déterminer depuis le contenu]')
    .replace(/{TYPE_SITE}/g, siteType)
    .replace(/{LOGO_URL}/g, '[Logo fourni par le client]')
    .replace(/{COULEURS_SITE}/g, colorsString)
    .replace(/{URL_COMPLETE}/g, 'https://[nouveau-domaine].com')
    .replace(/{DATE_ACTUELLE}/g, new Date().toISOString().split('T')[0])
    .replace(/{TELEPHONE}/g, '[Extraire du contenu scrapé]')
    .replace(/{ADRESSE}/g, '[Extraire du contenu scrapé]')
    .replace(/{VILLE}/g, '[Extraire du contenu scrapé]')
    .replace(/{CODE_POSTAL}/g, '[Extraire du contenu scrapé]')
    .replace(/{LATITUDE}/g, '[À déterminer via Google Maps]')
    .replace(/{LONGITUDE}/g, '[À déterminer via Google Maps]')
    .replace(/{HORAIRES}/g, '[Extraire du contenu scrapé]')
    .replace(/{GA_ID}/g, 'G-XXXXXXXXXX')
    .replace(/{SERVICE}/g, sectorActivity || 'service')
    .replace(/{REGION}/g, geoZone || 'région')
    .replace(/{DESIGN_INSTRUCTIONS}/g, designInstructions);

  // Ajouter les instructions SEO supplémentaires
  const enhancedInstructions = ENHANCED_SEO_INSTRUCTIONS
    .replace(/{SECTEUR_ACTIVITE}/g, sectorActivity || '[À déterminer]')
    .replace(/{ZONE_GEO}/g, geoZone || '[À déterminer]')
    .replace(/{SERVICE}/g, sectorActivity || 'service')
    .replace(/{VILLE}/g, geoZone?.split(',')[0] || 'ville')
    .replace(/{REGION}/g, geoZone || 'région');

  return `${prompt}\n\n${enhancedInstructions}`;
}