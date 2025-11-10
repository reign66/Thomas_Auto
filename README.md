# 🚀 Lovable Automation - Génération Automatique de Sites Web

Serveur d'automatisation pour générer des sites web via Lovable à partir de rendez-vous Calendly, avec envoi automatique d'email.

## 📋 Workflow Complet

```
1. VOUS : Créez RDV Calendly (ou prospect réserve)
         ↓ AUTOMATIQUE
2. SERVEUR : Reçoit webhook Calendly
         ↓ AUTOMATIQUE
3. SERVEUR : Va chercher dans Notion (Website + Logo)
         ↓ AUTOMATIQUE
4. SERVEUR : Analyse avec Claude
         ↓ AUTOMATIQUE
5. SERVEUR : Génère URL Lovable
         ↓ AUTOMATIQUE
6. SERVEUR : Envoie EMAIL à vous avec le lien
         ↓ 
7. VOUS : Recevez l'email, cliquez sur le lien
         ↓ AUTOMATIQUE
8. LOVABLE : Génère le site (5-10 min)
```

## 🎯 Fonctionnalités

- ✅ Réception automatique des webhooks Calendly
- ✅ Validation de signature HMAC pour sécurité
- ✅ Récupération automatique du Website et Logo depuis Notion (par nom)
- ✅ Scraping intelligent du site web du prospect
- ✅ Analyse avec Claude Sonnet 4.5 pour générer un prompt détaillé
- ✅ Génération automatique de l'URL Lovable avec logo intégré
- ✅ **Envoi automatique d'email avec l'URL Lovable**
- ✅ Gestion d'erreurs avec emails d'erreur
- ✅ Logging détaillé pour suivi du processus

## 🛠️ Installation et Configuration

### Prérequis

- Node.js >= 18.0.0
- Compte Notion avec base de données configurée
- Compte Calendly avec webhook configuré
- Clé API Anthropic (Claude)
- Compte Resend pour l'envoi d'emails

### Variables d'Environnement

Créez un fichier `.env` avec :

```env
PORT=3000
NODE_ENV=production

# Calendly
CALENDLY_WEBHOOK_SECRET=votre_signing_key_calendly

# Anthropic Claude
ANTHROPIC_API_KEY=sk-ant-api03-votre_cle_anthropic

# Notion
NOTION_API_KEY=ntn_votre_cle_notion
NOTION_DATABASE_ID=votre_database_id_notion

# Email (Resend)
RESEND_API_KEY=re_votre_cle_resend
EMAIL_FROM=notifications@votredomaine.com
EMAIL_TO=votre@email.com

# App
APP_URL=https://votre-app.railway.app
```

### Configuration Resend

1. Créez un compte sur https://resend.com
2. Vérifiez votre domaine (ou utilisez le domaine de test)
3. Récupérez votre API key
4. Configurez `EMAIL_FROM` avec votre domaine vérifié
5. Configurez `EMAIL_TO` avec votre email de réception

### Configuration Notion

1. Créez une intégration Notion : https://www.notion.so/my-integrations
2. Copiez l'**Internal Integration Token** → `NOTION_API_KEY`
3. Récupérez le **Database ID** de votre base "Stratégie Commercial"
4. Partagez la base avec votre intégration

**Structure de la base Notion** :

| Colonne | Type | Utilisation |
|---------|------|-------------|
| **Nom Du Prospect** | Title | 🔍 Recherche par nom (obligatoire) |
| **Website** | URL | ✅ Récupéré pour scraping |
| Email | Email | Informations |
| Téléphone | Phone | Informations |
| **Logo** | Files | ✅ Récupéré pour Lovable |

### Configuration Calendly

1. Allez sur https://calendly.com/integrations/webhooks
2. Créez un nouveau webhook :
   - **Event** : `invitee.created`
   - **URL** : `https://votre-app.railway.app/webhooks/calendly`
   - **Signing Key** : Copiez et mettez dans `CALENDLY_WEBHOOK_SECRET`

⚠️ **Important** : Les webhooks se déclenchent uniquement quand un invité réserve via la **page publique** de Calendly.

## 🚀 Déploiement sur Railway

1. Connectez votre repository GitHub à Railway
2. Configurez toutes les variables d'environnement
3. Railway détectera automatiquement `railway.json` et déploiera
4. Vérifiez que le service est **Running**

## 📧 Format de l'Email

Vous recevrez un email avec :

**De** : `notifications@votredomaine.com`  
**À** : `votre@email.com`  
**Sujet** : `✅ Site prêt à générer pour {Nom du Prospect}`

**Contenu** :
- Message de bienvenue
- Nom du prospect
- Site analysé (lien cliquable)
- **Lien cliquable vers l'URL Lovable** (bouton)
- Instructions

## 🔄 Workflow Détaillé

### 1. Création du RDV

Vous créez un rendez-vous Calendly (ou le prospect réserve via le lien public).

### 2. Webhook Calendly

Quand le rendez-vous est confirmé, Calendly envoie un webhook avec :
- Nom de l'invité
- Email
- Questions/réponses (optionnel)

### 3. Recherche dans Notion

Le serveur :
- Extrait le nom depuis le webhook
- Cherche le prospect dans Notion par "Nom Du Prospect"
- Récupère : Website, Logo, Email, Téléphone

### 4. Scraping et Analyse

Le serveur :
- Scrape le site web récupéré depuis Notion
- Envoie le contenu à Claude API
- Claude génère un prompt détaillé avec animations

### 5. Génération URL Lovable

Le serveur :
- Combine le prompt Claude + instructions d'animations
- Ajoute l'URL du logo (si disponible)
- Génère l'URL Lovable complète

### 6. Envoi Email

Le serveur :
- Envoie un email avec l'URL Lovable
- Vous recevez l'email quelques minutes après la confirmation du RDV

### 7. Génération du Site

Vous :
- Cliquez sur le lien dans l'email
- Lovable génère automatiquement le site (5-10 min)

## 🐛 Gestion d'Erreurs

Le système envoie automatiquement des emails d'erreur si :

- ❌ Le prospect n'existe pas dans Notion
- ❌ Le prospect n'a pas de site web dans Notion
- ❌ Le scraping échoue
- ❌ L'analyse Claude échoue
- ❌ L'envoi d'email échoue (mais l'URL est dans les logs Railway)

Toutes les erreurs sont aussi loggées dans Railway pour consultation.

## 📊 Logs

Les logs Railway affichent :

```
[INFO] 🔔 Webhook Calendly reçu pour : Nicolas KOLVIC
[INFO] 🔍 Recherche dans Notion pour : Nicolas KOLVIC
[INFO] ✅ Prospect trouvé : Nicolas KOLVIC
[INFO] 🖼️ Logo trouvé : https://...
[INFO] 🌐 Scraping du site : https://www.dei-expertises.fr/
[INFO] 📄 Contenu récupéré : 15234 caractères
[INFO] 🤖 Appel Claude API...
[INFO] ✅ Réponse Claude : 3456 caractères
[INFO] 🔗 URL Lovable générée
[INFO] 📧 Envoi email à : votre@email.com
[INFO] ✅ Email envoyé avec succès
```

## 🧪 Test

1. Créez un prospect dans Notion avec :
   - Nom : `Test Prospect`
   - Website : `https://example.com`
   - Logo : (optionnel)

2. Créez un RDV Calendly avec le nom exact : `Test Prospect`

3. Confirmez le RDV

4. Vérifiez les logs Railway

5. Vérifiez votre boîte email (quelques minutes après)

## 📁 Structure du Projet

```
src/
├── services/
│   ├── calendly.service.ts    # Validation webhook
│   ├── claude.service.ts      # Analyse avec Claude
│   ├── email.service.ts       # Envoi d'emails (Resend)
│   ├── lovable.service.ts     # Génération URL Lovable
│   ├── notion.service.ts      # Récupération données Notion
│   └── scraper.service.ts     # Scraping site web
├── workflows/
│   └── generate-site.workflow.ts  # Workflow centralisé
├── routes/
│   └── webhooks.routes.ts     # Route webhook Calendly
├── middleware/
│   ├── errorHandler.ts
│   └── rawBody.middleware.ts
├── utils/
│   └── logger.ts
├── config/
│   └── index.ts
└── server.ts
```

## 🔐 Sécurité

- ✅ Validation signature HMAC Calendly
- ✅ Rate limiting (10 requêtes/minute)
- ✅ Helmet.js pour headers sécurisés
- ✅ CORS configuré
- ✅ Secrets jamais loggés

## 📚 Scripts

- `npm run dev` : Démarrage en développement
- `npm run build` : Compilation TypeScript
- `npm start` : Démarrage en production
- `npm run lint` : Linting

## ⚠️ Points Importants

1. **Nom exact** : Le nom dans Calendly doit correspondre **EXACTEMENT** au nom dans Notion
2. **Website obligatoire** : Le prospect doit avoir un Website dans Notion
3. **Email de réception** : Configurez `EMAIL_TO` avec votre email
4. **Domaine email** : Vérifiez votre domaine dans Resend pour `EMAIL_FROM`
5. **Webhooks** : Se déclenchent uniquement via la page publique Calendly

## 📞 Support

Consultez les logs Railway pour diagnostiquer les problèmes. Toutes les erreurs sont loggées avec des détails.

---

**Fait avec ❤️ pour automatiser la génération de sites web**
