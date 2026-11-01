/**
 * Types de données avancés pour LingalaAutomation
 * Inspiré de Python : listes, dictionnaires, tuples, sets
 */
// Liste (similaire à Python list)
export class Libuka {
    items = [];
    constructor(items) {
        if (items) {
            this.items = [...items];
        }
    }
    // Ajouter un élément (append)
    kota(item) {
        this.items.push(item);
    }
    // Étendre avec une autre liste (extend)
    kokota(other) {
        this.items.push(...other.items);
    }
    // Insérer à un index (insert)
    kokisa(index, item) {
        this.items.splice(index, 0, item);
    }
    // Supprimer par valeur (remove)
    longola(item) {
        const index = this.items.indexOf(item);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }
    // Supprimer par index et retourner (pop)
    zonga(index) {
        if (index === undefined) {
            return this.items.pop();
        }
        const item = this.items[index];
        this.items.splice(index, 1);
        return item;
    }
    // Trier (sort)
    lotemisa() {
        this.items.sort();
    }
    // Inverser (reverse)
    kokanzisa() {
        this.items.reverse();
    }
    // Longueur
    bokoni() {
        return this.items.length;
    }
    // Index d'un élément
    index(item) {
        return this.items.indexOf(item);
    }
    // Compter les occurrences
    kobanda(item) {
        return this.items.filter(i => i === item).length;
    }
    // Obtenir un élément
    kozwa(index) {
        return this.items[index];
    }
    // Slicing (comme Python)
    kotaMokili(start, end) {
        return new Libuka(this.items.slice(start, end));
    }
    // Convertir en tableau JavaScript
    toArray() {
        return [...this.items];
    }
    // Parcourir (forEach)
    mpoNaMokoNaMoko(callback) {
        this.items.forEach(callback);
    }
    // Filtrer (filter)
    likisa(callback) {
        return new Libuka(this.items.filter(callback));
    }
    // Mapper (map)
    koboma(callback) {
        return new Libuka(this.items.map(callback));
    }
    // Réduire (reduce)
    kosanga(callback, initial) {
        return this.items.reduce(callback, initial);
    }
    toString() {
        return `[${this.items.join(", ")}]`;
    }
}
// Dictionnaire (similaire à Python dict)
export class Diktionere {
    data = new Map();
    constructor(pairs) {
        if (pairs) {
            pairs.forEach(([key, value]) => this.data.set(key, value));
        }
    }
    // Ajouter ou modifier (setitem)
    kota(key, value) {
        this.data.set(key, value);
    }
    // Obtenir une valeur (getitem)
    kozwa(key) {
        return this.data.get(key);
    }
    // Vérifier si la clé existe (contains)
    koyoka(key) {
        return this.data.has(key);
    }
    // Supprimer une clé (del)
    longola(key) {
        return this.data.delete(key);
    }
    // Obtenir toutes les clés (keys)
    bikoki() {
        return Array.from(this.data.keys());
    }
    // Obtenir toutes les valeurs (values)
    baliba() {
        return Array.from(this.data.values());
    }
    // Obtenir les paires clé-valeur (items)
    biloko() {
        return Array.from(this.data.entries());
    }
    // Longueur
    bokoni() {
        return this.data.size;
    }
    // Effacer tout (clear)
    silisa() {
        this.data.clear();
    }
    // Mettre à jour avec un autre dictionnaire (update)
    kobongola(other) {
        other.data.forEach((value, key) => this.data.set(key, value));
    }
    // Obtenir avec valeur par défaut (get)
    kozwaNaDefault(key, defaultValue) {
        return this.data.has(key) ? this.data.get(key) : defaultValue;
    }
    // Parcourir
    mpoNaMokoNaMoko(callback) {
        this.data.forEach(callback);
    }
    toString() {
        const pairs = Array.from(this.data.entries())
            .map(([k, v]) => `"${k}": ${v}`)
            .join(", ");
        return `{${pairs}}`;
    }
}
// Tuple (immuable, similaire à Python tuple)
export class Tupple {
    items;
    constructor(items) {
        this.items = [...items];
        Object.freeze(this.items);
    }
    // Longueur
    bokoni() {
        return this.items.length;
    }
    // Obtenir un élément
    kozwa(index) {
        return this.items[index];
    }
    // Index d'un élément
    index(item) {
        return this.items.indexOf(item);
    }
    // Compter les occurrences
    kobanda(item) {
        return this.items.filter(i => i === item).length;
    }
    // Convertir en liste
    kotaLibuka() {
        return new Libuka(this.items);
    }
    // Slicing
    kotaMokili(start, end) {
        return new Tupple(this.items.slice(start, end));
    }
    toArray() {
        return [...this.items];
    }
    toString() {
        return `(${this.items.join(", ")})`;
    }
}
// Set (ensemble unique, similaire à Python set)
export class Ensemble {
    data = new Set();
    constructor(items) {
        if (items) {
            items.forEach(item => this.data.add(item));
        }
    }
    // Ajouter un élément (add)
    kota(item) {
        this.data.add(item);
    }
    // Supprimer un élément (remove)
    longola(item) {
        return this.data.delete(item);
    }
    // Vérifier si l'élément existe (contains)
    koyoka(item) {
        return this.data.has(item);
    }
    // Longueur
    bokoni() {
        return this.data.size;
    }
    // Effacer tout (clear)
    silisa() {
        this.data.clear();
    }
    // Union avec un autre set
    kosanga(other) {
        const result = new Ensemble();
        this.data.forEach(item => result.data.add(item));
        other.data.forEach(item => result.data.add(item));
        return result;
    }
    // Intersection avec un autre set
    kikita(other) {
        const result = new Ensemble();
        this.data.forEach(item => {
            if (other.data.has(item)) {
                result.data.add(item);
            }
        });
        return result;
    }
    // Différence avec un autre set
    fuka(other) {
        const result = new Ensemble();
        this.data.forEach(item => {
            if (!other.data.has(item)) {
                result.data.add(item);
            }
        });
        return result;
    }
    // Convertir en liste
    kotaLibuka() {
        return new Libuka(Array.from(this.data));
    }
    // Parcourir
    mpoNaMokoNaMoko(callback) {
        this.data.forEach(callback);
    }
    toArray() {
        return Array.from(this.data);
    }
    toString() {
        return `{${Array.from(this.data).join(", ")}}`;
    }
}
