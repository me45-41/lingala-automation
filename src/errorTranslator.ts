/**
 * Traducteur d'erreurs JavaScript vers Lingala
 */
export class ErrorTranslator {
  private translations: Map<string, string> = new Map();

  constructor() {
    this.initializeTranslations();
  }

  private initializeTranslations(): void {
    // Erreurs de syntaxe
    this.translations.set("SyntaxError", "Erreur de syntaxe");
    this.translations.set("Unexpected token", "Jeton inattendu");
    this.translations.set("Unexpected identifier", "Identifiant inattendu");
    this.translations.set("Unexpected end of input", "Fin d'entrée inattendue");
    this.translations.set("Missing ) after argument list", "Parenthèse fermante manquante après la liste d'arguments");
    this.translations.set("Missing : after condition", "Deux-points manquant après la condition");
    this.translations.set("Unexpected string", "Chaîne inattendue");
    this.translations.set("Unexpected number", "Nombre inattendu");
    this.translations.set("Invalid regular expression", "Expression régulière invalide");

    // Erreurs de référence
    this.translations.set("ReferenceError", "Erreur de référence");
    this.translations.set("is not defined", "n'est pas défini");
    this.translations.set("Cannot access", "Impossible d'accéder à");
    this.translations.set("before initialization", "avant l'initialisation");

    // Erreurs de type
    this.translations.set("TypeError", "Erreur de type");
    this.translations.set("is not a function", "n'est pas une fonction");
    this.translations.set("is not a constructor", "n'est pas un constructeur");
    this.translations.set("Cannot read property", "Impossible de lire la propriété");
    this.translations.set("of undefined", "de undefined");
    this.translations.set("of null", "de null");
    this.translations.set("Cannot set property", "Impossible de définir la propriété");
    this.translations.set("is not iterable", "n'est pas itérable");
    this.translations.set("argument must be a string", "l'argument doit être une chaîne");
    this.translations.set("argument must be a number", "l'argument doit être un nombre");

    // Erreurs de plage
    this.translations.set("RangeError", "Erreur de plage");
    this.translations.set("Invalid array length", "Longueur de tableau invalide");
    this.translations.set("Maximum call stack size exceeded", "Taille maximale de la pile d'appels dépassée");
    this.translations.set("Precision is out of range", "La précision est hors plage");
    this.translations.set("To number must be positive", "Le nombre doit être positif");

    // Erreurs d'URI
    this.translations.set("URIError", "Erreur d'URI");
    this.translations.set("URI malformed", "URI malformé");
    this.translations.set("URI component", "Composant d'URI");

    // Erreurs d'évaluation
    this.translations.set("EvalError", "Erreur d'évaluation");

    // Erreurs courantes
    this.translations.set("Cannot find module", "Module introuvable");
    this.translations.set("Module not found", "Module non trouvé");
    this.translations.set("ENOENT", "Fichier ou dossier introuvable");
    this.translations.set("EACCES", "Permission refusée");
    this.translations.set("EEXIST", "Fichier ou dossier existe déjà");
    this.translations.set("ENOSPC", "Espace disque insuffisant");
    this.translations.set("EISDIR", "Est un dossier");
    this.translations.set("ENOTDIR", "N'est pas un dossier");
    this.translations.set("EPIPE", "Broken pipe");

    // Messages d'erreur spécifiques
    this.translations.set("Network request failed", "Échec de la requête réseau");
    this.translations.set("Connection refused", "Connexion refusée");
    this.translations.set("Connection timeout", "Délai de connexion dépassé");
    this.translations.set("Host not found", "Hôte introuvable");
    this.translations.set("SSL/TLS handshake failed", "Échec de la négociation SSL/TLS");
  }

  /**
   * Traduit un message d'erreur JavaScript vers Lingala
   */
  translate(errorMessage: string): string {
    let translated = errorMessage;

    // Traduire les types d'erreurs
    for (const [english, lingala] of this.translations.entries()) {
      const regex = new RegExp(english, "g");
      translated = translated.replace(regex, lingala);
    }

    return translated;
  }

  /**
   * Traduit un type d'erreur
   */
  translateErrorType(errorType: string): string {
    return this.translations.get(errorType) || errorType;
  }

  /**
   * Formate une erreur complète avec traduction
   */
  formatError(error: Error): string {
    const translatedType = this.translateErrorType(error.name);
    const translatedMessage = this.translate(error.message);
    
    return `${translatedType}: ${translatedMessage}`;
  }

  /**
   * Ajoute une traduction personnalisée
   */
  addTranslation(english: string, lingala: string): void {
    this.translations.set(english, lingala);
  }

  /**
   * Ajoute plusieurs traductions personnalisées
   */
  addTranslations(translations: Record<string, string>): void {
    for (const [english, lingala] of Object.entries(translations)) {
      this.translations.set(english, lingala);
    }
  }
}
