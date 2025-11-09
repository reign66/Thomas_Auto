# 🔧 Configuration Webhook Calendly - Guide Complet

## ⚠️ Comportement Important des Webhooks Calendly

Les webhooks Calendly se déclenchent **UNIQUEMENT** dans ces cas :

✅ **Déclenchement** :
- Quand un invité réserve via la **page publique de Calendly**
- Quand un invité confirme un rendez-vous via le formulaire web
- Quand un invité remplit le formulaire sur "View booking page"

❌ **Ne se déclenche PAS** :
- Quand vous créez un événement via l'API Calendly (`POST /invitees`)
- Quand vous modifiez un événement via l'API
- Pour les événements créés programmatiquement sans interaction utilisateur

## 📋 Configuration du Webhook

### 1. URL du Webhook

Votre URL Railway : `https://thomasauto-production.up.railway.app`

**URL complète du webhook** :
```
https://thomasauto-production.up.railway.app/webhooks/calendly
```

### 2. Configuration dans Calendly

1. Allez sur https://calendly.com/integrations/webhooks
2. Cliquez sur **"New webhook"**
3. Remplissez :
   - **Event** : `invitee.created` (quand un rendez-vous est confirmé)
   - **URL** : `https://thomasauto-production.up.railway.app/webhooks/calendly`
   - **Signing Key** : Copiez cette clé (vous en aurez besoin)

4. Cliquez sur **"Add webhook"**

### 3. Configuration dans Railway

1. Allez dans votre projet Railway
2. Cliquez sur **Variables**
3. Ajoutez/modifiez :
   - `CALENDLY_WEBHOOK_SECRET` = La clé "Signing Key" copiée depuis Calendly
   - `APP_URL` = `https://thomasauto-production.up.railway.app`

4. Sauvegardez

### 4. Vérification

1. Testez le health check :
   ```
   https://thomasauto-production.up.railway.app/health
   ```
   Vous devriez voir : `{"status":"ok","timestamp":"..."}`

2. Testez l'endpoint webhook (devrait retourner une erreur de signature, mais confirme que l'endpoint est accessible) :
   ```bash
   curl -X POST https://thomasauto-production.up.railway.app/webhooks/calendly \
     -H "Content-Type: application/json" \
     -d '{"test": "data"}'
   ```

## 🔄 Workflow avec API Calendly

Si vous créez des événements via l'API Calendly (`POST /invitees`), voici le workflow :

### Workflow Actuel (API + Page Publique)

1. **Vous créez l'event via API** :
   ```bash
   POST https://api.calendly.com/invitees
   {
     "event_type": "https://api.calendly.com/event_types/...",
     "start_time": "2025-11-10T10:00:00Z",
     "invitee": {
       "name": "Test Prospect",
       "email": "test@example.com",
       "timezone": "Europe/Paris"
     },
     "questions_and_answers": [
       {
         "question": "Site Web",
         "answer": "https://example.com",
         "position": 0
       }
     ]
   }
   ```

2. **L'invité clique sur "View booking page"** et remplit le formulaire

3. **L'invité confirme** → Le webhook `invitee.created` se déclenche ✅

### Alternative : Appel Direct au Service

Si vous voulez déclencher le processus directement depuis votre code (sans passer par la page publique), vous pouvez appeler directement votre service :

```bash
POST https://thomasauto-production.up.railway.app/webhooks/calendly
Content-Type: application/json
Calendly-Webhook-Signature: sha256=...

{
  "event": "invitee.created",
  "invitee": {
    "name": "Test Prospect",
    "email": "test@example.com"
  },
  "questions_and_answers": [
    {
      "question": "Site Web",
      "answer": "https://example.com"
    }
  ]
}
```

⚠️ **Note** : Vous devrez générer la signature HMAC vous-même avec votre `CALENDLY_WEBHOOK_SECRET`.

## 🧪 Test du Webhook

### Test 1 : Via la Page Publique (Recommandé)

1. Créez un event via l'API Calendly
2. Cliquez sur "View booking page"
3. Remplissez le formulaire avec :
   - Name : `Test Prospect` (exactement le même nom que dans Notion)
   - Email : `test@example.com`
   - Site Web : `https://example.com`
4. Confirmez
5. Vérifiez les logs Railway → Le webhook devrait être reçu

### Test 2 : Test Manuel avec curl

```bash
# Générer la signature (remplacez SECRET et BODY)
SECRET="votre_calendly_webhook_secret"
BODY='{"event":"invitee.created","invitee":{"name":"Test Prospect","email":"test@example.com"},"questions_and_answers":[{"question":"Site Web","answer":"https://example.com"}]}'

# Calculer HMAC SHA256
SIGNATURE=$(echo -n "$BODY" | openssl dgst -sha256 -hmac "$SECRET" -binary | base64)
SIGNATURE="sha256=$SIGNATURE"

# Envoyer la requête
curl -X POST https://thomasauto-production.up.railway.app/webhooks/calendly \
  -H "Content-Type: application/json" \
  -H "Calendly-Webhook-Signature: $SIGNATURE" \
  -d "$BODY"
```

## 🐛 Dépannage

### Le webhook n'est pas reçu

**Vérifications** :
1. ✅ L'URL du webhook dans Calendly est correcte : `https://thomasauto-production.up.railway.app/webhooks/calendly`
2. ✅ Le service Railway est **Running**
3. ✅ Le health check fonctionne : `https://thomasauto-production.up.railway.app/health`
4. ✅ Vous avez bien rempli le formulaire sur la **page publique** (pas juste créé via API)
5. ✅ La question "Site Web" existe dans votre formulaire Calendly

**Test** :
- Ouvrez les logs Railway en temps réel
- Créez un rendez-vous via la page publique
- Vous devriez voir immédiatement : `[INFO] 🔔 Webhook Calendly reçu pour : ...`

### Erreur "Signature invalide"

**Cause** : Le `CALENDLY_WEBHOOK_SECRET` dans Railway ne correspond pas au "Signing Key" de Calendly

**Solution** :
1. Allez dans Calendly → Webhooks → Votre webhook
2. Copiez le "Signing Key"
3. Allez dans Railway → Variables → `CALENDLY_WEBHOOK_SECRET`
4. Collez exactement la même valeur (sans espaces avant/après)
5. Redéployez si nécessaire

### Le webhook est reçu mais le processus échoue

Vérifiez les logs Railway pour voir où ça bloque :
- Prospect introuvable dans Notion → Vérifiez le nom exact
- Erreur Claude API → Vérifiez la clé API
- Erreur Notion → Vérifiez les permissions et les noms de colonnes

## 📝 Checklist de Configuration

- [ ] Webhook créé dans Calendly avec l'URL correcte
- [ ] Event sélectionné : `invitee.created`
- [ ] Signing Key copié depuis Calendly
- [ ] `CALENDLY_WEBHOOK_SECRET` configuré dans Railway (même valeur que Signing Key)
- [ ] `APP_URL` configuré dans Railway : `https://thomasauto-production.up.railway.app`
- [ ] Health check fonctionne
- [ ] Question "Site Web" ajoutée au formulaire Calendly
- [ ] Test effectué via la page publique Calendly

---

**Une fois tout configuré, testez avec un vrai rendez-vous via la page publique ! 🚀**
