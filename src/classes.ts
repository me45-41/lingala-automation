/**
 * Système de classes pour LingalaAutomation
 * Inspiré de Python et JavaScript ES6
 */

// Classe de base pour tous les objets
export class Bomba {
  constructor() {
    // Constructeur de base
  }

  // Méthode pour convertir en chaîne
  toString(): string {
    return `[Bomba]`;
  }
}

// Décorateur pour créer des classes (similaire à Python class)
export function klasi<T extends Bomba>(
  definition: {
    constructor?: (...args: any[]) => void;
    [key: string]: any;
  }
): new (...args: any[]) => T {
  // Créer une classe dynamique
  class DynamicClass extends Bomba {
    constructor(...args: any[]) {
      super();
      if (definition.constructor) {
        definition.constructor.apply(this, args);
      }
    }
  }

  // Ajouter les méthodes et propriétés
  for (const key of Object.keys(definition)) {
    if (key !== 'constructor') {
      (DynamicClass.prototype as any)[key] = definition[key];
    }
  }

  return DynamicClass as new (...args: any[]) => T;
}

// Fonction pour vérifier si un objet est une instance d'une classe
export function koyokaBomba(obj: any, classConstructor: any): boolean {
  return obj instanceof classConstructor;
}

// Fonction pour obtenir le type d'un objet
export function typeMwa(obj: any): string {
  if (obj === null) return "nul";
  if (Array.isArray(obj)) return "libuka";
  if (obj instanceof Map) return "diktionere";
  if (obj instanceof Set) return "ensemble";
  return typeof obj;
}

// Métaclasse pour les propriétés dynamiques
export class Metaklasi {
  private properties: Map<string, any> = new Map();

  kotaPropriete(name: string, value: any): void {
    this.properties.set(name, value);
  }

  kozwaPropriete(name: string): any {
    return this.properties.get(name);
  }

  koyokaPropriete(name: string): boolean {
    return this.properties.has(name);
  }

  longolaPropriete(name: string): boolean {
    return this.properties.delete(name);
  }

  bikokiPropriete(): string[] {
    return Array.from(this.properties.keys());
  }
}
