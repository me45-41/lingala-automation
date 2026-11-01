import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";

/**
 * Gestionnaire de cache pour la compilation
 * Évite de recompiler les fichiers qui n'ont pas changé
 */
export class CompilationCache {
  private cacheDir: string;
  private cacheFile: string;

  constructor(cacheDir: string = ".lingala-cache") {
    this.cacheDir = path.resolve(cacheDir);
    this.cacheFile = path.join(this.cacheDir, "cache.json");
    this.ensureCacheDir();
  }

  private ensureCacheDir(): void {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  /**
   * Génère un hash du contenu d'un fichier
   */
  private getFileHash(filePath: string): string {
    const content = fs.readFileSync(filePath, "utf8");
    return crypto.createHash("md5").update(content).digest("hex");
  }

  /**
   * Charge le cache depuis le disque
   */
  private loadCache(): Map<string, { hash: string; outputPath: string; timestamp: number }> {
    if (!fs.existsSync(this.cacheFile)) {
      return new Map();
    }

    try {
      const content = fs.readFileSync(this.cacheFile, "utf8");
      const data = JSON.parse(content);
      return new Map(Object.entries(data));
    } catch {
      return new Map();
    }
  }

  /**
   * Sauvegarde le cache sur le disque
   */
  private saveCache(cache: Map<string, { hash: string; outputPath: string; timestamp: number }>): void {
    const data = Object.fromEntries(cache);
    fs.writeFileSync(this.cacheFile, JSON.stringify(data, null, 2), "utf8");
  }

  /**
   * Vérifie si le fichier est dans le cache et n'a pas changé
   */
  isCached(filePath: string): boolean {
    const cache = this.loadCache();
    const entry = cache.get(filePath);

    if (!entry) {
      return false;
    }

    const currentHash = this.getFileHash(filePath);
    return entry.hash === currentHash && fs.existsSync(entry.outputPath);
  }

  /**
   * Récupère le fichier compilé depuis le cache
   */
  getCached(filePath: string): string | null {
    const cache = this.loadCache();
    const entry = cache.get(filePath);

    if (!entry || !this.isCached(filePath)) {
      return null;
    }

    return entry.outputPath;
  }

  /**
   * Ajoute un fichier au cache
   */
  addToCache(filePath: string, outputPath: string): void {
    const cache = this.loadCache();
    const hash = this.getFileHash(filePath);
    
    cache.set(filePath, {
      hash,
      outputPath,
      timestamp: Date.now()
    });

    this.saveCache(cache);
  }

  /**
   * Invalide le cache pour un fichier spécifique
   */
  invalidate(filePath: string): void {
    const cache = this.loadCache();
    cache.delete(filePath);
    this.saveCache(cache);
  }

  /**
   * Vide tout le cache
   */
  clear(): void {
    if (fs.existsSync(this.cacheFile)) {
      fs.unlinkSync(this.cacheFile);
    }
  }

  /**
   * Nettoie les entrées de cache obsolètes (plus de 30 jours)
   */
  cleanup(maxAge: number = 30 * 24 * 60 * 60 * 1000): void {
    const cache = this.loadCache();
    const now = Date.now();
    let cleaned = 0;

    for (const [filePath, entry] of cache.entries()) {
      if (now - entry.timestamp > maxAge) {
        cache.delete(filePath);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      this.saveCache(cache);
      console.log(`Cache nettoyé : ${cleaned} entrées obsolètes supprimées`);
    }
  }

  /**
   * Affiche les statistiques du cache
   */
  stats(): void {
    const cache = this.loadCache();
    console.log(`Cache : ${cache.size} fichiers mis en cache`);
    
    if (cache.size > 0) {
      const now = Date.now();
      let totalSize = 0;
      let recentCount = 0;

      for (const entry of cache.values()) {
        if (fs.existsSync(entry.outputPath)) {
          totalSize += fs.statSync(entry.outputPath).size;
        }
        if (now - entry.timestamp < 7 * 24 * 60 * 60 * 1000) {
          recentCount++;
        }
      }

      console.log(`Taille totale : ${(totalSize / 1024).toFixed(2)} KB`);
      console.log(`Entrées récentes (< 7 jours) : ${recentCount}`);
    }
  }
}
