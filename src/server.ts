/**
 * Module Serveur Web pour LingalaAutomation
 * Permet de créer des serveurs HTTP et APIs
 */

import { createServer, IncomingMessage, ServerResponse } from 'http';

/**
 * Gestionnaire de requête
 */
export type RequestHandler = (req: IncomingMessage, res: ServerResponse) => void | Promise<void>;

/**
 * Configuration du serveur
 */
export interface ServerConfig {
  port: number;
  host?: string;
}

/**
 * Démarrer un serveur HTTP
 * @param handler - Gestionnaire de requêtes
 * @param config - Configuration du serveur
 */
export function kobotaServer(handler: RequestHandler, config: ServerConfig): void {
  const { port = 3000, host = 'localhost' } = config;

  const server = createServer(async (req, res) => {
    try {
      await handler(req, res);
    } catch (error) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Erreur serveur' }));
    }
  });

  server.listen(port, host, () => {
    console.log(`Serveur démarré sur http://${host}:${port}`);
  });
}

/**
 * Envoyer une réponse JSON
 * @param res - Réponse HTTP
 * @param data - Données à envoyer
 * @param status - Code de statut
 */
export function kobandaJSON(res: ServerResponse, data: any, status: number = 200): void {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

/**
 * Envoyer une réponse HTML
 * @param res - Réponse HTTP
 * @param html - Contenu HTML
 * @param status - Code de statut
 */
export function kobandaHTML(res: ServerResponse, html: string, status: number = 200): void {
  res.statusCode = status;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(html);
}

/**
 * Envoyer une réponse texte
 * @param res - Réponse HTTP
 * @param text - Contenu texte
 * @param status - Code de statut
 */
export function kobandaText(res: ServerResponse, text: string, status: number = 200): void {
  res.statusCode = status;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end(text);
}

/**
 * Récupérer le corps de la requête
 * @param req - Requête HTTP
 */
export async function kobandaBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      resolve(body);
    });
    req.on('error', reject);
  });
}

/**
 * Parser le corps JSON
 * @param req - Requête HTTP
 */
export async function kobandaJSONBody(req: IncomingMessage): Promise<any> {
  const body = await kobandaBody(req);
  return JSON.parse(body);
}

/**
 * Récupérer les paramètres de requête (query string)
 * @param url - URL de la requête
 */
export function kobandaQuery(url: string): Record<string, string> {
  const queryIndex = url.indexOf('?');
  if (queryIndex === -1) return {};

  const queryString = url.slice(queryIndex + 1);
  const params: Record<string, string> = {};

  // Garde : éviter de traiter une chaîne vide
  if (!queryString) {
    return params;
  }

  queryString.split('&').forEach(param => {
    // Garde : ignorer les paramètres vides
    if (!param || param.trim() === '') {
      return;
    }

    const parts = param.split('=');
    const key = parts[0];
    const value = parts.length > 1 ? parts.slice(1).join('=') : '';

    // Garde : ignorer les clés vides
    if (!key || key.trim() === '') {
      return;
    }

    params[decodeURIComponent(key)] = decodeURIComponent(value || '');
  });

  return params;
}

/**
 * Récupérer les paramètres de route
 * @param url - URL de la requête
 * @param pattern - Pattern de route
 */
export function kobandaParams(url: string, pattern: string): Record<string, string> {
  // Garde : éviter de traiter des URLs ou patterns vides
  if (!url || !pattern) {
    return {};
  }

  const urlParts = url.split('/').filter(Boolean);
  const patternParts = pattern.split('/').filter(Boolean);

  const params: Record<string, string> = {};

  patternParts.forEach((part, index) => {
    // Garde : vérifier que le paramètre commence par :
    if (part && part.startsWith(':')) {
      // Garde : vérifier que le slice ne sera pas sur une chaîne vide
      const paramName = part.length > 1 ? part.slice(1) : '';
      // Garde : vérifier que l'index existe dans urlParts
      if (paramName && index < urlParts.length) {
        params[paramName] = urlParts[index] || '';
      }
    }
  });

  return params;
}
