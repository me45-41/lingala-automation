/**
 * LingalaAutomation Runtime Standalone
 * Interpréteur JavaScript pur - Ne dépend pas de Node.js
 * Peut s'exécuter dans le navigateur, Deno, ou tout environnement JS
 */
export class LingalaRuntime {
    memory = new Map();
    functions = new Map();
    constructor() {
        this.initializeBuiltins();
    }
    // Initialiser les fonctions natives intégrées
    initializeBuiltins() {
        // Fonctions d'affichage
        this.functions.set('elobi', (...args) => {
            console.log(...args);
        });
        // Fonctions mathématiques
        this.functions.set('plus', (a, b) => a + b);
        this.functions.set('moins', (a, b) => a - b);
        this.functions.set('fois', (a, b) => a * b);
        this.functions.set('diviser', (a, b) => a / b);
        // Fonctions de chaînes
        this.functions.set('kofuta', (str) => str.length);
        this.functions.set('koyombaMonene', (str) => str.toUpperCase());
        this.functions.set('koyombaMoke', (str) => str.toLowerCase());
        // Types de données
        this.functions.set('Libuka', class LingalaList {
            items = [];
            kota(item) { this.items.push(item); }
            bokoni() { return this.items; }
        });
        this.functions.set('Diktionere', class LingalaDict {
            data = new Map();
            kota(key, value) { this.data.set(key, value); }
            kozwa(key) { return this.data.get(key); }
        });
    }
    // Définir une fonction utilisateur
    defineFunction(name, fn) {
        this.functions.set(name, fn);
    }
    // Définir une variable
    setVariable(name, value) {
        this.memory.set(name, value);
    }
    // Obtenir une variable
    getVariable(name) {
        return this.memory.get(name);
    }
    // Exécuter du code JavaScript compilé
    execute(compiledCode) {
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
        }
        catch (error) {
            console.error('Erreur d\'exécution:', error);
            throw error;
        }
    }
    // Version simplifiée pour le navigateur
    static createBrowserRuntime() {
        const runtime = new LingalaRuntime();
        // Surcharge elobi pour le navigateur
        runtime.functions.set('elobi', (...args) => {
            const output = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg).join(' ');
            // Afficher dans le DOM si disponible
            if (typeof globalThis.window !== 'undefined' && typeof globalThis.document !== 'undefined') {
                const doc = globalThis.document;
                const outputDiv = doc.getElementById('lingala-output') ||
                    doc.createElement('div');
                if (!doc.getElementById('lingala-output')) {
                    outputDiv.id = 'lingala-output';
                    outputDiv.style.cssText = 'background: #1e1e1e; color: #fff; padding: 10px; margin: 10px; border-radius: 5px; font-family: monospace;';
                    doc.body.appendChild(outputDiv);
                }
                outputDiv.innerHTML += `<div>${output}</div>`;
            }
            else {
                console.log(output);
            }
        });
        return runtime;
    }
}
