import { Resend } from 'resend';
import { config } from '../config';
import { logger } from '../utils/logger';

const resend = new Resend(config.email.resendApiKey);

export interface EmailData {
  prospectName: string;
  lovableUrl: string;
  originalWebsite: string;
}

/**
 * Envoie un email avec l'URL Lovable générée
 */
export async function sendLovableUrlEmail(data: EmailData): Promise<void> {
  try {
    logger.info(`📧 Envoi email à : ${config.email.to}`);

    const subject = `✅ Site prêt à générer pour ${data.prospectName}`;
    
    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 10px 10px 0 0;
      text-align: center;
    }
    .content {
      background: #f9f9f9;
      padding: 30px;
      border-radius: 0 0 10px 10px;
    }
    .button {
      display: inline-block;
      background: #667eea;
      color: white;
      padding: 15px 30px;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
      font-weight: bold;
      text-align: center;
    }
    .button:hover {
      background: #5568d3;
    }
    .info-box {
      background: white;
      padding: 15px;
      border-left: 4px solid #667eea;
      margin: 20px 0;
      border-radius: 4px;
    }
    .footer {
      text-align: center;
      color: #666;
      font-size: 12px;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>✅ Site prêt à générer</h1>
  </div>
  <div class="content">
    <p>Bonjour,</p>
    
    <p>Le site pour <strong>${data.prospectName}</strong> est prêt à être généré !</p>
    
    <div class="info-box">
      <strong>Site analysé :</strong><br>
      <a href="${data.originalWebsite}" target="_blank">${data.originalWebsite}</a>
    </div>
    
    <p>Cliquez sur ce lien pour lancer la génération :</p>
    
    <div style="text-align: center;">
      <a href="${data.lovableUrl}" class="button" target="_blank">
        🚀 Générer le site avec Lovable
      </a>
    </div>
    
    <p style="margin-top: 30px;">
      Le site sera généré automatiquement en 5-10 minutes.
    </p>
  </div>
  
  <div class="footer">
    Généré automatiquement par votre système Lovable
  </div>
</body>
</html>
`;

    const textBody = `
Bonjour,

Le site pour ${data.prospectName} est prêt à être généré !

Site analysé : ${data.originalWebsite}

Cliquez sur ce lien pour lancer la génération :
👉 ${data.lovableUrl}

Le site sera généré automatiquement.

---
Généré automatiquement par votre système Lovable
`;

    const result = await resend.emails.send({
      from: config.email.from,
      to: config.email.to,
      subject: subject,
      html: htmlBody,
      text: textBody,
    });

    if (result.error) {
      throw new Error(`Erreur Resend: ${result.error.message}`);
    }

    logger.info(`✅ Email envoyé avec succès (ID: ${result.data?.id})`);
  } catch (error: any) {
    logger.error(`❌ Erreur lors de l'envoi de l'email :`, error.message);
    throw error;
  }
}

/**
 * Envoie un email d'erreur
 */
export async function sendErrorEmail(
  prospectName: string,
  errorMessage: string,
  errorDetails?: string
): Promise<void> {
  try {
    logger.info(`📧 Envoi email d'erreur à : ${config.email.to}`);

    const subject = `❌ Erreur - Génération site pour ${prospectName}`;
    
    const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: #dc3545;
      color: white;
      padding: 30px;
      border-radius: 10px 10px 0 0;
      text-align: center;
    }
    .content {
      background: #f9f9f9;
      padding: 30px;
      border-radius: 0 0 10px 10px;
    }
    .error-box {
      background: #fff3cd;
      border: 1px solid #ffc107;
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
    }
    .details {
      background: white;
      padding: 15px;
      border-left: 4px solid #dc3545;
      margin: 20px 0;
      border-radius: 4px;
      font-family: monospace;
      font-size: 12px;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>❌ Erreur de génération</h1>
  </div>
  <div class="content">
    <p>Bonjour,</p>
    
    <p>Une erreur s'est produite lors de la génération du site pour <strong>${prospectName}</strong>.</p>
    
    <div class="error-box">
      <strong>Erreur :</strong><br>
      ${errorMessage}
    </div>
    
    ${errorDetails ? `
    <div class="details">
      <strong>Détails :</strong><br>
      ${errorDetails}
    </div>
    ` : ''}
    
    <p>Veuillez vérifier les logs Railway pour plus d'informations.</p>
  </div>
</body>
</html>
`;

    const textBody = `
Bonjour,

Une erreur s'est produite lors de la génération du site pour ${prospectName}.

Erreur : ${errorMessage}

${errorDetails ? `Détails : ${errorDetails}` : ''}

Veuillez vérifier les logs Railway pour plus d'informations.
`;

    const result = await resend.emails.send({
      from: config.email.from,
      to: config.email.to,
      subject: subject,
      html: htmlBody,
      text: textBody,
    });

    if (result.error) {
      logger.error(`❌ Impossible d'envoyer l'email d'erreur :`, result.error.message);
      return; // On ne throw pas pour éviter une boucle d'erreurs
    }

    logger.info(`✅ Email d'erreur envoyé (ID: ${result.data?.id})`);
  } catch (error: any) {
    logger.error(`❌ Erreur lors de l'envoi de l'email d'erreur :`, error.message);
    // On ne throw pas pour éviter une boucle d'erreurs
  }
}
