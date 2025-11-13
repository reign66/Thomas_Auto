# 🔧 Configuration Déclencheur Notion "Go site" - Guide Complet

## 📋 Vue d'ensemble

Ce guide explique comment configurer le déclencheur via le bouton "Go site" dans Notion pour générer automatiquement l'URL du site et vous l'envoyer par email.

**Fonctionnalités** :
- ✅ Clic sur le bouton "Go site" dans Notion
- ✅ Récupération automatique des données : nom, email, téléphone, logo, type de site, website
- ✅ Génération du site via Lovable
- ✅ Envoi de l'URL par email (à vous, pas au client)
- ✅ Utilise les mêmes variables que Calendly : "Type de site", "Site à faire", "Website"

## ⚠️ Important : Notion n'a pas de webhooks natifs

Notion ne permet pas de déclencher directement un webhook HTTP quand on clique sur un bouton. Il faut utiliser un service tiers comme **Make.com** (gratuit) ou **Zapier** pour créer l'automatisation.

## 🚀 Solution Recommandée : Make.com (Gratuit)

### Étape 1 : Créer un compte Make.com

1. Allez sur https://www.make.com
2. Créez un compte gratuit (1000 opérations/mois gratuites)
3. Créez un nouveau scénario

### Étape 2 : Configurer le déclencheur Notion

1. Dans Make.com, ajoutez un module **"Notion"**
2. Sélectionnez **"Watch database items"** (Surveiller les éléments de la base de données)
3. Connectez votre compte Notion :
   - Cliquez sur "Add" pour ajouter une connexion
   - Autorisez Make.com à accéder à votre workspace Notion
4. Sélectionnez votre base de données "Stratégie Commercial"
5. Configurez le filtre :
   - **Property** : `Go site` (votre colonne de bouton)
   - **Condition** : `is checked` ou `is true` (selon le type de votre colonne)

**Note** : Si votre colonne "Go site" est un bouton, Notion peut ne pas permettre de surveiller directement les clics. Dans ce cas, utilisez une colonne checkbox à la place :
- Créez une colonne checkbox "Go site" (ou renommez votre colonne)
- Quand vous cliquez sur le bouton, l'automatisation Notion coche cette checkbox
- Make.com surveille cette checkbox

### Étape 3 : Configurer l'action HTTP

1. Ajoutez un module **"HTTP"** → **"Make a request"**
2. Configurez :
   - **Method** : `POST`
   - **URL** : `https://thomasauto-production.up.railway.app/webhooks/notion`
   - **Headers** :
     ```
     Content-Type: application/json
     ```
   - **Body** : JSON
     ```json
     {
       "page_id": "{{1.id}}"
     }
     ```
     (Remplacez `{{1.id}}` par l'ID de la page depuis le module Notion précédent)

### Étape 4 : Activer le scénario

1. Cliquez sur **"Save"** puis **"Run once"** pour tester
2. Si ça fonctionne, activez le scénario avec le bouton **"On"**

## 🔄 Alternative : Automatisation Notion + Webhook

Si vous préférez utiliser les automatisations natives de Notion :

### Étape 1 : Créer une automatisation Notion

1. Dans votre base de données Notion, cliquez sur **"..."** → **"Automations"**
2. Créez une nouvelle automatisation :
   - **Trigger** : "When a button is clicked" → Sélectionnez votre colonne "Go site"
   - **Action** : "Send webhook" (si disponible) ou utilisez Make.com comme ci-dessus

**Note** : Les automatisations Notion peuvent ne pas avoir d'action "Send webhook" native. Dans ce cas, utilisez Make.com.

## 🧪 Test du Déclencheur

### Test 1 : Via Make.com

1. Ouvrez les logs Railway en temps réel
2. Dans Notion, cliquez sur le bouton "Go site" (ou cochez la checkbox)
3. Vérifiez les logs Railway → Vous devriez voir :
   ```
   [INFO] 🔔 Webhook Notion reçu
   [INFO] 📄 Page ID reçu : ...
   [INFO] 🚀 Démarrage du workflow pour : ... (depuis Notion)
   ```

### Test 2 : Test Manuel avec curl

Pour tester directement l'endpoint :

```bash
# Remplacez PAGE_ID par l'ID d'une page de votre base de données
PAGE_ID="votre-page-id-notion"

curl -X POST https://thomasauto-production.up.railway.app/webhooks/notion \
  -H "Content-Type: application/json" \
  -d "{\"page_id\": \"$PAGE_ID\"}"
```

**Comment obtenir le Page ID** :
1. Ouvrez la page dans Notion
2. Cliquez sur "..." → "Copy link"
3. L'URL ressemble à : `https://www.notion.so/workspace/PAGE_ID?v=...`
4. Le PAGE_ID est la partie entre le dernier `/` et le `?`

## 📊 Données Utilisées

Le système récupère automatiquement depuis Notion :
- ✅ **Nom Du Prospect** : Nom du gérant
- ✅ **Email** : Adresse email
- ✅ **Téléphone** : Numéro de téléphone
- ✅ **Logo** : Logo du client
- ✅ **Type de site** : "Moderne" ou "Très moderne"
- ✅ **Website** : URL de l'ancien site web
- ✅ **Site à faire** : Utilisé pour le suivi

## 🔄 Workflow Complet

1. **Vous cliquez sur "Go site"** dans Notion
2. **Make.com détecte** le changement (checkbox cochée ou bouton cliqué)
3. **Make.com appelle** votre webhook avec l'ID de la page
4. **Votre serveur** récupère toutes les données depuis Notion
5. **Le workflow** génère le site via Lovable (même processus que Calendly)
6. **Vous recevez** un email avec l'URL Lovable

## 🐛 Dépannage

### Le webhook n'est pas reçu

**Vérifications** :
1. ✅ Make.com est activé et fonctionne
2. ✅ L'URL du webhook est correcte : `https://thomasauto-production.up.railway.app/webhooks/notion`
3. ✅ Le service Railway est **Running**
4. ✅ Le health check fonctionne : `https://thomasauto-production.up.railway.app/health`
5. ✅ Le Page ID est bien envoyé dans le body JSON

**Test** :
- Ouvrez les logs Railway en temps réel
- Déclenchez l'automatisation dans Make.com
- Vous devriez voir : `[INFO] 🔔 Webhook Notion reçu`

### Erreur "Page ID manquant"

**Cause** : Le format du body JSON n'est pas correct

**Solution** :
- Vérifiez que Make.com envoie bien : `{"page_id": "..."}`
- Le Page ID doit être l'ID de la page Notion (sans tirets)

### Le prospect n'est pas trouvé

**Vérifications** :
1. ✅ Le Page ID correspond bien à une page de votre base de données
2. ✅ La page a bien une colonne "Nom Du Prospect" remplie
3. ✅ La page a bien une colonne "Website" remplie
4. ✅ Votre intégration Notion a les permissions "Read content"

## 📝 Checklist de Configuration

- [ ] Compte Make.com créé
- [ ] Scénario Make.com créé avec déclencheur Notion
- [ ] Action HTTP configurée avec l'URL : `https://thomasauto-production.up.railway.app/webhooks/notion`
- [ ] Body JSON configuré : `{"page_id": "{{1.id}}"}`
- [ ] Scénario Make.com activé
- [ ] Colonne "Go site" créée dans Notion (bouton ou checkbox)
- [ ] Test effectué avec un vrai prospect

## 🔗 URLs Importantes

- **Webhook Notion** : `https://thomasauto-production.up.railway.app/webhooks/notion`
- **Health Check** : `https://thomasauto-production.up.railway.app/health`
- **Webhook Calendly** : `https://thomasauto-production.up.railway.app/webhooks/calendly`

---

**Une fois configuré, vous pouvez générer des sites en un clic depuis Notion ! 🚀**
