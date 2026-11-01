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
    toString() {
        return `[Bomba]`;
    }
}
// Décorateur pour créer des classes (similaire à Python class)
export function klasi(definition) {
    // Créer une classe dynamique
    class DynamicClass extends Bomba {
        constructor(...args) {
            super();
            if (definition.constructor) {
                definition.constructor.apply(this, args);
            }
        }
    }
    // Ajouter les méthodes et propriétés
    for (const key of Object.keys(definition)) {
        if (key !== 'constructor') {
            DynamicClass.prototype[key] = definition[key];
        }
    }
    return DynamicClass;
}
// Fonction pour vérifier si un objet est une instance d'une classe
export function koyokaBomba(obj, classConstructor) {
    return obj instanceof classConstructor;
}
// Fonction pour obtenir le type d'un objet
export function typeMwa(obj) {
    if (obj === null)
        return "nul";
    if (Array.isArray(obj))
        return "libuka";
    if (obj instanceof Map)
        return "diktionere";
    if (obj instanceof Set)
        return "ensemble";
    return typeof obj;
}
// Métaclasse pour les propriétés dynamiques
export class Metaklasi {
    properties = new Map();
    kotaPropriete(name, value) {
        this.properties.set(name, value);
    }
    kozwaPropriete(name) {
        return this.properties.get(name);
    }
    koyokaPropriete(name) {
        return this.properties.has(name);
    }
    longolaPropriete(name) {
        return this.properties.delete(name);
    }
    bikokiPropriete() {
        return Array.from(this.properties.keys());
    }
}
