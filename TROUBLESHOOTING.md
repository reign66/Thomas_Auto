# 🔧 Troubleshooting - Problèmes Courants

## ❌ Erreur : "Could not find database with ID" ou "is a page, not a database"

### Problème

Vous utilisez l'ID d'une **page** Notion au lieu de l'ID d'une **base de données**.

### Solution : Vous DEVEZ utiliser une Base de Données

L'API Notion ne permet pas de faire des requêtes (`databases.query`) sur une page. Vous devez absolument utiliser une **base de données**.

### Comment Trouver le Bon Database ID

#### Étape 1 : Vérifier que vous avez une Base de Données

1. Ouvrez Notion
2. Cherchez votre base "Stratégie Commercial"
3. **Vous devez voir** :
   - ✅ Des colonnes (Nom Du Prospect, Website, Logo, etc.)
   - ✅ Des lignes (vos prospects)
   - ✅ Une vue Table/Board/List
   - ✅ La possibilité d'ajouter des lignes

Si vous voyez du contenu éditable (blocs de texte, images) sans colonnes, c'est une **page**, pas une base de données.

#### Étape 2 : Créer une Base de Données (si vous n'en avez pas)

1. Dans Notion, créez une nouvelle page
2. Tapez `/database` ou `/table`
3. Sélectionnez "Table - Inline" ou "Table - Full page"
4. Configurez les colonnes :
   - Nom Du Prospect (Title)
   - Website (URL)
   - Email (Email)
   - Téléphone (Phone)
   - Logo (Files)
5. Renommez la base en "Stratégie Commercial"

#### Étape 3 : Récupérer le Database ID

1. Ouvrez votre base de données en vue **Table**
2. Regardez l'URL dans votre navigateur :
   ```
   https://www.notion.so/workspace/2a45bf2e124780618252cf111fb53c5e?v=abc123def456
   ```
3. Le **Database ID** est la partie avant le `?` :
   - `2a45bf2e124780618252cf111fb53c5e`
4. **Supprimez les tirets** s'il y en a :
   - ❌ `2a45bf2e-1247-8061-8252-cf111fb53c5e`
   - ✅ `2a45bf2e124780618252cf111fb53c5e`

#### Étape 4 : Vérifier les Permissions

1. Dans votre base de données Notion
2. Cliquez sur "..." (menu en haut à droite)
3. Allez dans **"Connections"** ou **"Add connections"**
4. Sélectionnez votre intégration Notion
5. Vérifiez que l'intégration a accès à la base

#### Étape 5 : Mettre à Jour Railway

1. Allez dans Railway → Variables
2. Trouvez `NOTION_DATABASE_ID`
3. Remplacez par le Database ID (sans tirets)
4. Sauvegardez
5. Railway redéploiera automatiquement

### Vérification

Après avoir mis à jour, testez à nouveau. Les logs devraient afficher :
- `✅ Prospect trouvé : Carine Villodre`
- Plus d'erreur "Could not find database"

---

## ❌ Le nom ne correspond pas

### Problème

Le nom dans Calendly ne correspond pas exactement au nom dans Notion.

### Solution

1. Vérifiez le nom **exact** dans Notion (copiez-collez)
2. Utilisez le **même nom exact** dans Calendly
3. Attention aux :
   - Espaces avant/après
   - Majuscules/minuscules
   - Caractères spéciaux
   - Accents

Exemple :
- Notion : `Carine Villodre`
- Calendly : `Carine Villodre` (exactement pareil)

---

## ❌ Le prospect n'a pas de Website dans Notion

### Problème

Le prospect existe dans Notion mais n'a pas de site web.

### Solution

1. Ouvrez votre base Notion
2. Trouvez le prospect
3. Remplissez la colonne **Website** avec l'URL du site
4. Sauvegardez
5. Testez à nouveau

---

## ❌ Erreur de signature Calendly

### Problème

La signature du webhook est invalide.

### Solution

1. Vérifiez que `CALENDLY_WEBHOOK_SECRET` dans Railway correspond au **Signing Key** de Calendly
2. Les deux doivent être **exactement identiques**
3. Pas d'espaces avant/après

---

## ❌ Email non envoyé

### Problème

L'email n'est pas envoyé.

### Vérifications

1. `RESEND_API_KEY` est configuré dans Railway
2. `EMAIL_FROM` est un domaine vérifié dans Resend
3. `EMAIL_TO` est votre email de réception
4. Vérifiez les logs Railway pour les erreurs Resend

### Solution Temporaire

Si l'email échoue, l'URL Lovable est toujours dans les logs Railway. Vous pouvez la copier manuellement.

---

## 📞 Besoin d'Aide ?

Consultez les logs Railway pour plus de détails sur les erreurs.
