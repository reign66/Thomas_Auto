import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { logger } from './utils/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { rawBodyMiddleware } from './middleware/rawBody.middleware';
import webhooksRoutes from './routes/webhooks.routes';

const app = express();

// Middleware de sécurité
app.use(helmet());
app.use(cors());

// Parser JSON pour toutes les routes sauf /webhooks/calendly
app.use((req, res, next) => {
  if (req.originalUrl === '/webhooks/calendly' && req.method === 'POST') {
    // Pour cette route, on utilise rawBodyMiddleware qui gère le parsing
    return rawBodyMiddleware(req, res, next);
  }
  // Pour les autres routes, utiliser le parser JSON standard
  express.json({ limit: '10mb' })(req, res, next);
});

app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting pour les webhooks
const webhookLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requêtes par minute
  message: 'Trop de requêtes, veuillez réessayer plus tard.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Routes
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.use('/webhooks', webhookLimiter, webhooksRoutes);

// Gestion des erreurs
app.use(notFoundHandler);
app.use(errorHandler);

// Démarrage du serveur
const PORT = config.port;

app.listen(PORT, () => {
  logger.info(`🚀 Serveur démarré sur le port ${PORT}`);
  logger.info(`📡 Environnement : ${config.nodeEnv}`);
  logger.info(`🔗 Health check : http://localhost:${PORT}/health`);
  logger.info(`📥 Webhook Calendly : http://localhost:${PORT}/webhooks/calendly`);
});

// Gestion gracieuse de l'arrêt
process.on('SIGTERM', () => {
  logger.info('SIGTERM reçu, arrêt du serveur...');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT reçu, arrêt du serveur...');
  process.exit(0);
});
