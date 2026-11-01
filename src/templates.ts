/**
 * Module de Templates Web pour LingalaAutomation
 * Permet de créer des templates HTML avec variables et routes dynamiques
 */

// Classe de Template
export class Kinongo {
  private template: string;

  constructor(template: string) {
    this.template = template;
  }

  // Remplacer une variable {{variable}} par sa valeur
  ekokele(variable: string, value: string): void {
    this.template = this.template.replace(new RegExp(`{{${variable}}}`, 'g'), value);
  }

  // Remplacer plusieurs variables à la fois
  ekokeleBeba(variables: Record<string, string>): void {
    for (const [key, value] of Object.entries(variables)) {
      this.ekokele(key, value);
    }
  }

  // Générer le HTML final
  koboma(): string {
    return this.template;
  }

  // Charger depuis une chaîne
  static kobima(chaine: string): Kinongo {
    return new Kinongo(chaine);
  }
}

// Classe de Route
export class Nzela {
  path: string;
  handler: (req: any, res: any) => void | Promise<void>;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET';

  constructor(path: string, handler: (req: any, res: any) => void | Promise<void>, method?: 'GET' | 'POST' | 'PUT' | 'DELETE') {
    this.path = path;
    this.handler = handler;
    this.method = method || 'GET';
  }
}

// Classe de Middleware
export class Sele {
  handler: (req: any, res: any, next: () => void) => void;

  constructor(handler: (req: any, res: any, next: () => void) => void) {
    this.handler = handler;
  }
}

// Router simple
export class Moto {
  private routes: Nzela[] = [];
  private middlewares: Sele[] = [];

  // Ajouter un middleware
  kokotaSele(sele: Sele): void {
    this.middlewares.push(sele);
  }

  // Ajouter une route GET
  kokotaNzelaGET(path: string, handler: (req: any, res: any) => void | Promise<void>): void {
    this.routes.push(new Nzela(path, handler, 'GET'));
  }

  // Ajouter une route POST
  kokotaNzelaPOST(path: string, handler: (req: any, res: any) => void | Promise<void>): void {
    this.routes.push(new Nzela(path, handler, 'POST'));
  }

  // Trouver une route
  ketaNzela(method: string, path: string): Nzela | null {
    return this.routes.find(r => r.method === method && r.path === path) || null;
  }

  // Exécuter les middlewares
  async kojisaMiddlewares(req: any, res: any): Promise<boolean> {
    for (const sele of this.middlewares) {
      await new Promise<void>((resolve) => {
        sele.handler(req, res, resolve);
      });
    }
    return true;
  }
}
