import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  calendly: {
    webhookSecret: process.env.CALENDLY_WEBHOOK_SECRET || '',
  },
  
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || '',
  },
  
  notion: {
    apiKey: process.env.NOTION_API_KEY || '',
    databaseId: process.env.NOTION_DATABASE_ID || '',
  },
  
  app: {
    url: process.env.APP_URL || 'http://localhost:3000',
  },
};

// Validation des variables critiques
if (!config.calendly.webhookSecret) {
  console.warn('⚠️  CALENDLY_WEBHOOK_SECRET non défini');
}

if (!config.anthropic.apiKey) {
  console.warn('⚠️  ANTHROPIC_API_KEY non défini');
}

if (!config.notion.apiKey) {
  console.warn('⚠️  NOTION_API_KEY non défini');
}

if (!config.notion.databaseId) {
  console.warn('⚠️  NOTION_DATABASE_ID non défini');
}
