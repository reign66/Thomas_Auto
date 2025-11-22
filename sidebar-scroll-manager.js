/**
 * GESTIONNAIRE DE SCROLL POUR SIDEBAR ET NAVIGATION
 * Assure que la sidebar remonte automatiquement en haut à chaque changement de page
 */

// ============================================
// 1. GESTION DU SCROLL DE LA SIDEBAR
// ============================================

class SidebarScrollManager {
  constructor() {
    this.sidebar = null;
    this.init();
  }

  init() {
    // Sélectionner la sidebar
    this.sidebar = document.querySelector('.sidebar, aside, [data-sidebar]');
    
    // Écouter les changements de route
    this.setupRouteListeners();
    
    // Écouter les clics sur les liens
    this.setupLinkListeners();
  }

  // Reset du scroll de la sidebar
  resetSidebarScroll() {
    if (this.sidebar) {
      // Méthode 1: Scroll instantané
      this.sidebar.scrollTop = 0;
      
      // Méthode 2: Scroll animé (optionnel)
      this.sidebar.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
    
    // Reset aussi le scroll de la page principale
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  // Configuration pour React Router
  setupReactRouter() {
    // Si vous utilisez React Router
    if (window.history && window.history.pushState) {
      const originalPushState = window.history.pushState;
      const originalReplaceState = window.history.replaceState;
      
      window.history.pushState = function() {
        originalPushState.apply(window.history, arguments);
        setTimeout(() => this.resetSidebarScroll(), 100);
      }.bind(this);
      
      window.history.replaceState = function() {
        originalReplaceState.apply(window.history, arguments);
        setTimeout(() => this.resetSidebarScroll(), 100);
      }.bind(this);
    }
  }

  // Configuration pour Vue Router
  setupVueRouter() {
    if (window.router) {
      window.router.afterEach(() => {
        this.resetSidebarScroll();
      });
    }
  }

  // Configuration pour Next.js
  setupNextRouter() {
    if (window.next && window.next.router) {
      window.next.router.events.on('routeChangeComplete', () => {
        this.resetSidebarScroll();
      });
    }
  }

  // Écouter les changements de route (générique)
  setupRouteListeners() {
    // Méthode 1: Observer les changements d'URL
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        this.resetSidebarScroll();
      }
    }).observe(document, { subtree: true, childList: true });

    // Méthode 2: Écouter popstate (navigation navigateur)
    window.addEventListener('popstate', () => {
      this.resetSidebarScroll();
    });

    // Méthode 3: Écouter hashchange (pour les SPA avec hash routing)
    window.addEventListener('hashchange', () => {
      this.resetSidebarScroll();
    });
  }

  // Écouter les clics sur tous les liens
  setupLinkListeners() {
    document.addEventListener('click', (e) => {
      // Vérifier si c'est un lien
      const link = e.target.closest('a');
      
      if (link && link.href) {
        // Vérifier si c'est un lien interne
        const isInternal = link.href.startsWith(window.location.origin) ||
                          link.href.startsWith('/') ||
                          link.href.startsWith('#');
        
        if (isInternal) {
          // Attendre un peu pour que la navigation se fasse
          setTimeout(() => {
            this.resetSidebarScroll();
          }, 100);
        }
      }
    });
  }
}

// ============================================
// 2. OPTIMISATIONS PERFORMANCE
// ============================================

class PerformanceOptimizer {
  constructor() {
    this.init();
  }

  init() {
    this.setupLazyLoading();
    this.setupPrefetch();
    this.setupImageOptimization();
  }

  // Lazy loading pour images
  setupLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            
            // Charger l'image
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }
            
            // Charger le srcset si présent
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
              img.removeAttribute('data-srcset');
            }
            
            // Ajouter une classe pour l'animation
            img.classList.add('loaded');
            
            // Arrêter d'observer cette image
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      // Observer toutes les images avec data-src
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // Prefetch des liens au survol
  setupPrefetch() {
    const prefetchLink = (url) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    };

    // Prefetch au survol des liens
    document.addEventListener('mouseover', (e) => {
      const link = e.target.closest('a');
      if (link && link.href && !link.dataset.prefetched) {
        const isInternal = link.href.startsWith(window.location.origin);
        if (isInternal) {
          prefetchLink(link.href);
          link.dataset.prefetched = 'true';
        }
      }
    });
  }

  // Optimisation des images WebP avec fallback
  setupImageOptimization() {
    // Vérifier le support WebP
    const supportsWebP = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('image/webp') === 0;
    };

    if (!supportsWebP()) {
      // Remplacer les images WebP par leur fallback
      document.querySelectorAll('img[data-fallback]').forEach(img => {
        img.src = img.dataset.fallback;
      });
    }
  }
}

// ============================================
// 3. GESTION DU SITEMAP DYNAMIQUE
// ============================================

class DynamicSitemapGenerator {
  constructor() {
    this.pages = [];
    this.init();
  }

  init() {
    // Collecter toutes les pages
    this.collectPages();
    
    // Générer le sitemap
    this.generateSitemap();
  }

  collectPages() {
    // Récupérer tous les liens internes
    const links = document.querySelectorAll('a[href]');
    const uniqueUrls = new Set();

    links.forEach(link => {
      const url = new URL(link.href, window.location.origin);
      if (url.origin === window.location.origin) {
        uniqueUrls.add(url.href);
      }
    });

    // Convertir en array avec métadonnées
    this.pages = Array.from(uniqueUrls).map(url => ({
      loc: url,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: this.determineChangeFreq(url),
      priority: this.determinePriority(url)
    }));
  }

  determineChangeFreq(url) {
    if (url.includes('/blog/') || url.includes('/actualites/')) return 'weekly';
    if (url.includes('/services/')) return 'monthly';
    if (url.includes('/mentions-legales') || url.includes('/cgv')) return 'yearly';
    if (url === window.location.origin + '/') return 'weekly';
    return 'monthly';
  }

  determinePriority(url) {
    if (url === window.location.origin + '/') return '1.0';
    if (url.includes('/services/')) return '0.8';
    if (url.includes('/contact')) return '0.8';
    if (url.includes('/blog/')) return '0.6';
    if (url.includes('/mentions-legales') || url.includes('/cgv')) return '0.3';
    return '0.5';
  }

  generateSitemap() {
    // Cette fonction génère le contenu du sitemap
    // En production, cela devrait être fait côté serveur
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${this.pages.map(page => `  <url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
    
    // Stocker le sitemap (pour envoi au serveur)
    window.generatedSitemap = sitemap;
    console.log('Sitemap généré:', sitemap);
  }
}

// ============================================
// 4. TRACKING ET ANALYTICS
// ============================================

class AnalyticsTracker {
  constructor() {
    this.init();
  }

  init() {
    this.setupScrollTracking();
    this.setupClickTracking();
    this.setupFormTracking();
  }

  // Tracker la profondeur de scroll
  setupScrollTracking() {
    let maxScroll = 0;
    let scrollPoints = [25, 50, 75, 100];
    let triggered = new Set();

    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round(
        (window.scrollY + window.innerHeight) / document.body.scrollHeight * 100
      );

      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;

        scrollPoints.forEach(point => {
          if (scrollPercent >= point && !triggered.has(point)) {
            triggered.add(point);
            this.trackEvent('Scroll', 'Depth', `${point}%`);
          }
        });
      }
    });
  }

  // Tracker les clics sur CTA
  setupClickTracking() {
    document.addEventListener('click', (e) => {
      const target = e.target;

      // Tracker les CTA
      if (target.matches('.cta, [data-cta], .btn-primary')) {
        this.trackEvent('CTA', 'Click', target.textContent || 'Unknown');
      }

      // Tracker les téléphones
      if (target.matches('a[href^="tel:"]')) {
        this.trackEvent('Contact', 'Phone', target.href);
      }

      // Tracker les emails
      if (target.matches('a[href^="mailto:"]')) {
        this.trackEvent('Contact', 'Email', target.href);
      }
    });
  }

  // Tracker les soumissions de formulaire
  setupFormTracking() {
    document.addEventListener('submit', (e) => {
      const form = e.target;
      const formName = form.dataset.name || form.id || 'Unknown Form';
      this.trackEvent('Form', 'Submit', formName);
    });
  }

  // Méthode générique pour envoyer les événements
  trackEvent(category, action, label) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        'event_category': category,
        'event_label': label
      });
    }

    // Google Analytics Universal
    if (typeof ga !== 'undefined') {
      ga('send', 'event', category, action, label);
    }

    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
      fbq('track', 'ViewContent', {
        content_category: category,
        content_name: label
      });
    }

    console.log(`Event tracked: ${category} - ${action} - ${label}`);
  }
}

// ============================================
// 5. INITIALISATION AU CHARGEMENT
// ============================================

// Attendre que le DOM soit chargé
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAll);
} else {
  initializeAll();
}

function initializeAll() {
  // Initialiser tous les managers
  const sidebarManager = new SidebarScrollManager();
  const performanceOptimizer = new PerformanceOptimizer();
  const sitemapGenerator = new DynamicSitemapGenerator();
  const analyticsTracker = new AnalyticsTracker();

  // Exposer globalement pour debugging
  window.SEOManagers = {
    sidebar: sidebarManager,
    performance: performanceOptimizer,
    sitemap: sitemapGenerator,
    analytics: analyticsTracker
  };

  console.log('✅ SEO Managers initialisés avec succès');
}

// ============================================
// 6. FONCTION UTILITAIRES EXPORTÉES
// ============================================

// Fonction pour forcer le reset du scroll (utilisable manuellement)
window.resetAllScrolls = function() {
  // Reset sidebar
  const sidebar = document.querySelector('.sidebar, aside, [data-sidebar]');
  if (sidebar) {
    sidebar.scrollTop = 0;
  }

  // Reset page principale
  window.scrollTo(0, 0);

  // Reset tous les éléments scrollables
  document.querySelectorAll('[data-scrollable]').forEach(el => {
    el.scrollTop = 0;
  });

  console.log('✅ Tous les scrolls réinitialisés');
};

// Fonction pour régénérer le sitemap
window.regenerateSitemap = function() {
  const generator = new DynamicSitemapGenerator();
  return window.generatedSitemap;
};