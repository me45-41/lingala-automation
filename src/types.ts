/**
 * Types de données avancés pour LingalaAutomation
 * Inspiré de Python : listes, dictionnaires, tuples, sets
 */

// Liste (similaire à Python list)
export class Libuka {
  private items: any[] = [];

  constructor(items?: any[]) {
    if (items) {
      this.items = [...items];
    }
  }

  // Ajouter un élément (append)
  kota(item: any): void {
    this.items.push(item);
  }

  // Étendre avec une autre liste (extend)
  kokota(other: Libuka): void {
    this.items.push(...other.items);
  }

  // Insérer à un index (insert)
  kokisa(index: number, item: any): void {
    this.items.splice(index, 0, item);
  }

  // Supprimer par valeur (remove)
  longola(item: any): void {
    const index = this.items.indexOf(item);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }

  // Supprimer par index et retourner (pop)
  zonga(index?: number): any {
    if (index === undefined) {
      return this.items.pop();
    }
    const item = this.items[index];
    this.items.splice(index, 1);
    return item;
  }

  // Trier (sort)
  lotemisa(): void {
    this.items.sort();
  }

  // Inverser (reverse)
  kokanzisa(): void {
    this.items.reverse();
  }

  // Longueur
  bokoni(): number {
    return this.items.length;
  }

  // Index d'un élément
  index(item: any): number {
    return this.items.indexOf(item);
  }

  // Compter les occurrences
  kobanda(item: any): number {
    return this.items.filter(i => i === item).length;
  }

  // Obtenir un élément
  kozwa(index: number): any {
    return this.items[index];
  }

  // Slicing (comme Python)
  kotaMokili(start?: number, end?: number): Libuka {
    return new Libuka(this.items.slice(start, end));
  }

  // Convertir en tableau JavaScript
  toArray(): any[] {
    return [...this.items];
  }

  // Parcourir (forEach)
  mpoNaMokoNaMoko(callback: (item: any, index: number) => void): void {
    this.items.forEach(callback);
  }

  // Filtrer (filter)
  likisa(callback: (item: any) => boolean): Libuka {
    return new Libuka(this.items.filter(callback));
  }

  // Mapper (map)
  koboma(callback: (item: any) => any): Libuka {
    return new Libuka(this.items.map(callback));
  }

  // Réduire (reduce)
  kosanga(callback: (acc: any, item: any) => any, initial?: any): any {
    return this.items.reduce(callback, initial);
  }

  toString(): string {
    return `[${this.items.join(", ")}]`;
  }
}

// Dictionnaire (similaire à Python dict)
export class Diktionere {
  private data: Map<string, any> = new Map();

  constructor(pairs?: [string, any][]) {
    if (pairs) {
      pairs.forEach(([key, value]) => this.data.set(key, value));
    }
  }

  // Ajouter ou modifier (setitem)
  kota(key: string, value: any): void {
    this.data.set(key, value);
  }

  // Obtenir une valeur (getitem)
  kozwa(key: string): any {
    return this.data.get(key);
  }

  // Vérifier si la clé existe (contains)
  koyoka(key: string): boolean {
    return this.data.has(key);
  }

  // Supprimer une clé (del)
  longola(key: string): boolean {
    return this.data.delete(key);
  }

  // Obtenir toutes les clés (keys)
  bikoki(): string[] {
    return Array.from(this.data.keys());
  }

  // Obtenir toutes les valeurs (values)
  baliba(): any[] {
    return Array.from(this.data.values());
  }

  // Obtenir les paires clé-valeur (items)
  biloko(): [string, any][] {
    return Array.from(this.data.entries());
  }

  // Longueur
  bokoni(): number {
    return this.data.size;
  }

  // Effacer tout (clear)
  silisa(): void {
    this.data.clear();
  }

  // Mettre à jour avec un autre dictionnaire (update)
  kobongola(other: Diktionere): void {
    other.data.forEach((value, key) => this.data.set(key, value));
  }

  // Obtenir avec valeur par défaut (get)
  kozwaNaDefault(key: string, defaultValue: any): any {
    return this.data.has(key) ? this.data.get(key) : defaultValue;
  }

  // Parcourir
  mpoNaMokoNaMoko(callback: (value: any, key: string) => void): void {
    this.data.forEach(callback);
  }

  toString(): string {
    const pairs = Array.from(this.data.entries())
      .map(([k, v]) => `"${k}": ${v}`)
      .join(", ");
    return `{${pairs}}`;
  }
}

// Tuple (immuable, similaire à Python tuple)
export class Tupple {
  private items: any[];

  constructor(items: any[]) {
    this.items = [...items];
    Object.freeze(this.items);
  }

  // Longueur
  bokoni(): number {
    return this.items.length;
  }

  // Obtenir un élément
  kozwa(index: number): any {
    return this.items[index];
  }

  // Index d'un élément
  index(item: any): number {
    return this.items.indexOf(item);
  }

  // Compter les occurrences
  kobanda(item: any): number {
    return this.items.filter(i => i === item).length;
  }

  // Convertir en liste
  kotaLibuka(): Libuka {
    return new Libuka(this.items);
  }

  // Slicing
  kotaMokili(start?: number, end?: number): Tupple {
    return new Tupple(this.items.slice(start, end));
  }

  toArray(): any[] {
    return [...this.items];
  }

  toString(): string {
    return `(${this.items.join(", ")})`;
  }
}

// Set (ensemble unique, similaire à Python set)
export class Ensemble {
  private data: Set<any> = new Set();

  constructor(items?: any[]) {
    if (items) {
      items.forEach(item => this.data.add(item));
    }
  }

  // Ajouter un élément (add)
  kota(item: any): void {
    this.data.add(item);
  }

  // Supprimer un élément (remove)
  longola(item: any): boolean {
    return this.data.delete(item);
  }

  // Vérifier si l'élément existe (contains)
  koyoka(item: any): boolean {
    return this.data.has(item);
  }

  // Longueur
  bokoni(): number {
    return this.data.size;
  }

  // Effacer tout (clear)
  silisa(): void {
    this.data.clear();
  }

  // Union avec un autre set
  kosanga(other: Ensemble): Ensemble {
    const result = new Ensemble();
    this.data.forEach(item => result.data.add(item));
    other.data.forEach(item => result.data.add(item));
    return result;
  }

  // Intersection avec un autre set
  kikita(other: Ensemble): Ensemble {
    const result = new Ensemble();
    this.data.forEach(item => {
      if (other.data.has(item)) {
        result.data.add(item);
      }
    });
    return result;
  }

  // Différence avec un autre set
  fuka(other: Ensemble): Ensemble {
    const result = new Ensemble();
    this.data.forEach(item => {
      if (!other.data.has(item)) {
        result.data.add(item);
      }
    });
    return result;
  }

  // Convertir en liste
  kotaLibuka(): Libuka {
    return new Libuka(Array.from(this.data));
  }

  // Parcourir
  mpoNaMokoNaMoko(callback: (item: any) => void): void {
    this.data.forEach(callback);
  }

  toArray(): any[] {
    return Array.from(this.data);
  }

  toString(): string {
    return `{${Array.from(this.data).join(", ")}}`;
  }
}
