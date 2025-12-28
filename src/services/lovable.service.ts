import { logger } from '../utils/logger';

/**
 * Instructions SSG (Static Site Generation) à ajouter au prompt Lovable
 * Ces instructions permettent de générer un site statique optimisé pour le SEO
 */
const SSG_INSTRUCTIONS = `

#IMPLEMENT SSG (STATIC SITE GENERATION) EXACTLY AS PER THE BELOW WITHOUT DEVIATION

##FOLLOWING IMPLEMENTATION PROVIDE ME WITH INSTRUCTION ON HOW TO MANUALLY REPLACE/UPDATE THE EXISTING SCRIPTS NODE IN THE PACKAGE.JSON INCLUDING ANY TRAILING COMMAS

# Added placeholder to insert rendered content
diff --git index.html index.html
--- index.html
+++ index.html
@@ -13 +13 @@
-    <div id="root"></div>
+    <div id="root"><!--app-html--></div>

# Added prerender script to generate static HTML
# NOTE THIS MUST BE .JS AS WILL BE RUN VIA NODE
diff --git prerender.js prerender.js
new file mode 100644
--- /dev/null
+++ prerender.js
@@ -0,0 +1,35 @@
+import fs from 'node:fs'
+import path from 'node:path'
+import url from 'node:url'
+
+const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
+const toAbsolute = (p) => path.resolve(__dirname, p)
+
+const template = fs.readFileSync(toAbsolute('dist/index.html'), 'utf-8')
+const { render } = await import('./dist/server/entry-server.js')
+
+const routesToPrerender = fs
+  .readdirSync(toAbsolute('src/pages'))
+  .map((file) => {
+    const name = file.replace(/\\.tsx$/, '').toLowerCase()
+    return name === 'index' ? \`/\` : \`/\${name}\`
+  })
+
+;(async () => {
+  for (const url of routesToPrerender) {
+    const appHtml = render(url);
+    const html = template.replace(\`<!--app-html-->\`, appHtml)
+
+    const filePath = \`dist\${url === '/' ? '/index' : url}.html\`
+    fs.writeFileSync(toAbsolute(filePath), html)
+    console.log('pre-rendered:', filePath)
+  }
+})()

# Removed BrowserRouter since SSR requires StaticRouter
diff --git src/App.tsx src/App.tsx
--- src/App.tsx
+++ src/App.tsx
@@ -6 +6 @@
-import { BrowserRouter, Routes, Route } from "react-router-dom";
+import { Routes, Route } from "react-router-dom";

@@ -20,11 +20,9 @@
-      <BrowserRouter>
       <AnimatePresence mode="wait">
         <Routes>
           <Route path="/" element={<Index />} />
           <Route path="/about" element={<About />} />
           <Route path="/varieties" element={<Varieties />} />
           <Route path="*" element={<NotFound />} />
         </Routes>
       </AnimatePresence>
-      </BrowserRouter> # Moved BrowserRouter to main.tsx for conditional usage

# Added entry-server.tsx to handle SSG rendering
diff --git src/entry-server.tsx src/entry-server.tsx
new file mode 100644
--- /dev/null
+++ src/entry-server.tsx
@@ -0,0 +1,14 @@
+import ReactDOMServer from 'react-dom/server';
+import { StaticRouter } from 'react-router-dom/server';
+import App from './App';
+
+export function render(url: string) {
+  const html = ReactDOMServer.renderToString(
+    <StaticRouter location={url}>
+      <App />
+    </StaticRouter>
+  );
+  
+  return html;
+}

# Added hydration for SSG and moved BrowserRouter to main.tsx
diff --git src/main.tsx src/main.tsx
--- src/main.tsx
+++ src/main.tsx
@@ -1 +1,2 @@
-import { createRoot } from 'react-dom/client'
+import { createRoot, hydrateRoot } from 'react-dom/client'
+import { BrowserRouter } from 'react-router-dom'

@@ -5 +6,12 @@
-createRoot(document.getElementById("root")!).render(<App />);
+const root = document.getElementById("root")!;
+const app = (
+  <BrowserRouter>
+    <App />
+  </BrowserRouter>
+);
+
+# Use hydration for SSR in production
+if (import.meta.env.PROD) {
+  hydrateRoot(root, app);
+} else {
+  createRoot(root).render(app);
+}

# Updated build script to support SSG and prerendering
# NOTE: PROVIDE INSTRUCTION ON HOW TO DO THIS MANUALLY AS THIS CANNOT BE IMPLEMENTED BY YOU
diff --git package.json package.json
--- package.json
+++ package.json
@@ -8 +8,4 @@
-    "build": "vite build",
+    "build": "npm run build:client && npm run build:server && npm run build:prerender",
+    "build:client": "vite build", # Builds the client-side app
+    "build:server": "vite build --ssr src/entry-server.tsx --outDir dist/server", # Builds the SSR entry point
+    "build:prerender": "node prerender", # Runs prerendering to generate static pages
`;

/**
 * Génère l'URL Lovable avec le prompt, le logo et les images
 * @param prompt - Le prompt généré par Claude
 * @param logoUrl - URL du logo (prioritaire, sera en première position)
 * @param images - Tableau d'URLs des images du site (max 9, car logo = 1)
 */
export function generateLovableUrl(
  prompt: string,
  logoUrl?: string | null,
  images?: string[]
): string {
  try {
    logger.info(`🔗 Génération URL Lovable...`);

    // Ajouter les instructions SSG au prompt
    const fullPrompt = prompt + SSG_INSTRUCTIONS;

    // Encoder le prompt
    const encodedPrompt = encodeURIComponent(fullPrompt);

    // URL de base
    let url = `https://lovable.dev/?autosubmit=true#prompt=${encodedPrompt}`;

    // Préparer la liste des images (logo en premier, puis les autres images)
    // Lovable accepte jusqu'à 10 images
    const allImages: string[] = [];
    
    // 1. Logo en priorité absolue
    if (logoUrl) {
      allImages.push(logoUrl);
      logger.info(`🖼️  Logo ajouté en première position`);
    }
    
    // 2. Ajouter les autres images (jusqu'à 10 au total)
    if (images && images.length > 0) {
      const remainingSlots = 10 - allImages.length;
      const imagesToAdd = images
        .filter(img => img !== logoUrl) // Éviter les doublons avec le logo
        .slice(0, remainingSlots);
      
      allImages.push(...imagesToAdd);
      logger.info(`🖼️  ${imagesToAdd.length} images supplémentaires ajoutées`);
    }

    // Ajouter les images à l'URL
    if (allImages.length > 0) {
      // Format Lovable : images séparées par des virgules encodées
      const encodedImages = allImages.map(img => encodeURIComponent(img)).join(',');
      url += `&images=${encodedImages}`;
      logger.info(`🖼️  Total : ${allImages.length} image(s) dans l'URL`);
    } else {
      logger.info(`ℹ️  URL sans images`);
    }

    // Vérifier la longueur de l'URL
    // Note: Les URLs très longues peuvent poser des problèmes
    // Lovable devrait gérer les URLs longues, mais on log un warning
    if (url.length > 8000) {
      logger.warn(`⚠️  URL très longue (${url.length} caractères), peut nécessiter une réduction`);
    } else if (url.length > 2000) {
      logger.info(`📏 URL longue mais acceptable (${url.length} caractères)`);
    }

    logger.info(`📄 Instructions SSG ajoutées au prompt`);

    return url;
  } catch (error: any) {
    logger.error(`❌ Erreur lors de la génération de l'URL Lovable :`, error.message);
    throw error;
  }
}
