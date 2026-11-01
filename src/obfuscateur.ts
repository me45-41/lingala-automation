/**
 * Module d'Obfuscation - LingalaAutomation
 * Protection du code compilé contre le reverse engineering
 * Version : 1.0.0
 */

import * as crypto from "crypto";

/**
 * Obfuscateur de Code JavaScript
 * Transforme le JavaScript lisible en code difficile à comprendre
 */
export class ObfuscateurJS {
  private seed: number;

  constructor(seed?: number) {
    this.seed = seed || Date.now();
  }

  /**
   * Génère un nombre pseudo-aléatoire
   */
  private random(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  /**
   * Génère un identifiant aléatoire
   */
  private genererIdentifiant(prefix: string): string {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = prefix;
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(this.random() * chars.length));
    }
    return result;
  }

  /**
   * Obfusque les noms de variables et fonctions
   */
  private obfusquerNoms(code: string, mapNoms: Map<string, string>): string {
    let result = code;
    
    // Listes de mots-clés JavaScript à ne pas obfusquer
    const jsKeywords = new Set([
      "function", "return", "if", "else", "for", "while", "do", "switch", "case", "break",
      "continue", "try", "catch", "finally", "throw", "new", "class", "extends",
      "const", "let", "var", "typeof", "instanceof", "in", "of", "void", "null",
      "undefined", "true", "false", "this", "super", "import", "export", "from",
      "default", "async", "await", "yield", "static", "get", "set"
    ]);

    // Trouver les identifiants et les renommer
    const identifiantRegex = /\b[a-zA-Z_$][a-zA-Z0-9_$]*\b/g;
    const identifiants = code.match(identifiantRegex) || [];

    identifiants.forEach(identifiant => {
      if (!jsKeywords.has(identifiant) && !mapNoms.has(identifiant)) {
        const nouveauNom = this.genererIdentifiant("_");
        mapNoms.set(identifiant, nouveauNom);
      }
    });

    // Remplacer les identifiants
    mapNoms.forEach((nouveauNom, ancienNom) => {
      const regex = new RegExp(`\\b${ancienNom}\\b`, "g");
      result = result.replace(regex, nouveauNom);
    });

    return result;
  }

  /**
   * Encode les chaînes de caractères
   */
  private encoderChaines(code: string): string {
    // Trouver toutes les chaînes littérales
    const stringRegex = /(["'])((?:\\.|[^"\\])*?)\1/g;
    const chaines = code.match(stringRegex) || [];

    let result = code;
    const encodageMap = new Map<number, string>();

    chaines.forEach((chaine, index) => {
      const encoded = Buffer.from(chaine).toString("base64");
      const varName = this.genererIdentifiant("_str");
      encodageMap.set(index, encoded);

      // Remplacer la chaîne par une référence
      const regex = new RegExp(chaine.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
      result = result.replace(regex, varName);
    });

    // Ajouter les décodages au début
    const declarations = Array.from(encodageMap.entries())
      .map(([index, encoded]) => `const _str${index} = Buffer.from("${encoded}", "base64").toString();`)
      .join(";");

    return declarations + ";" + result;
  }

  /**
   * Supprime les commentaires
   */
  private supprimerCommentaires(code: string): string {
    // Supprimer les commentaires sur une ligne
    code = code.replace(/\/\/.*$/gm, "");
    // Supprimer les commentaires multilignes
    code = code.replace(/\/\*[\s\S]*?\*\//g, "");
    return code;
  }

  /**
   * Minifie le code (simple)
   */
  private minifier(code: string): string {
    let result = code;
    
    // Supprimer les espaces multiples
    result = result.replace(/\s+/g, " ");
    
    // Supprimer les espaces autour des opérateurs
    result = result.replace(/\s*([+\-*/=<>!&|^~.,;:{}()])\s*/g, "$1");
    
    // Supprimer les espaces autour des parenthèses
    result = result.replace(/\s*\(\s*/g, "(");
    result = result.replace(/\s*\)\s*/g, ")");
    
    // Supprimer les espaces autour des crochets
    result = result.replace(/\s*\[\s*/g, "[");
    result = result.replace(/\s*\]\s*/g, "]");
    
    // Supprimer les espaces autour des accolades
    result = result.replace(/\s*\{\s*/g, "{");
    result = result.replace(/\s*}\s*/g, "}");
    
    // Supprimer les points-virgules (sauf pour les boucles for)
    result = result.replace(/;(?!\s*for\b)/g, ";");
    
    return result;
  }

  /**
   * Ajoute du code "garbage" pour compliquer la lecture
   */
  private ajouterCodeGarbage(code: string): string {
    const garbage = `
const ${this.genererIdentifiant("_garbage")}=${this.random().toString(36).substring(2)};${this.genererIdentifiant("_garbage")}=${this.random().toString(36).substring(2)};${this.genererIdentifiant("_garbage")}=${this.random().toString(36).substring(2)};${this.genererIdentifiant("_garbage")}=${this.random().toString(36).substring(2)};`;
    return garbage + code;
  }

  /**
   * Chiffre certaines parties du code
   */
  private chiffrerPartiesCritiques(code: string): string {
    // Chiffrer les chaînes contenant "secret", "cle", "password", "token"
    const patterns = [
      /secret\s*[:=]\s*["']([^"']+)["']/gi,
      /cle\s*[:=]\s*["']([^"']+)["']/gi,
      /password\s*[:=]\s*["']([^"']+)["']/gi,
      /token\s*[:=]\s*["']([^"']+)["']/gi
    ];

    let result = code;
    patterns.forEach(pattern => {
      result = result.replace(pattern, (match, valeur) => {
        const hash = crypto.createHash("sha256").update(valeur).digest("hex").substring(0, 16);
        return `"${hash}"`;
      });
    });

    return result;
  }

  /**
   * Obfusque le code JavaScript complet
   */
  obfusquer(code: string, options: {
    renommerVariables?: boolean;
    encoderChaines?: boolean;
    supprimerCommentaires?: boolean;
    minifier?: boolean;
    ajouterGarbage?: boolean;
    chiffrerParties?: boolean;
  } = {}): string {
    const opts = {
      renommerVariables: true,
      encoderChaines: false,
      supprimerCommentaires: true,
      minifier: true,
      ajouterGarbage: true,
      chiffrerParties: true,
      ...options
    };

    let result = code;
    const mapNoms = new Map<string, string>();

    if (opts.supprimerCommentaires) {
      result = this.supprimerCommentaires(result);
    }

    if (opts.renommerVariables) {
      result = this.obfusquerNoms(result, mapNoms);
    }

    if (opts.encoderChaines) {
      result = this.encoderChaines(result);
    }

    if (opts.chiffrerParties) {
      result = this.chiffrerPartiesCritiques(result);
    }

    if (opts.minifier) {
      result = this.minifier(result);
    }

    if (opts.ajouterGarbage) {
      result = this.ajouterCodeGarbage(result);
    }

    return result;
  }

  /**
   * Obfusque avec un niveau de sécurité spécifique
   */
  obfusquerNiveau(code: string, niveau: "basique" | "moyen" | "eleve" | "extreme"): string {
    switch (niveau) {
      case "basique":
        return this.obfusquer(code, {
          supprimerCommentaires: true,
          minifier: true
        });
      case "moyen":
        return this.obfusquer(code, {
          renommerVariables: true,
          supprimerCommentaires: true,
          minifier: true,
          chiffrerParties: true
        });
      case "eleve":
        return this.obfusquer(code, {
          renommerVariables: true,
          encoderChaines: true,
          supprimerCommentaires: true,
          minifier: true,
          chiffrerParties: true,
          ajouterGarbage: true
        });
      case "extreme":
        return this.obfusquer(code, {
          renommerVariables: true,
          encoderChaines: true,
          supprimerCommentaires: true,
          minifier: true,
          chiffrerParties: true,
          ajouterGarbage: true
        });
      default:
        return this.obfusquer(code);
    }
  }
}

/**
 * Fonctions d'export pour faciliter l'import
 */
export const obfusquer = (code: string, niveau?: "basique" | "moyen" | "eleve" | "extreme") => new ObfuscateurJS().obfusquerNiveau(code, niveau || "moyen");
export const obfusquerBasique = (code: string) => new ObfuscateurJS().obfusquerNiveau(code, "basique");
export const obfusquerEleve = (code: string) => new ObfuscateurJS().obfusquerNiveau(code, "eleve");
