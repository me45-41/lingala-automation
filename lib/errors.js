export class LingalaAutomationError extends Error {
    line;
    constructor(message, line) {
        const detail = line !== undefined
            ? `Erreur LingalaAutomation ligne ${line} : ${message}`
            : `Erreur LingalaAutomation : ${message}`;
        super(detail);
        this.line = line;
        this.name = "LingalaAutomationError";
    }
}
// Classe d'exception personnalisée pour les utilisateurs
export class Faute extends Error {
    message;
    code;
    constructor(message, code) {
        super(message);
        this.message = message;
        this.code = code;
        this.name = "Faute";
    }
}
// Fonction pour lancer une exception personnalisée
export function sangisa(message, code) {
    throw new Faute(message, code);
}
