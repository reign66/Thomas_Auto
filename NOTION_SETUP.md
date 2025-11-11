# 🔧 Configuration Notion - Guide Complet

## ⚠️ Erreur : "Provided ID is a page, not a database"

Si vous voyez cette erreur, c'est que `NOTION_DATABASE_ID` pointe vers une **page** au lieu d'une **base de données**.

## 📋 Comment Récupérer le Bon Database ID

### Méthode 1 : Depuis l'URL de la Base de Données

1. Ouvrez votre base de données Notion "Stratégie Commercial"
2. Regardez l'URL dans votre navigateur :
   ```
   https://www.notion.so/workspace/2a45bf2e124780618252cf111fb53c5e?v=...
   ```
3. Le **Database ID** est la partie entre le dernier `/` et le `?` :
   - Dans cet exemple : `2a45bf2e124780618252cf111fb53c5e`
   - ⚠️ **MAIS** : Si cette URL ouvre une page (pas une vue de base de données), ce n'est pas le bon ID

### Méthode 2 : Depuis une Vue de la Base de Données

1. Dans votre base "Stratégie Commercial", créez ou ouvrez une vue (Table, Board, etc.)
2. L'URL devrait ressembler à :
   ```
   https://www.notion.so/workspace/2a45bf2e124780618252cf111fb53c5e?v=abc123def456
   ```
3. Le Database ID est la partie avant le `?` :
   - `2a45bf2e124780618252cf111fb53c5e`

### Méthode 3 : Via l'API Notion

1. Allez sur https://www.notion.so/my-integrations
2. Sélectionnez votre intégration
3. Dans "Capabilities", vérifiez que "Read content" et "Update content" sont activés
4. Allez dans votre base de données Notion
5. Cliquez sur "..." (menu) → "Connections" → Ajoutez votre intégration
6. L'URL devrait maintenant contenir le bon Database ID

### Méthode 4 : Vérifier que c'est bien une Base de Données

**Signes que c'est une BASE DE DONNÉES** :
- ✅ Vous voyez des colonnes (Nom Du Prospect, Website, Logo, etc.)
- ✅ Vous pouvez ajouter des lignes
- ✅ Vous voyez une vue Table/Board/List
- ✅ L'URL contient `?v=` avec un ID de vue

**Signes que c'est une PAGE** :
- ❌ Vous voyez du contenu éditable (blocs de texte, images, etc.)
- ❌ Pas de colonnes visibles
- ❌ Pas de vue Table/Board

## 🔧 Correction dans Railway

1. Allez dans Railway → Variables
2. Trouvez `NOTION_DATABASE_ID`
3. Remplacez par le bon Database ID (sans tirets, format : `2a45bf2e124780618252cf111fb53c5e`)
4. Sauvegardez
5. Railway redéploiera automatiquement

## ✅ Vérification

Après avoir mis à jour le Database ID, testez à nouveau. Les logs devraient afficher :
- `✅ Prospect trouvé : Carine Villodre`
- Plus d'erreur "is a page, not a database"

## 📝 Format du Database ID

Le Database ID Notion est un UUID sans tirets :
- ✅ Bon format : `2a45bf2e124780618252cf111fb53c5e` (32 caractères hexadécimaux)
- ❌ Mauvais format : `2a45bf2e-1247-8061-8252-cf111fb53c5e` (avec tirets)

Si votre ID a des tirets, supprimez-les avant de le mettre dans Railway.

---

**Une fois corrigé, le système devrait fonctionner ! 🚀**
