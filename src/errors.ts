export class LingalaAutomationError extends Error {
  constructor(message: string, public readonly line?: number) {
    const detail = line !== undefined
      ? `Erreur LingalaAutomation ligne ${line} : ${message}`
      : `Erreur LingalaAutomation : ${message}`;

    super(detail);
    this.name = "LingalaAutomationError";
  }
}

// Classe d'exception personnalisée pour les utilisateurs
export class Faute extends Error {
  constructor(
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = "Faute";
  }
}

// Fonction pour lancer une exception personnalisée
export function sangisa(message: string, code?: string): never {
  throw new Faute(message, code);
}
