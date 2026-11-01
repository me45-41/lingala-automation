/**
 * Module HTTP pour LingalaAutomation
 * Permet de faire des requêtes web comme requests en Python
 */
/**
 * Faire une requête HTTP GET
 * @param url - URL de la requête
 * @param options - Options de la requête
 */
export async function koyoka(url, options) {
    return await httpRequest(url, { ...options, method: 'GET' });
}
/**
 * Faire une requête HTTP POST
 * @param url - URL de la requête
 * @param body - Corps de la requête
 * @param options - Options de la requête
 */
export async function kokisa(url, body, options) {
    return await httpRequest(url, { ...options, method: 'POST', body });
}
/**
 * Faire une requête HTTP PUT
 * @param url - URL de la requête
 * @param body - Corps de la requête
 * @param options - Options de la requête
 */
export async function koboma(url, body, options) {
    return await httpRequest(url, { ...options, method: 'PUT', body });
}
/**
 * Faire une requête HTTP DELETE
 * @param url - URL de la requête
 * @param options - Options de la requête
 */
export async function kobomaDelete(url, options) {
    return await httpRequest(url, { ...options, method: 'DELETE' });
}
/**
 * Faire une requête HTTP PATCH
 * @param url - URL de la requête
 * @param body - Corps de la requête
 * @param options - Options de la requête
 */
export async function kobongola(url, body, options) {
    return await httpRequest(url, { ...options, method: 'PATCH', body });
}
/**
 * Fonction interne pour faire une requête HTTP
 */
async function httpRequest(url, options = {}) {
    const { method = 'GET', headers = {}, body, timeout = 30000 } = options;
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        const fetchOptions = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };
        if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
        }
        const response = await fetch(url, {
            ...fetchOptions,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        const responseHeaders = {};
        response.headers.forEach((value, key) => {
            responseHeaders[key] = value;
        });
        const responseBody = await response.text();
        return {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
            body: responseBody,
            ok: response.ok
        };
    }
    catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            throw new Error(`Timeout après ${timeout}ms`);
        }
        throw error;
    }
}
/**
 * Parser du JSON
 * @param jsonString - Chaîne JSON
 */
export function kobandaJSON(jsonString) {
    try {
        return JSON.parse(jsonString);
    }
    catch (error) {
        throw new Error(`Erreur parsing JSON: ${error}`);
    }
}
/**
 * Convertir en JSON
 * @param obj - Objet à convertir
 */
export function kobomaJSON(obj) {
    try {
        return JSON.stringify(obj, null, 2);
    }
    catch (error) {
        throw new Error(`Erreur conversion JSON: ${error}`);
    }
}
