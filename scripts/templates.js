/**
 * Module de Templates Web pour LingalaAutomation
 * Permet de créer des templates HTML avec variables et routes dynamiques
 */
// Classe de Template
export class Kinongo {
    template;
    constructor(template) {
        this.template = template;
    }
    // Remplacer une variable {{variable}} par sa valeur
    ekokele(variable, value) {
        this.template = this.template.replace(new RegExp(`{{${variable}}}`, 'g'), value);
    }
    // Remplacer plusieurs variables à la fois
    ekokeleBeba(variables) {
        for (const [key, value] of Object.entries(variables)) {
            this.ekokele(key, value);
        }
    }
    // Générer le HTML final
    koboma() {
        return this.template;
    }
    // Charger depuis une chaîne
    static kobima(chaine) {
        return new Kinongo(chaine);
    }
}
// Classe de Route
export class Nzela {
    path;
    handler;
    method = 'GET';
    constructor(path, handler, method) {
        this.path = path;
        this.handler = handler;
        this.method = method || 'GET';
    }
}
// Classe de Middleware
export class Sele {
    handler;
    constructor(handler) {
        this.handler = handler;
    }
}
// Router simple
export class Moto {
    routes = [];
    middlewares = [];
    // Ajouter un middleware
    kokotaSele(sele) {
        this.middlewares.push(sele);
    }
    // Ajouter une route GET
    kokotaNzelaGET(path, handler) {
        this.routes.push(new Nzela(path, handler, 'GET'));
    }
    // Ajouter une route POST
    kokotaNzelaPOST(path, handler) {
        this.routes.push(new Nzela(path, handler, 'POST'));
    }
    // Trouver une route
    ketaNzela(method, path) {
        return this.routes.find(r => r.method === method && r.path === path) || null;
    }
    // Exécuter les middlewares
    async kojisaMiddlewares(req, res) {
        for (const sele of this.middlewares) {
            await new Promise((resolve) => {
                sele.handler(req, res, resolve);
            });
        }
        return true;
    }
}
