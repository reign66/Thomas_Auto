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
 * Instructions communes pour TOUS les types de sites
 */
export const COMMON_SITE_INSTRUCTIONS = `
═══════════════════════════════════════
INSTRUCTIONS COMMUNES - RECRÉATION COMPLÈTE DU SITE
═══════════════════════════════════════

OBJECTIF : Recréer le site web original de A à Z en le modernisant visuellement.

1. ANALYSE ET RECRÉATION DE TOUTES LES PAGES :
   - Analyser TOUTES les pages du site original (liens internes)
   - Créer une page équivalente pour CHAQUE page du site original
   - Conserver la même structure de navigation
   - TOUS les boutons et liens doivent pointer vers des pages RÉELLES
   - Ne jamais créer de liens morts ou de pages placeholder

2. NAVIGATION FONCTIONNELLE :
   - Menu principal avec TOUS les liens vers les pages créées
   - Chaque bouton CTA renvoie vers la bonne page (Contact, Services, etc.)
   - Breadcrumbs fonctionnels sur toutes les pages
   - Footer avec liens vers toutes les pages principales
   - Menu mobile hamburger fonctionnel

3. GÉNÉRATION D'ASSETS VISUELS :
   - Générer des ICÔNES modernes pour chaque service/fonctionnalité
   - Utiliser des icônes de bibliothèques (Lucide, Heroicons)
   - Créer des illustrations simples si nécessaire
   - Badges et éléments graphiques modernes
   - Formes géométriques décoratives

4. IMAGES ET MÉDIAS :
   - Utiliser les images fournies du site original
   - Si images manquantes : utiliser des placeholders de qualité (Unsplash API)
   - Optimiser toutes les images en WebP
   - Lazy loading sur toutes les images sauf hero
   - Alt text descriptif pour le SEO

5. PAGES OBLIGATOIRES À CRÉER :
   - Page d'accueil (/)
   - Page À propos (/about ou /a-propos)
   - Page Services/Produits (/services ou /produits)
   - Page Contact (/contact)
   - Pages individuelles pour chaque service si le site original en a
   - Page Mentions légales (/mentions-legales)
   - Page Politique de confidentialité (/politique-confidentialite)
   - Page 404 personnalisée
   - Toute autre page présente sur le site original

6. COHÉRENCE VISUELLE :
   - Respecter la charte graphique du site original (couleurs, ambiance)
   - Moderniser le design tout en gardant l'identité de marque
   - Logo du client utilisé partout (header, footer, favicon)
   - Palette de couleurs cohérente sur toutes les pages
`;

/**
 * TRÈS MODERNE - Maximum d'animations et effets visuels impressionnants
 */
export const DESIGN_TRES_MODERNE = `
7. STYLE "TRÈS MODERNE" - ANIMATIONS AVANCÉES ET EFFETS WOW :

Ce site doit impressionner visuellement avec des animations fluides et des effets modernes.
Niveau d'animation : MAXIMUM - Site vitrine haut de gamme, agence créative.

COMPOSANTS ANIMÉS OBLIGATOIRES :
- CustomCursor avec effet halo lumineux suivant la souris
- AnimatedButton avec rebond (stiffness: 400, damping: 10)
- MagneticCard avec rotation 3D au hover (rotateX, rotateY jusqu'à 15deg)
- ParallaxContainer pour effets de profondeur multicouches
- GlowingBorder sur les éléments interactifs
- AnimatedGradient en arrière-plan des sections
- TextReveal pour les titres (caractère par caractère ou mot par mot)
- Morphing shapes en SVG animé dans le hero
- FloatingElements avec animation infinie subtile

PATTERNS D'ANIMATION OBLIGATOIRES :
- Fade-In-Up pour les sections (duration: 0.8, ease: "easeOut")
- Blur-In pour les titres principaux (blur: 10px → 0px)
- Scale-In pour les cards (scale: 0.85 → 1)
- Slide-In-Left/Right pour les listes alternées
- Stagger pour les grilles (delayChildren: 0.1, staggerChildren: 0.08)
- CountUp animé pour TOUS les chiffres/statistiques
- Parallax scrolling sur les images de fond
- 3D tilt effect au hover sur toutes les cards
- Page transitions fluides avec AnimatePresence
- Glassmorphism avec backdrop-filter: blur(10px)
- Gradient animations sur les boutons principaux
- Smooth scroll avec effet de easing personnalisé

EFFETS VISUELS AVANCÉS :
- Noise/grain texture subtile en overlay (opacity: 0.03)
- Cursor trail effect optionnel
- Reveal animations au scroll sur CHAQUE section
- Micro-interactions sur tous les éléments cliquables
- Hover states élaborés avec transitions multiples
- Ombres dynamiques qui changent au hover
- Backgrounds avec dégradés animés
- Borders avec effet glow au focus

STYLE VISUEL :
- Design audacieux et créatif
- Contrastes forts
- Typographie moderne et expressive
- Effets de superposition et de profondeur
- Sections pleine largeur avec visuels impactants
`;

/**
 * MODERNE - Design professionnel avec animations élégantes
 */
export const DESIGN_MODERNE = `
7. STYLE "MODERNE" - ANIMATIONS ÉLÉGANTES ET PROFESSIONNELLES :

Ce site doit être moderne, professionnel et visuellement attrayant.
Niveau d'animation : MOYEN - Animations élégantes sans excès.

COMPOSANTS ANIMÉS :
- Boutons avec hover élégant (scale: 1.03, shadow augmentée, transition: 0.3s)
- Cards avec élévation au hover (shadow + translateY: -8px)
- Navigation avec underline animé au hover
- Icons avec rotation ou scale subtil au hover
- Tooltips avec fade-in élégant

PATTERNS D'ANIMATION À UTILISER :
- Fade-In-Up pour les sections (duration: 0.6)
- Scale-In pour les cards (scale: 0.95 → 1)
- Slide-In pour les éléments de liste (translateX: -30px → 0)
- Stagger pour les grilles (delayChildren: 0.08)
- CountUp pour les statistiques
- Smooth reveal au scroll avec Intersection Observer
- Transitions de page fluides

EFFETS VISUELS MODERNES :
- Ombres douces et élégantes (shadow-lg, shadow-xl)
- Dégradés subtils sur les fonds
- Hover states visibles mais pas exagérés
- Micro-animations sur les icônes
- Borders arrondis modernes (rounded-xl, rounded-2xl)
- Glassmorphism léger sur certains éléments (backdrop-blur: 8px)

GÉNÉRATION D'ÉLÉMENTS VISUELS :
- Icônes modernes pour chaque service (Lucide React)
- Badges et tags stylisés
- Séparateurs de sections créatifs
- Illustrations géométriques simples
- Backgrounds avec patterns subtils

STYLE VISUEL :
- Design clean et professionnel
- Espaces blancs bien dosés
- Typographie moderne et lisible
- Couleurs du site original + accents modernes
- Hiérarchie visuelle claire
- Équilibre entre contenu et visuels
`;

/**
 * RASSURANT - Design moderne mais sobre, centré sur la confiance
 */
export const DESIGN_RASSURANT = `
7. STYLE "RASSURANT" - MODERNE SOBRE, CENTRÉ SUR LA CONFIANCE :

Ce site doit rassurer le visiteur tout en étant moderne et professionnel.
Niveau d'animation : LÉGER - Animations présentes mais subtiles et rassurantes.
OBJECTIF : Inspirer confiance, montrer le professionnalisme et l'humain.

ANIMATIONS PRÉSENTES MAIS SUBTILES :
- Fade-in au scroll pour les sections (duration: 0.5)
- Hover élégant sur les boutons (scale: 1.02, shadow légère)
- Cards avec légère élévation au hover
- Transitions douces sur tous les éléments (0.3s ease)
- CountUp pour les chiffres clés (années d'expérience, clients, etc.)
- Icônes avec légère animation au hover

CE QU'IL FAUT ÉVITER :
- Curseur personnalisé (garder le natif)
- Effets 3D complexes
- Parallax agressif
- Animations infinies distrayantes
- Trop de mouvement simultané

ÉLÉMENTS DE RÉASSURANCE OBLIGATOIRES :

1. HEADER RASSURANT :
   - Logo bien visible
   - Numéro de téléphone cliquable en évidence
   - Menu clair et simple
   - Bouton CTA visible (Devis, Contact)

2. SECTION ÉQUIPE/HUMAIN :
   - Photos de l'équipe ou du dirigeant
   - Présentation personnelle et chaleureuse
   - "Qui sommes-nous" mis en avant
   - Créer une connexion humaine

3. PREUVES SOCIALES :
   - Témoignages clients avec photos si possible
   - Logos des clients/partenaires
   - Notes et avis (étoiles)
   - Certifications et labels
   - Années d'expérience
   - Nombre de projets/clients

4. SERVICES DÉTAILLÉS :
   - Chaque service avec icône moderne
   - Description claire des bénéfices
   - Processus de travail expliqué
   - Tarifs ou fourchettes si disponibles

5. FAQ RASSURANTE :
   - Questions fréquentes avec réponses
   - Lever les objections courantes
   - Schema FAQPage pour le SEO

GÉNÉRATION D'ÉLÉMENTS VISUELS :
- Icônes professionnelles pour chaque service
- Badges de confiance (garantie, certifications)
- Illustrations sobres et professionnelles
- Photos de qualité (équipe, réalisations)

STYLE VISUEL :
- Design épuré mais moderne
- Beaucoup d'espace blanc (respiration)
- Couleurs du site original + tons neutres apaisants
- Typographie très lisible (corps 16-18px)
- Contraste élevé pour la lisibilité
- Visuels authentiques (pas trop "stock")

STRUCTURE DE PAGE TYPE :
1. Hero avec proposition de valeur claire + CTA
2. Section "Pourquoi nous choisir" (3-4 points forts)
3. Services en grille claire
4. Témoignages clients
5. Section équipe/à propos
6. FAQ
7. Call-to-action final + Contact
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

  // Combiner instructions communes + instructions spécifiques au type
  const fullDesignInstructions = `${COMMON_SITE_INSTRUCTIONS}\n\n${designInstructions}`;

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
    .replace(/{DESIGN_INSTRUCTIONS}/g, fullDesignInstructions);

  // Ajouter les instructions SEO supplémentaires
  const enhancedInstructions = ENHANCED_SEO_INSTRUCTIONS
    .replace(/{SECTEUR_ACTIVITE}/g, sectorActivity || '[À déterminer]')
    .replace(/{ZONE_GEO}/g, geoZone || '[À déterminer]')
    .replace(/{SERVICE}/g, sectorActivity || 'service')
    .replace(/{VILLE}/g, geoZone?.split(',')[0] || 'ville')
    .replace(/{REGION}/g, geoZone || 'région');

  return `${prompt}\n\n${enhancedInstructions}`;
}