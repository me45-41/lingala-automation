/**
 * LingalaAutomation Runtime Standalone
 * Interpréteur JavaScript pur - Ne dépend pas de Node.js
 * Peut s'exécuter dans le navigateur, Deno, ou tout environnement JS
 */

export class LingalaRuntime {
  private memory: Map<string, any> = new Map();
  private functions: Map<string, Function> = new Map();

  constructor() {
    this.initializeBuiltins();
  }

  // Initialiser les fonctions natives intégrées
  private initializeBuiltins(): void {
    // Fonctions d'affichage
    this.functions.set('elobi', (...args: any[]) => {
      console.log(...args);
    });

    // Fonctions mathématiques
    this.functions.set('plus', (a: number, b: number) => a + b);
    this.functions.set('moins', (a: number, b: number) => a - b);
    this.functions.set('fois', (a: number, b: number) => a * b);
    this.functions.set('diviser', (a: number, b: number) => a / b);

    // Fonctions de chaînes
    this.functions.set('kofuta', (str: string) => str.length);
    this.functions.set('koyombaMonene', (str: string) => str.toUpperCase());
    this.functions.set('koyombaMoke', (str: string) => str.toLowerCase());

    // Types de données
    this.functions.set('Libuka', class LingalaList {
      private items: any[] = [];
      kota(item: any) { this.items.push(item); }
      bokoni() { return this.items; }
    });

    this.functions.set('Diktionere', class LingalaDict {
      private data: Map<string, any> = new Map();
      kota(key: string, value: any) { this.data.set(key, value); }
      kozwa(key: string) { return this.data.get(key); }
    });
  }

  // Définir une fonction utilisateur
  defineFunction(name: string, fn: Function): void {
    this.functions.set(name, fn);
  }

  // Définir une variable
  setVariable(name: string, value: any): void {
    this.memory.set(name, value);
  }

  // Obtenir une variable
  getVariable(name: string): any {
    return this.memory.get(name);
  }

  // Exécuter du code JavaScript compilé
  execute(compiledCode: string): any {
    try {
      // Créer un contexte sécurisé avec les fonctions natives
      const context = {
        // Variables globales
        ok: true,
        te: false,
        
        // Fonctions natives
        elobi: this.functions.get('elobi'),
        plus: this.functions.get('plus'),
        moins: this.functions.get('moins'),
        fois: this.functions.get('fois'),
        diviser: this.functions.get('diviser'),
        kofuta: this.functions.get('kofuta'),
        koyombaMonene: this.functions.get('koyombaMonene'),
        koyombaMoke: this.functions.get('koyombaMoke'),
        Libuka: this.functions.get('Libuka'),
        Diktionere: this.functions.get('Diktionere'),
        
        // Fonctions utilisateur
        ...Object.fromEntries(this.functions)
      };

      // Exécuter avec Function() mais dans un contexte limité
      const fn = new Function(...Object.keys(context), compiledCode);
      return fn(...Object.values(context));
    } catch (error) {
      console.error('Erreur d\'exécution:', error);
      throw error;
    }
  }

  // Version simplifiée pour le navigateur
  static createBrowserRuntime(): LingalaRuntime {
    const runtime = new LingalaRuntime();
    
    // Surcharge elobi pour le navigateur
    runtime.functions.set('elobi', (...args: any[]) => {
      const output = args.map(arg =>
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg
      ).join(' ');

      // Afficher dans le DOM si disponible
      if (typeof (globalThis as any).window !== 'undefined' && typeof (globalThis as any).document !== 'undefined') {
        const doc = (globalThis as any).document;
        const outputDiv = doc.getElementById('lingala-output') ||
                       doc.createElement('div');
        if (!doc.getElementById('lingala-output')) {
          outputDiv.id = 'lingala-output';
          outputDiv.style.cssText = 'background: #1e1e1e; color: #fff; padding: 10px; margin: 10px; border-radius: 5px; font-family: monospace;';
          doc.body.appendChild(outputDiv);
        }
        outputDiv.innerHTML += `<div>${output}</div>`;
      } else {
        console.log(output);
      }
    });

    return runtime;
  }
}
