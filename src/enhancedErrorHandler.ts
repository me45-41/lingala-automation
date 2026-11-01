import { LingalaAutomationError } from "./errors.js";
import { SourceMapManager } from "./sourceMap.js";
import { ErrorTranslator } from "./errorTranslator.js";

/**
 * Gestionnaire d'erreurs amélioré avec stack traces lisibles en Lingala
 */
export class EnhancedErrorHandler {
  private sourceMapManager: SourceMapManager;
  private errorTranslator: ErrorTranslator;

  constructor() {
    this.sourceMapManager = new SourceMapManager();
    this.errorTranslator = new ErrorTranslator();
  }

  /**
   * Initialise le mapping source pour un fichier
   */
  initializeSourceMap(lingalaFile: string, jsFile: string): void {
    this.sourceMapManager.generateMapping(lingalaFile, jsFile);
  }

  /**
   * Charge les mappings depuis un fichier
   */
  loadSourceMaps(mapFile: string): void {
    this.sourceMapManager.loadMappings(mapFile);
  }

  /**
   * Sauvegarde les mappings dans un fichier
   */
  saveSourceMaps(mapFile: string): void {
    this.sourceMapManager.saveMappings(mapFile);
  }

  /**
   * Formate une erreur avec stack trace traduite et mappée
   */
  formatError(error: Error, lingalaFile?: string): string {
    // Traduire le type et le message d'erreur
    const formattedHeader = this.errorTranslator.formatError(error);

    let output = formattedHeader;

    // Si l'erreur a une stack trace, la convertir
    if (error.stack) {
      const convertedStack = this.sourceMapManager.convertStackTrace(error.stack);
      output += "\n" + convertedStack;
    }

    // Ajouter le fichier source si disponible
    if (lingalaFile) {
      output += `\n\nFichier source : ${lingalaFile}`;
    }

    return output;
  }

  /**
   * Crée une erreur LingalaAutomation avec stack trace améliorée
   */
  createLingalaError(
    message: string,
    line?: number,
    lingalaFile?: string
  ): LingalaAutomationError {
    const translatedMessage = this.errorTranslator.translate(message);
    const error = new LingalaAutomationError(translatedMessage, line);
    
    // Si un fichier source est fourni, initialiser le mapping
    if (lingalaFile) {
      const jsFile = lingalaFile.replace(/\.lingala$/, ".js");
      this.initializeSourceMap(lingalaFile, jsFile);
    }

    return error;
  }

  /**
   * Attrape et formate une erreur JavaScript
   */
  catchAndFormat(error: unknown, lingalaFile?: string): string {
    if (error instanceof Error) {
      return this.formatError(error, lingalaFile);
    } else if (typeof error === "string") {
      return this.errorTranslator.translate(error);
    } else {
      return this.errorTranslator.translate(String(error));
    }
  }

  /**
   * Enregistre un gestionnaire d'erreurs global
   */
  registerGlobalErrorHandler(lingalaFile?: string): void {
    process.on("uncaughtException", (error) => {
      console.error(this.catchAndFormat(error, lingalaFile));
      process.exit(1);
    });

    process.on("unhandledRejection", (reason) => {
      console.error(this.catchAndFormat(reason, lingalaFile));
      process.exit(1);
    });
  }

  /**
   * Traduit un message d'erreur
   */
  translate(message: string): string {
    return this.errorTranslator.translate(message);
  }

  /**
   * Ajoute une traduction personnalisée
   */
  addTranslation(english: string, lingala: string): void {
    this.errorTranslator.addTranslation(english, lingala);
  }
}
