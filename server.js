const express = require('express');
const { marked } = require('marked');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration de marked pour un rendu sécurisé
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: true,
  mangle: false
});

// Servir les fichiers statiques
app.use(express.static(__dirname));

// Route pour la page d'accueil
app.get('/', async (req, res) => {
  try {
    const readmeContent = await fs.readFile('README.md', 'utf-8');
    const htmlContent = marked(readmeContent);
    
    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🚀 Système de Prompts SEO pour Lovable</title>
    <meta name="description" content="Système complet de prompts et outils pour créer des sites web ultra-optimisés SEO sur Lovable">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        header {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }
        
        h1 {
            color: #667eea;
            font-size: 2.5rem;
            margin-bottom: 10px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .subtitle {
            color: #666;
            font-size: 1.2rem;
        }
        
        .nav-links {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            margin-top: 30px;
        }
        
        .nav-link {
            display: inline-block;
            padding: 12px 24px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .nav-link:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
        }
        
        .content {
            background: white;
            border-radius: 15px;
            padding: 40px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }
        
        .content h2 {
            color: #667eea;
            margin: 30px 0 15px 0;
            padding-bottom: 10px;
            border-bottom: 2px solid #f0f0f0;
        }
        
        .content h3 {
            color: #764ba2;
            margin: 20px 0 10px 0;
        }
        
        .content ul {
            margin-left: 30px;
            margin-bottom: 20px;
        }
        
        .content li {
            margin: 8px 0;
        }
        
        .content code {
            background: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', Courier, monospace;
            font-size: 0.9em;
        }
        
        .content pre {
            background: #f8f8f8;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
            overflow-x: auto;
        }
        
        .content pre code {
            background: none;
            padding: 0;
        }
        
        .content blockquote {
            border-left: 4px solid #667eea;
            padding-left: 20px;
            margin: 20px 0;
            color: #666;
            font-style: italic;
        }
        
        .content a {
            color: #667eea;
            text-decoration: none;
            border-bottom: 2px solid transparent;
            transition: border-color 0.3s;
        }
        
        .content a:hover {
            border-bottom-color: #667eea;
        }
        
        .files-section {
            background: #f9fafb;
            border-radius: 10px;
            padding: 25px;
            margin: 30px 0;
        }
        
        .files-section h3 {
            color: #667eea;
            margin-bottom: 15px;
        }
        
        .file-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }
        
        .file-card {
            background: white;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .file-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .file-card a {
            color: #333;
            font-weight: 600;
            text-decoration: none;
        }
        
        .file-description {
            color: #666;
            font-size: 0.9rem;
            margin-top: 5px;
        }
        
        footer {
            text-align: center;
            color: white;
            padding: 30px;
            margin-top: 50px;
        }
        
        @media (max-width: 768px) {
            h1 {
                font-size: 2rem;
            }
            
            .content {
                padding: 20px;
            }
            
            .nav-links {
                flex-direction: column;
            }
            
            .nav-link {
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🚀 Système de Prompts SEO Mega-Optimisés</h1>
            <p class="subtitle">Documentation complète pour créer des sites web ultra-optimisés sur Lovable</p>
            
            <nav class="nav-links">
                <a href="/view/prompt-seo-lovable" class="nav-link">📋 Prompt SEO Complet</a>
                <a href="/view/template-client-simple" class="nav-link">📝 Template Client</a>
                <a href="/view/guide-utilisation" class="nav-link">📚 Guide d'Utilisation</a>
                <a href="/sitemap-example.xml" class="nav-link">🗺️ Exemple Sitemap</a>
                <a href="/sidebar-scroll-manager.js" class="nav-link">⚙️ Script JS</a>
                <a href="/googlec26cc7c36bbf5118.html" class="nav-link">✅ Google Verification</a>
            </nav>
        </header>
        
        <main class="content">
            <div class="files-section">
                <h3>📁 Fichiers du système</h3>
                <div class="file-list">
                    <div class="file-card">
                        <a href="/view/prompt-seo-lovable">prompt-seo-lovable.md</a>
                        <p class="file-description">Prompt complet avec toutes les optimisations SEO intégrées</p>
                    </div>
                    <div class="file-card">
                        <a href="/view/template-client-simple">template-client-simple.md</a>
                        <p class="file-description">Template simplifié à personnaliser pour chaque client</p>
                    </div>
                    <div class="file-card">
                        <a href="/view/guide-utilisation">guide-utilisation.md</a>
                        <p class="file-description">Guide détaillé d'utilisation du système</p>
                    </div>
                    <div class="file-card">
                        <a href="/sitemap-example.xml">sitemap-example.xml</a>
                        <p class="file-description">Exemple de structure sitemap optimisée</p>
                    </div>
                    <div class="file-card">
                        <a href="/sidebar-scroll-manager.js">sidebar-scroll-manager.js</a>
                        <p class="file-description">Script de gestion du scroll et optimisations</p>
                    </div>
                    <div class="file-card">
                        <a href="/googlec26cc7c36bbf5118.html">googlec26cc7c36bbf5118.html</a>
                        <p class="file-description">Fichier de vérification Google Search Console</p>
                    </div>
                </div>
            </div>
            
            ${htmlContent}
        </main>
        
        <footer>
            <p>💪 Système de Prompts SEO pour Lovable - Créez des sites qui dominent Google!</p>
        </footer>
    </div>
</body>
</html>
    `;
    
    res.send(html);
  } catch (error) {
    res.status(500).send('Erreur lors du chargement de la page');
  }
});

// Route pour visualiser les fichiers markdown
app.get('/view/:filename', async (req, res) => {
  try {
    const filename = req.params.filename + '.md';
    const filepath = path.join(__dirname, filename);
    
    const content = await fs.readFile(filepath, 'utf-8');
    const htmlContent = marked(content);
    
    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${filename} - Système SEO Lovable</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.8;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .back-button {
            display: inline-block;
            padding: 10px 20px;
            background: rgba(255, 255, 255, 0.9);
            color: #667eea;
            text-decoration: none;
            border-radius: 8px;
            margin-bottom: 20px;
            font-weight: 600;
            transition: transform 0.3s, box-shadow 0.3s;
        }
        
        .back-button:hover {
            transform: translateX(-5px);
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        }
        
        .content {
            background: white;
            border-radius: 15px;
            padding: 40px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        }
        
        h1, h2 {
            color: #667eea;
            margin: 30px 0 15px 0;
        }
        
        h1 {
            font-size: 2.2rem;
            padding-bottom: 15px;
            border-bottom: 3px solid #667eea;
        }
        
        h2 {
            font-size: 1.8rem;
            padding-bottom: 10px;
            border-bottom: 2px solid #f0f0f0;
        }
        
        h3 {
            color: #764ba2;
            margin: 20px 0 10px 0;
        }
        
        ul, ol {
            margin-left: 30px;
            margin-bottom: 20px;
        }
        
        li {
            margin: 8px 0;
        }
        
        code {
            background: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', Courier, monospace;
            font-size: 0.9em;
            color: #e83e8c;
        }
        
        pre {
            background: #f8f8f8;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 20px 0;
            border-radius: 5px;
            overflow-x: auto;
        }
        
        pre code {
            background: none;
            padding: 0;
            color: inherit;
        }
        
        blockquote {
            border-left: 4px solid #667eea;
            padding-left: 20px;
            margin: 20px 0;
            color: #666;
            font-style: italic;
            background: #f9f9f9;
            padding: 15px 20px;
            border-radius: 5px;
        }
        
        a {
            color: #667eea;
            text-decoration: none;
            border-bottom: 2px solid transparent;
            transition: border-color 0.3s;
        }
        
        a:hover {
            border-bottom-color: #667eea;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        
        th, td {
            padding: 12px;
            text-align: left;
            border: 1px solid #ddd;
        }
        
        th {
            background: #667eea;
            color: white;
        }
        
        tr:nth-child(even) {
            background: #f9f9f9;
        }
        
        @media (max-width: 768px) {
            .content {
                padding: 20px;
            }
            
            h1 {
                font-size: 1.8rem;
            }
            
            h2 {
                font-size: 1.5rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <a href="/" class="back-button">← Retour à l'accueil</a>
        <div class="content">
            ${htmlContent}
        </div>
    </div>
</body>
</html>
    `;
    
    res.send(html);
  } catch (error) {
    res.status(404).send('Fichier non trouvé');
  }
});

// Route pour les fichiers XML avec le bon Content-Type
app.get('*.xml', (req, res) => {
  res.type('application/xml');
  res.sendFile(path.join(__dirname, req.path));
});

// Route pour les fichiers JS avec le bon Content-Type
app.get('*.js', (req, res) => {
  res.type('application/javascript');
  res.sendFile(path.join(__dirname, req.path));
});

// Route pour les fichiers HTML
app.get('*.html', (req, res) => {
  res.type('text/html');
  res.sendFile(path.join(__dirname, req.path));
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>404 - Page non trouvée</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            .error-container {
                background: white;
                padding: 40px;
                border-radius: 15px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
                text-align: center;
            }
            h1 {
                color: #667eea;
                font-size: 3rem;
                margin: 0;
            }
            p {
                color: #666;
                margin: 20px 0;
            }
            a {
                display: inline-block;
                padding: 12px 24px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                transition: transform 0.3s;
            }
            a:hover {
                transform: translateY(-2px);
            }
        </style>
    </head>
    <body>
        <div class="error-container">
            <h1>404</h1>
            <p>Page non trouvée</p>
            <a href="/">Retour à l'accueil</a>
        </div>
    </body>
    </html>
  `);
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
  console.log(`🌐 Accédez à l'application sur http://localhost:${PORT}`);
});