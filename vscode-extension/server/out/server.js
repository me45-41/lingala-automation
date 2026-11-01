"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("vscode-languageserver/node");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
// Créer une connexion pour le serveur LSP
const connection = (0, node_1.createConnection)(node_1.ProposedFeatures.all);
// Créer un gestionnaire de documents texte
const documents = new node_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
// Mots-clés Lingala pour l'autocomplétion
const LINGALA_KEYWORDS = [
    // Variables et données
    'tanga', 'elobi', 'ok', 'te', 'mboka',
    // Structures de contrôle
    'soki', 'susa', 'tantike', 'mpo na moko na moko', 'banda',
    // Fonctions
    'mosala', 'zonga',
    // Classes
    'klasi', 'mbotaka', 'bika',
    // Exceptions
    'essayer', 'kanga', 'misusu', 'sangisa',
    // Modules
    'kokota', 'salisa', 'sangisa', 'depuis',
    // Opérations fichiers
    'kosala', 'luka', 'longola', 'kokisa', 'sukisa', 'bongoliKombo',
    // Opérations dossiers
    'botia', 'kokomisa', 'koyoka',
    // Système
    'salisa', 'kozinga', 'mbula', 'makomi',
    // Types de données
    'libuka', 'diktionere', 'tupple', 'ensemble',
    // Crypto-Armee (nouveau)
    'crypterAES', 'decrypterAES', 'crypterRSA', 'decrypterRSA', 'genererHash', 'verifierHash', 'signer', 'verifierSignature', 'genererCleAleatoire', 'genererMotDePasse', 'echangeClesDiffieHellman',
    // Auth-Armee (nouveau)
    'verifierMFA', 'genererOTP', 'definirRole', 'verifierPermission', 'genererCertificat', 'verifierCertificat', 'stockerCle', 'recupererCle', 'enregistrerUtilisateur', 'authentifier',
    // Intel-Armee (nouveau)
    'enregistrerEvenement', 'analyserEvenements', 'detecterAnomalies', 'analyserMenaces', 'verifierMetriques', 'genererRapportSecurite'
];
// Documentation des mots-clés
const KEYWORD_DOCUMENTATION = {
    'tanga': 'Déclarer une variable\n```lingala\ntanga x = valeur\n```',
    'elobi': 'Afficher dans la console\n```lingala\nelobi "Bonjour"\n```',
    'ok': 'Vrai (boolean true)',
    'te': 'Faux (boolean false)',
    'soki': 'Condition si\n```lingala\nsoki condition banda\n  // code\n}\n```',
    'susa': 'Fermer un bloc',
    'tantike': 'Boucle tant que\n```lingala\ntantike condition banda\n  // code\n}\n```',
    'mpo na moko na moko': 'Pour chaque (boucle for)\n```lingala\nmpo na moko na moko(liste) banda\n  // code\n}\n```',
    'mosala': 'Déclarer une fonction\n```lingala\nmosala nom() banda\n  // code\n}\n```',
    'zonga': 'Retourner une valeur\n```lingala\nzonga valeur\n```',
    'klasi': 'Déclarer une classe\n```lingala\nklasi Nom banda\n  // code\n}\n```',
    'mbotaka': 'Constructeur de classe',
    'bika': 'Héritage de classe',
    'essayer': 'Bloc try\n```lingala\nessayer banda\n  // code\n}\n```',
    'kanga': 'Bloc catch\n```lingala\nkanga erreur banda\n  // code\n}\n```',
    'misusu': 'Bloc finally\n```lingala\nmisusu banda\n  // code\n}\n```',
    'sangisa': 'Lancer une exception\n```lingala\nsangisa("Erreur")\n```',
    'kokota': 'Importer un module\n```lingala\nkokota {nom} na "./module.lingala"\n```',
    'salisa': 'Exporter une fonction/classe ou exécuter une commande système\n```lingala\nsalisa mosala nom\nsalisa(commande)\n```',
    'kosala': 'Créer un fichier\n```lingala\nkosala(chemin, contenu)\n```',
    'luka': 'Lire un fichier\n```lingala\nluka(chemin)\n```',
    'longola': 'Supprimer un fichier',
    'kokisa': 'Copier un fichier',
    'sukisa': 'Déplacer un fichier',
    'bongoliKombo': 'Renommer un fichier',
    'botia': 'Créer un dossier',
    'kokomisa': 'Lister les fichiers d\'un dossier',
    'koyoka': 'Vérifier si un fichier existe',
    'kozinga': 'Attendre (pause)',
    'mbula': 'Obtenir la date/heure actuelle',
    'makomi': 'Obtenir les infos d\'un fichier',
    'libuka': 'Liste (similaire à Python list)',
    'diktionere': 'Dictionnaire (similaire à Python dict)',
    'tupple': 'Tuple immuable',
    'ensemble': 'Ensemble unique',
    // Crypto-Armee
    'crypterAES': 'Chiffrement AES-256 (sangisa depuis "crypto-armee")',
    'decrypterAES': 'Déchiffrement AES-256 (sangisa depuis "crypto-armee")',
    'crypterRSA': 'Chiffrement RSA-4096 (sangisa depuis "crypto-armee")',
    'decrypterRSA': 'Déchiffrement RSA-4096 (sangisa depuis "crypto-armee")',
    'genererHash': 'Générer hash SHA-256/512 (sangisa depuis "crypto-armee")',
    'verifierHash': 'Vérifier hash (sangisa depuis "crypto-armee")',
    'signer': 'Signer numériquement (sangisa depuis "crypto-armee")',
    'verifierSignature': 'Vérifier signature (sangisa depuis "crypto-armee")',
    'genererCleAleatoire': 'Générer clé aléatoire sécurisée (sangisa depuis "crypto-armee")',
    'genererMotDePasse': 'Générer mot de passe sécurisé (sangisa depuis "crypto-armee")',
    'echangeClesDiffieHellman': 'Échange de clés Diffie-Hellman (sangisa depuis "crypto-armee")',
    // Auth-Armee
    'verifierMFA': 'Vérifier authentification multifacteur (sangisa depuis "auth-armee")',
    'genererOTP': 'Générer code OTP (sangisa depuis "auth-armee")',
    'definirRole': 'Définir rôle RBAC (sangisa depuis "auth-armee")',
    'verifierPermission': 'Vérifier permission (sangisa depuis "auth-armee")',
    'genererCertificat': 'Générer certificat X.509 (sangisa depuis "auth-armee")',
    'verifierCertificat': 'Vérifier certificat (sangisa depuis "auth-armee")',
    'stockerCle': 'Stocker clé dans vault (sangisa depuis "auth-armee")',
    'recupererCle': 'Récupérer clé du vault (sangisa depuis "auth-armee")',
    'enregistrerUtilisateur': 'Enregistrer utilisateur (sangisa depuis "auth-armee")',
    'authentifier': 'Authentifier utilisateur (sangisa depuis "auth-armee")',
    // Intel-Armee
    'enregistrerEvenement': 'Enregistrer événement de sécurité (sangisa depuis "intel-armee")',
    'analyserEvenements': 'Analyser événements (sangisa depuis "intel-armee")',
    'detecterAnomalies': 'Détecter anomalies (sangisa depuis "intel-armee")',
    'analyserMenaces': 'Analyser menaces (sangisa depuis "intel-armee")',
    'verifierMetriques': 'Vérifier métriques système (sangisa depuis "intel-armee")',
    'genererRapportSecurite': 'Générer rapport de sécurité (sangisa depuis "intel-armee")'
};
connection.onInitialize((params) => {
    const capabilities = params.capabilities;
    hasConfigurationCapability = !!(capabilities.workspace && !!capabilities.workspace.configuration);
    hasWorkspaceFolderCapability = !!(capabilities.workspace && !!capabilities.workspace.workspaceFolders);
    const result = {
        capabilities: {
            textDocumentSync: node_1.TextDocumentSyncKind.Incremental,
            completionProvider: {
                resolveProvider: true
            },
            hoverProvider: true
        }
    };
    return result;
});
// Gestionnaire d'autocomplétion
connection.onCompletion((_textDocumentPosition) => {
    const completions = [];
    // Ajouter les mots-clés
    for (const keyword of LINGALA_KEYWORDS) {
        completions.push({
            label: keyword,
            kind: node_1.CompletionItemKind.Keyword,
            detail: 'Mot-clé Lingala',
            documentation: KEYWORD_DOCUMENTATION[keyword] || 'Mot-clé Lingala'
        });
    }
    return completions;
});
// Résolution d'autocomplétion (pour plus de détails)
connection.onCompletionResolve((item) => {
    if (!item.detail) {
        item.detail = 'Mot-clé Lingala';
    }
    return item;
});
// Gestionnaire de hover (documentation au survol)
connection.onHover((textDocumentPosition) => {
    const document = documents.get(textDocumentPosition.textDocument.uri);
    if (!document) {
        return null;
    }
    const text = document.getText();
    const offset = document.offsetAt(textDocumentPosition.position);
    const word = getWordAtPosition(text, offset);
    if (word && KEYWORD_DOCUMENTATION[word]) {
        return {
            contents: {
                kind: node_1.MarkupKind.Markdown,
                value: KEYWORD_DOCUMENTATION[word]
            }
        };
    }
    return null;
});
// Fonction utilitaire pour obtenir le mot à une position
function getWordAtPosition(text, offset) {
    const wordPattern = /[a-zA-Z_$0-9]+/g;
    let match;
    const matches = [];
    while ((match = wordPattern.exec(text)) !== null) {
        matches.push({
            start: match.index,
            end: match.index + match[0].length,
            word: match[0]
        });
    }
    for (const m of matches) {
        if (offset >= m.start && offset <= m.end) {
            return m.word;
        }
    }
    return null;
}
// Écouter les changements de documents
documents.onDidChangeContent(change => {
    // Valider le document si nécessaire
});
// Rendre le serveur LSP actif
documents.listen(connection);
connection.listen();
//# sourceMappingURL=server.js.map