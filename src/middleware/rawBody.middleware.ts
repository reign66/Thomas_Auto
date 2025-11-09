import { Request, Response, NextFunction } from 'express';

/**
 * Middleware pour capturer le body brut avant le parsing JSON
 * Nécessaire pour la validation de signature HMAC Calendly
 */
export function rawBodyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Seulement pour la route /webhooks/calendly
  if (req.method === 'POST' && req.originalUrl === '/webhooks/calendly') {
    let data = '';
    
    req.setEncoding('utf8');
    req.on('data', (chunk: string) => {
      data += chunk;
    });
    
    req.on('end', () => {
      // Sauvegarder le body brut pour la validation HMAC
      (req as any).rawBody = data;
      
      // Parser le JSON pour l'utiliser dans le handler
      try {
        req.body = JSON.parse(data);
      } catch (e) {
        req.body = {};
      }
      next();
    });
  } else {
    next();
  }
}
