# 🚀 PROMPT SEO MEGA OPTIMISÉ POUR LOVABLE

## INSTRUCTIONS INITIALES OBLIGATOIRES

Tu es un expert en développement web et SEO. Tu dois créer un site web **ultra-optimisé pour le référencement** en suivant **TOUTES** les instructions ci-dessous. **AUCUNE EXCEPTION N'EST TOLÉRÉE**.

### ⚡ EXIGENCES TECHNIQUES PRIORITAIRES

1. **FICHIER GOOGLE SITE VERIFICATION** (OBLIGATOIRE)
   - Crée immédiatement le fichier `googlec26cc7c36bbf5118.html` à la racine
   - Ce fichier doit contenir exactement : `google-site-verification: googlec26cc7c36bbf5118.html`

2. **FICHIER SITEMAP.XML** (OBLIGATOIRE)
   - Génère automatiquement un `sitemap.xml` à la racine
   - Inclure TOUTES les pages du site
   - Format standard avec lastmod, changefreq, priority
   - Mise à jour automatique lors d'ajout de pages

3. **COMPORTEMENT SIDEBAR** (OBLIGATOIRE)
   - Lors de chaque changement de page, la sidebar doit **automatiquement** remonter en haut
   - Utiliser `window.scrollTo(0, 0)` ou `scroll-behavior: smooth` sur navigation
   - Animation fluide de 300ms

---

## 📋 INFORMATIONS DU CLIENT À REMPLACER

```
NOM_ENTREPRISE: [NOM_ENTREPRISE]
SECTEUR_ACTIVITE: [SECTEUR_ACTIVITE]
ZONE_GEOGRAPHIQUE: [ZONE_GEOGRAPHIQUE]
VILLE: [VILLE]
TELEPHONE: [TELEPHONE]
EMAIL: [EMAIL]
MOTS_CLES_PRINCIPAUX: [MOT_CLE_1], [MOT_CLE_2], [MOT_CLE_3]
SERVICES_PRINCIPAUX: [SERVICE_1], [SERVICE_2], [SERVICE_3]
URL_SITE: [URL_SITE]
COULEUR_PRINCIPALE: [COULEUR_PRINCIPALE]
COULEUR_SECONDAIRE: [COULEUR_SECONDAIRE]
```

---

## 🎯 1. STRUCTURE DES PAGES ET BALISES SEO

### PAGE D'ACCUEIL
```html
<head>
  <!-- Balises essentielles -->
  <title>[MOT_CLE_1] [VILLE] | [NOM_ENTREPRISE] - Expert [SECTEUR_ACTIVITE]</title>
  <meta name="description" content="[NOM_ENTREPRISE], votre expert en [SECTEUR_ACTIVITE] à [VILLE]. [SERVICE_1], [SERVICE_2], [SERVICE_3]. ✓ Devis gratuit ✓ Intervention rapide ☎ [TELEPHONE]">
  <meta name="keywords" content="[MOT_CLE_1], [MOT_CLE_2], [MOT_CLE_3], [SECTEUR_ACTIVITE] [VILLE], [SERVICE_1] [ZONE_GEOGRAPHIQUE]">
  
  <!-- Open Graph -->
  <meta property="og:title" content="[NOM_ENTREPRISE] - [SECTEUR_ACTIVITE] à [VILLE]">
  <meta property="og:description" content="Expert en [SECTEUR_ACTIVITE] depuis X ans. [SERVICE_1], [SERVICE_2]. Contactez-nous au [TELEPHONE]">
  <meta property="og:image" content="/og-image.jpg">
  <meta property="og:url" content="[URL_SITE]">
  <meta property="og:type" content="website">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="[NOM_ENTREPRISE] - [SECTEUR_ACTIVITE]">
  <meta name="twitter:description" content="Votre expert [SECTEUR_ACTIVITE] à [VILLE]">
  
  <!-- Google Site Verification -->
  <meta name="google-site-verification" content="googlec26cc7c36bbf5118">
  
  <!-- Canonical -->
  <link rel="canonical" href="[URL_SITE]">
</head>
```

### PAGES DE SERVICES
Pour chaque service, créer une page dédiée :
- `/services/[SERVICE_1_URL]`
- `/services/[SERVICE_2_URL]`
- `/services/[SERVICE_3_URL]`

Titre type : `[SERVICE] à [VILLE] - [NOM_ENTREPRISE] | Prix & Devis`

---

## 🏗️ 2. STRUCTURE HTML SÉMANTIQUE OBLIGATOIRE

```html
<!DOCTYPE html>
<html lang="fr">
<head>
  <!-- Toutes les balises SEO ci-dessus -->
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="index, follow">
  <meta name="language" content="fr">
  <meta name="author" content="[NOM_ENTREPRISE]">
</head>
<body>
  <header>
    <nav aria-label="Navigation principale">
      <!-- Logo + Navigation -->
    </nav>
  </header>
  
  <main>
    <section class="hero">
      <h1>[SECTEUR_ACTIVITE] à [VILLE] - [NOM_ENTREPRISE]</h1>
      <!-- Un seul H1 par page -->
    </section>
    
    <section class="services">
      <h2>Nos Services de [SECTEUR_ACTIVITE]</h2>
      <!-- Contenu structuré -->
    </section>
    
    <section class="about">
      <h2>Votre Expert [SECTEUR_ACTIVITE] à [VILLE]</h2>
      <!-- Contenu local SEO -->
    </section>
  </main>
  
  <aside class="sidebar">
    <!-- Sidebar qui remonte automatiquement -->
  </aside>
  
  <footer>
    <!-- Informations légales + NAP -->
  </footer>
</body>
</html>
```

---

## 📝 3. CONTENU SEO OPTIMISÉ (MINIMUM REQUIS)

### PAGE D'ACCUEIL (1500+ mots)
1. **Hero Section** (200 mots)
   - H1 avec [MOT_CLE_PRINCIPAL] + [VILLE]
   - Proposition de valeur claire
   - CTA principal visible

2. **Services Section** (500 mots)
   - 3-4 services détaillés
   - Mots-clés naturellement intégrés
   - Liens internes vers pages services

3. **Pourquoi Nous Choisir** (300 mots)
   - Points de différenciation
   - Certifications/garanties
   - Expérience locale

4. **Zone d'Intervention** (200 mots)
   - Villes desservies
   - Carte interactive si possible
   - Contenu géolocalisé

5. **FAQ** (400 mots)
   - 8-10 questions fréquentes
   - Réponses détaillées
   - Schema FAQ

6. **Témoignages** (200 mots)
   - 3-5 avis clients
   - Schema Review

### PAGES DE SERVICES (800+ mots chacune)
- Introduction avec mot-clé principal
- Processus détaillé
- Avantages spécifiques
- Tarifs/devis
- FAQ spécifique au service
- CTA multiples

---

## 🔧 4. SCHEMA.ORG JSON-LD (OBLIGATOIRE)

```javascript
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "[NOM_ENTREPRISE]",
  "description": "Expert en [SECTEUR_ACTIVITE] à [VILLE]",
  "url": "[URL_SITE]",
  "telephone": "[TELEPHONE]",
  "email": "[EMAIL]",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[ADRESSE]",
    "addressLocality": "[VILLE]",
    "postalCode": "[CODE_POSTAL]",
    "addressCountry": "FR"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "[LATITUDE]",
    "longitude": "[LONGITUDE]"
  },
  "openingHours": "Mo-Fr 08:00-19:00",
  "priceRange": "€€",
  "image": "[URL_SITE]/logo.jpg",
  "sameAs": [
    "[URL_FACEBOOK]",
    "[URL_LINKEDIN]",
    "[URL_INSTAGRAM]"
  ],
  "areaServed": {
    "@type": "City",
    "name": "[ZONE_GEOGRAPHIQUE]"
  }
}
</script>
```

---

## 🖼️ 5. OPTIMISATION DES IMAGES

### Règles strictes pour TOUTES les images :
```html
<img 
  src="/images/[mot-cle-descriptif].webp" 
  alt="[Description précise avec mot-clé] à [VILLE]"
  title="[Titre informatif] - [NOM_ENTREPRISE]"
  loading="lazy"
  width="800"
  height="600"
  decoding="async"
/>
```

### Formats et compression :
- Format WebP prioritaire
- Fallback JPG avec `<picture>`
- Compression max 150KB par image
- Srcset pour responsive

---

## ⚡ 6. PERFORMANCE WEB (CORE WEB VITALS)

### Objectifs OBLIGATOIRES :
- **LCP** < 2.5s
- **FID** < 100ms
- **CLS** < 0.1
- **PageSpeed Score** > 90

### Optimisations techniques :
```javascript
// Lazy loading pour images
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      imageObserver.unobserve(img);
    }
  });
});

// Scroll to top sur changement de page
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Router avec scroll automatique
router.afterEach(() => {
  scrollToTop();
  document.querySelector('.sidebar')?.scrollTo(0, 0);
});
```

---

## 📱 7. RESPONSIVE & MOBILE-FIRST

### CSS Mobile-First :
```css
/* Base mobile */
.container {
  padding: 1rem;
  width: 100%;
}

/* Tablette */
@media (min-width: 768px) {
  .container {
    max-width: 750px;
    margin: 0 auto;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
  }
}

/* Sidebar scroll reset */
.sidebar {
  scroll-behavior: smooth;
  overflow-y: auto;
}

.sidebar.reset-scroll {
  scroll-top: 0;
}
```

---

## 🔗 8. MAILLAGE INTERNE STRATÉGIQUE

### Structure de liens obligatoire :
1. **Header** : Accueil, Services (dropdown), À propos, Contact
2. **Footer** : Plan du site, Mentions légales, Services principaux
3. **Dans le contenu** : 3-5 liens contextuels par page
4. **Breadcrumbs** : Sur toutes les pages internes

### Exemple de liens optimisés :
```html
<a href="/services/[SERVICE_URL]" 
   title="[SERVICE] à [VILLE]">
   [SERVICE] professionnels à [VILLE]
</a>
```

---

## 📊 9. FICHIERS TECHNIQUES OBLIGATOIRES

### robots.txt
```txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Sitemap: [URL_SITE]/sitemap.xml
```

### sitemap.xml (généré automatiquement)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>[URL_SITE]/</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>[URL_SITE]/services/[SERVICE_1_URL]</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- Toutes les autres pages -->
</urlset>
```

### .htaccess (si Apache)
```apache
# Compression GZIP
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/javascript
</IfModule>

# Cache navigateur
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
</IfModule>

# Redirection HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]
```

---

## 🎨 10. DESIGN & UX MODERNE

### Éléments OBLIGATOIRES :
1. **Hero Section** accrocheuse avec CTA
2. **Barre de confiance** (certifications, garanties)
3. **Témoignages** avec photos
4. **Galerie** avant/après (si applicable)
5. **Formulaire de contact** flottant ou fixe
6. **Chat** ou bouton WhatsApp
7. **Numéro de téléphone** sticky sur mobile
8. **Animations** subtiles au scroll
9. **Dark mode** (optionnel mais recommandé)
10. **Loading** optimisé avec skeleton screens

---

## ✅ 11. CHECKLIST FINALE DE VALIDATION

### Avant de livrer, VÉRIFIER ABSOLUMENT :
- [ ] Fichier `googlec26cc7c36bbf5118.html` créé à la racine avec le contenu correct
- [ ] Sitemap.xml généré avec TOUTES les pages
- [ ] Sidebar remonte automatiquement au changement de page
- [ ] Toutes les pages ont Title + Description uniques
- [ ] H1 unique par page avec mot-clé principal
- [ ] Minimum 1000 mots page d'accueil
- [ ] Minimum 500 mots pages internes
- [ ] Schema LocalBusiness implémenté
- [ ] Toutes les images ont alt optimisé
- [ ] PageSpeed Score > 85
- [ ] Site 100% responsive
- [ ] HTTPS actif
- [ ] Robots.txt avec sitemap
- [ ] Formulaires fonctionnels
- [ ] CTAs visibles sur chaque page
- [ ] Numéro téléphone cliquable
- [ ] Mentions légales + RGPD
- [ ] 404 personnalisée
- [ ] Breadcrumbs sur pages internes
- [ ] Compression images active
- [ ] CSS/JS minifiés
- [ ] Analytics GA4 installé

---

## 🚨 RAPPEL CRITIQUE

**CE PROMPT DOIT ÊTRE SUIVI À LA LETTRE**. Chaque élément est crucial pour le référencement. Ne pas implémenter ces optimisations = site invisible sur Google.

**PRIORITÉ ABSOLUE** :
1. Fichier Google verification
2. Sitemap.xml automatique
3. Sidebar scroll reset
4. SEO local avec [VILLE] et [SECTEUR_ACTIVITE]
5. Performance optimale

---

## 💡 EXEMPLE D'UTILISATION DU PROMPT

Remplacez les placeholders par les vraies informations :
```
NOM_ENTREPRISE: Plomberie Dupont
SECTEUR_ACTIVITE: Plomberie et chauffage
ZONE_GEOGRAPHIQUE: Île-de-France
VILLE: Paris
TELEPHONE: 01 23 45 67 89
EMAIL: contact@plomberiedupont.fr
MOTS_CLES_PRINCIPAUX: plombier Paris, dépannage plomberie, urgence fuite
SERVICES_PRINCIPAUX: Dépannage urgence, Installation sanitaire, Rénovation salle de bain
URL_SITE: https://www.plomberiedupont.fr
COULEUR_PRINCIPALE: #2563eb
COULEUR_SECONDAIRE: #f59e0b
```