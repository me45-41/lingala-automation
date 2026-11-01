/**
 * Module Serveur Web pour LingalaAutomation
 * Permet de créer des serveurs HTTP et APIs
 */
import { createServer } from 'http';
/**
 * Démarrer un serveur HTTP
 * @param handler - Gestionnaire de requêtes
 * @param config - Configuration du serveur
 */
export function kobotaServer(handler, config) {
    const { port = 3000, host = 'localhost' } = config;
    const server = createServer(async (req, res) => {
        try {
            await handler(req, res);
        }
        catch (error) {
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
export function kobandaJSON(res, data, status = 200) {
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
export function kobandaHTML(res, html, status = 200) {
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
export function kobandaText(res, text, status = 200) {
    res.statusCode = status;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end(text);
}
/**
 * Récupérer le corps de la requête
 * @param req - Requête HTTP
 */
export async function kobandaBody(req) {
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
export async function kobandaJSONBody(req) {
    const body = await kobandaBody(req);
    return JSON.parse(body);
}
/**
 * Récupérer les paramètres de requête (query string)
 * @param url - URL de la requête
 */
export function kobandaQuery(url) {
    const queryIndex = url.indexOf('?');
    if (queryIndex === -1)
        return {};
    const queryString = url.slice(queryIndex + 1);
    const params = {};
    queryString.split('&').forEach(param => {
        const [key, value] = param.split('=');
        params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    });
    return params;
}
/**
 * Récupérer les paramètres de route
 * @param url - URL de la requête
 * @param pattern - Pattern de route
 */
export function kobandaParams(url, pattern) {
    const urlParts = url.split('/').filter(Boolean);
    const patternParts = pattern.split('/').filter(Boolean);
    const params = {};
    patternParts.forEach((part, index) => {
        if (part.startsWith(':')) {
            const paramName = part.slice(1);
            params[paramName] = urlParts[index] || '';
        }
    });
    return params;
}
