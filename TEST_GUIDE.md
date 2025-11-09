# 🧪 Guide de Test - Lovable Automation

Guide complet pour tester le système déployé sur Railway.

## 📋 Prérequis

- ✅ Projet déployé sur Railway
- ✅ Compte Notion avec base de données "Stratégie Commercial"
- ✅ Compte Calendly avec accès aux webhooks
- ✅ Clé API Anthropic (Claude)
- ✅ URL de votre application Railway (ex: `https://votre-app.railway.app`)

---

## 🔧 Étape 1 : Configuration Railway

### 1.1 Vérifier les Variables d'Environnement

Dans votre dashboard Railway, allez dans **Variables** et vérifiez que toutes ces variables sont configurées :

```
PORT=3000
NODE_ENV=production
CALENDLY_WEBHOOK_SECRET=votre_secret_calendly
ANTHROPIC_API_KEY=sk-ant-api03-votre_cle_anthropic
NOTION_API_KEY=ntn_votre_cle_notion
NOTION_DATABASE_ID=votre_database_id_notion
APP_URL=https://votre-app.railway.app
```

⚠️ **Important** : Remplacez `APP_URL` par l'URL réelle de votre application Railway.

### 1.2 Vérifier que le Service est Actif

1. Allez dans votre projet Railway
2. Vérifiez que le service est **Running** (statut vert)
3. Cliquez sur l'onglet **Logs** pour voir les logs en temps réel
4. Testez le health check : ouvrez `https://votre-app.railway.app/health` dans votre navigateur
   - Vous devriez voir : `{"status":"ok","timestamp":"..."}`

---

## 📊 Étape 2 : Configuration Notion

### 2.1 Vérifier la Structure de la Base

Votre base Notion "Stratégie Commercial" doit avoir ces colonnes :

| Colonne | Type | Obligatoire |
|---------|------|-------------|
| **Nom Du Prospect** | Title | ✅ Oui |
| Website | URL | Non |
| Email | Email | Non |
| Téléphone | Phone | Non |
| **Logo** | Files | Non (mais recommandé) |
| **Website Lovable** | URL | Non (sera rempli automatiquement) |
| **Date du rendez-vous** | Date | Non (sera rempli automatiquement) |
| **Site à faire** | Checkbox | Non (sera coché automatiquement) |

### 2.2 Créer un Prospect de Test

1. Ouvrez votre base Notion "Stratégie Commercial"
2. Créez une nouvelle ligne avec ces informations :
   - **Nom Du Prospect** : `Test Prospect` (⚠️ **EXACTEMENT** ce nom, sans faute)
   - **Website** : `https://example.com` (ou un vrai site pour tester)
   - **Email** : `test@example.com`
   - **Logo** : Uploader une image (optionnel mais recommandé pour tester)
   - Les autres colonnes peuvent rester vides

3. **Notez le nom exact** : `Test Prospect` (vous en aurez besoin pour Calendly)

### 2.3 Vérifier les Permissions de l'Intégration

1. Dans votre base Notion, cliquez sur "..." (menu)
2. Allez dans **Connections**
3. Vérifiez que votre intégration Notion est connectée
4. Si ce n'est pas le cas, ajoutez-la

---

## 📅 Étape 3 : Configuration Calendly

### 3.1 Créer/Configurer le Webhook

1. Allez sur https://calendly.com/integrations/webhooks
2. Cliquez sur **New webhook**
3. Configurez :
   - **Event** : Sélectionnez `invitee.created` (quand un rendez-vous est confirmé)
   - **URL** : `https://votre-app.railway.app/webhooks/calendly`
     - ⚠️ Remplacez par votre URL Railway réelle
   - **Signing Key** : Copiez cette clé et mettez-la dans Railway → Variables → `CALENDLY_WEBHOOK_SECRET`

4. Cliquez sur **Add webhook**

### 3.2 Configurer les Questions Personnalisées

1. Allez dans **Settings** → **Event types** → Sélectionnez votre type d'événement
2. Allez dans **Questions**
3. Ajoutez une question :
   - **Question** : `Site Web` (⚠️ **EXACTEMENT** ce texte, avec majuscule et espace)
   - **Type** : Texte court
   - **Obligatoire** : ✅ Oui
   - **Position** : Après les questions par défaut

4. Sauvegardez

---

## 🧪 Étape 4 : Test Complet

### 4.1 Préparer le Test

1. **Ouvrez les logs Railway** dans un onglet séparé pour suivre en temps réel
2. **Ouvrez votre base Notion** dans un autre onglet pour voir les mises à jour

### 4.2 Créer un Rendez-vous de Test

1. Allez sur votre page Calendly publique
2. Sélectionnez un créneau disponible
3. **Remplissez le formulaire** :
   - **Name** : `Test Prospect` (⚠️ **EXACTEMENT** le même nom que dans Notion)
   - **Email** : `test@example.com`
   - **Site Web** : `https://example.com` (ou un vrai site comme `https://www.dei-expertises.fr/`)

4. **Confirmez le rendez-vous**

### 4.3 Observer le Processus

#### Dans les Logs Railway (immédiatement après confirmation) :

Vous devriez voir dans l'ordre :

```
[INFO] 🔔 Webhook Calendly reçu pour : Test Prospect
[INFO] 📧 Email : test@example.com
[INFO] 🌐 Site Web : https://example.com
[INFO] 🔍 Recherche logo dans Notion pour : Test Prospect
```

Ensuite :
- Si logo trouvé : `[INFO] 🖼️ Logo trouvé : https://prod-files-secure.s3...`
- Si pas de logo : `[INFO] ℹ️ Pas de logo pour "Test Prospect"`

Puis :
```
[INFO] 🌐 Scraping du site : https://example.com
[INFO] 📄 Contenu récupéré : XXXX caractères
[INFO] 🤖 Appel Claude API pour analyser : https://example.com
```

⚠️ **Cette étape peut prendre 30-100 secondes** (analyse Claude)

Ensuite :
```
[INFO] ✅ Réponse Claude : XXXX caractères
[INFO] 🔨 Construction prompt final : XXXX caractères
[INFO] 🔗 Génération URL Lovable...
[INFO] 🖼️ Logo ajouté à l'URL (ou ℹ️ URL sans logo)
[INFO] 📊 Mise à jour Notion pour : Test Prospect
[INFO] ✅ Notion mis à jour pour "Test Prospect"
[INFO] ========================================
[INFO] 🎯 URL LOVABLE POUR Test Prospect :
[INFO] https://lovable.dev/?autosubmit=true#prompt=...
[INFO] ========================================
```

#### Dans Notion (après quelques secondes) :

Vérifiez que la ligne "Test Prospect" a été mise à jour :
- ✅ **Website Lovable** : Contient une URL Lovable complète
- ✅ **Date du rendez-vous** : Date actuelle
- ✅ **Site à faire** : Coché (checkbox)

### 4.4 Tester l'URL Lovable

1. **Copiez l'URL Lovable** depuis les logs Railway
2. **Ouvrez-la dans un nouvel onglet** de votre navigateur
3. Lovable devrait :
   - S'ouvrir automatiquement
   - Commencer à générer le site
   - Si un logo a été fourni, l'utiliser dans le design

---

## ✅ Checklist de Validation

Cochez chaque point pour valider le test :

- [ ] Health check Railway fonctionne (`/health`)
- [ ] Webhook Calendly reçu (visible dans les logs)
- [ ] Nom du prospect extrait correctement
- [ ] Email extrait correctement
- [ ] Site Web extrait correctement
- [ ] Logo récupéré depuis Notion (ou message "pas de logo")
- [ ] Site web scrapé avec succès
- [ ] Claude API appelée et réponse reçue
- [ ] URL Lovable générée
- [ ] Notion mis à jour avec :
  - [ ] Website Lovable rempli
  - [ ] Date du rendez-vous remplie
  - [ ] Site à faire coché
- [ ] URL Lovable fonctionne et génère un site

---

## 🐛 Dépannage

### Le webhook n'est pas reçu

**Symptômes** : Aucun log dans Railway après confirmation du RDV

**Solutions** :
1. Vérifiez l'URL du webhook dans Calendly : `https://votre-app.railway.app/webhooks/calendly`
2. Vérifiez que le service Railway est **Running**
3. Testez manuellement le webhook :
   ```bash
   curl -X POST https://votre-app.railway.app/webhooks/calendly \
     -H "Content-Type: application/json" \
     -d '{"test": "data"}'
   ```
   Vous devriez avoir une erreur de signature, mais cela confirme que l'endpoint est accessible.

### Erreur "Signature invalide"

**Symptômes** : `[ERROR] ❌ Signature Calendly invalide` dans les logs

**Solutions** :
1. Vérifiez que `CALENDLY_WEBHOOK_SECRET` dans Railway correspond au **Signing Key** de Calendly
2. Les deux doivent être **exactement identiques** (copier-coller)

### Prospect introuvable dans Notion

**Symptômes** : `[WARN] ⚠️ Prospect "Test Prospect" introuvable dans Notion`

**Solutions** :
1. Vérifiez que le nom dans Calendly correspond **EXACTEMENT** au nom dans Notion
2. Vérifiez les espaces, majuscules, caractères spéciaux
3. Vérifiez que l'intégration Notion a accès à la base
4. Vérifiez que `NOTION_DATABASE_ID` est correct

### Erreur Claude API

**Symptômes** : `[ERROR] ❌ Erreur lors de l'analyse Claude`

**Solutions** :
1. Vérifiez que `ANTHROPIC_API_KEY` est valide
2. Vérifiez vos quotas Anthropic
3. Vérifiez que le modèle `claude-sonnet-4-20250514` est disponible

### Erreur scraping

**Symptômes** : `[ERROR] ❌ Erreur lors du scraping`

**Solutions** :
1. Vérifiez que l'URL du site est accessible
2. Testez l'URL dans un navigateur
3. Certains sites bloquent les scrapers (normal, le processus continue quand même)

### Notion non mis à jour

**Symptômes** : Pas de mise à jour dans Notion après le traitement

**Solutions** :
1. Vérifiez les logs : `[INFO] 📊 Mise à jour Notion pour : Test Prospect`
2. Vérifiez que l'intégration Notion a les permissions d'**écriture**
3. Vérifiez que les noms de colonnes sont **exacts** :
   - "Website Lovable" (avec espace)
   - "Date du rendez-vous" (avec espaces et tiret)
   - "Site à faire" (avec espace et accent)
4. Les erreurs Notion sont loggées mais n'empêchent pas le processus

### URL Lovable trop longue

**Symptômes** : `[WARN] ⚠️ URL très longue`

**Solutions** :
1. C'est un warning, pas une erreur
2. L'URL devrait quand même fonctionner
3. Si elle ne fonctionne pas, réduisez la taille du prompt Claude (modifier `max_tokens`)

---

## 📝 Exemple de Test Réussi

### Logs Railway (extrait) :

```
2025-11-09 17:30:15 [INFO] 🔔 Webhook Calendly reçu pour : Test Prospect
2025-11-09 17:30:15 [INFO] 📧 Email : test@example.com
2025-11-09 17:30:15 [INFO] 🌐 Site Web : https://example.com
2025-11-09 17:30:15 [INFO] 🔍 Recherche logo dans Notion pour : Test Prospect
2025-11-09 17:30:16 [INFO] 🖼️ Logo trouvé : https://prod-files-secure.s3...
2025-11-09 17:30:16 [INFO] 🌐 Scraping du site : https://example.com
2025-11-09 17:30:18 [INFO] 📄 Contenu récupéré : 15234 caractères
2025-11-09 17:30:18 [INFO] 🤖 Appel Claude API pour analyser : https://example.com
2025-11-09 17:32:45 [INFO] ✅ Réponse Claude : 3456 caractères
2025-11-09 17:32:45 [INFO] 🔨 Construction prompt final : 4567 caractères
2025-11-09 17:32:45 [INFO] 🔗 Génération URL Lovable...
2025-11-09 17:32:45 [INFO] 🖼️ Logo ajouté à l'URL
2025-11-09 17:32:45 [INFO] 📊 Mise à jour Notion pour : Test Prospect
2025-11-09 17:32:46 [INFO] ✅ Notion mis à jour pour "Test Prospect"
2025-11-09 17:32:46 [INFO] ========================================
2025-11-09 17:32:46 [INFO] 🎯 URL LOVABLE POUR Test Prospect :
2025-11-09 17:32:46 [INFO] https://lovable.dev/?autosubmit=true#prompt=...&images=...
2025-11-09 17:32:46 [INFO] ========================================
```

### Notion (après le test) :

| Nom Du Prospect | Website Lovable | Date du rendez-vous | Site à faire |
|----------------|-----------------|---------------------|--------------|
| Test Prospect | https://lovable.dev/?autosubmit=true#prompt=... | 2025-11-09 | ✅ |

---

## 🎯 Test avec un Vrai Prospect

Une fois le test réussi, vous pouvez tester avec un vrai prospect :

1. **Remplissez Notion** avec les vraies données du prospect (nom, email, site, logo)
2. **Créez un RDV Calendly** avec les mêmes informations
3. **Confirmez le RDV**
4. **Surveillez les logs** Railway
5. **Copiez l'URL Lovable** générée
6. **Ouvrez-la** et laissez Lovable générer le site

---

## 📞 Support

Si vous rencontrez des problèmes :

1. Vérifiez les logs Railway (section **Logs**)
2. Vérifiez les variables d'environnement
3. Vérifiez la configuration Calendly (URL webhook, Signing Key)
4. Vérifiez la configuration Notion (permissions, noms de colonnes)
5. Vérifiez que tous les services sont accessibles (Claude API, Notion API)

---

**Bon test ! 🚀**
