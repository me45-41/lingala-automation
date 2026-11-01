# Language Server Protocol (LSP) pour LingalaAutomation

## 📋 Vue d'ensemble

LingalaAutomation dispose maintenant d'un véritable **Language Server Protocol (LSP)** qui fournit :
- ✅ **Autocomplétion intelligente** des mots-clés Lingala
- ✅ **Documentation au survol** (hover) pour chaque mot-clé
- ✅ **Support complet** dans VS Code via l'extension

## 🚀 Installation

### 1. Compiler le serveur LSP

```bash
cd vscode-extension/server
npm install
npm run compile
```

### 2. Compiler l'extension VS Code

```bash
cd vscode-extension
npm install
npm run compile:extension
npm run compile:server
```

### 3. Empaqueter l'extension

```bash
npm run package
```

Cela générera `lingala-automation-1.0.0.vsix` dans le dossier `vscode-extension/`.

### 4. Installer l'extension dans VS Code

```bash
code --install-extension lingala-automation-1.0.0.vsix
```

Ou manuellement :
1. Ouvrir VS Code
2. Aller dans Extensions (Ctrl+Shift+X)
3. Cliquer sur "..." → "Install from VSIX..."
4. Sélectionner `lingala-automation-1.0.0.vsix`

## 🎯 Fonctionnalités LSP

### Autocomplétion

Appuyez sur `Ctrl+Space` dans un fichier `.lingala` pour voir la liste des mots-clés disponibles :

**Mots-clés supportés :**
- **Variables et données** : `tanga`, `elobi`, `ok`, `te`
- **Structures de contrôle** : `soki`, `susa`, `tantike`, `mpo na moko na moko`
- **Fonctions** : `mosala`, `zonga`
- **Classes** : `klasi`, `mbotaka`, `bika`
- **Exceptions** : `essayer`, `kanga`, `misusu`, `sangisa`
- **Modules** : `kokota`, `salisa`
- **Opérations fichiers** : `kosala`, `luka`, `longola`, `kokisa`, `sukisa`, `bongoliKombo`
- **Opérations dossiers** : `botia`, `kokomisa`, `koyoka`
- **Système** : `salisa`, `kozinga`, `mbula`, `makomi`
- **Types de données** : `libuka`, `diktionere`, `tupple`, `ensemble`

### Documentation au survol (Hover)

Survolez n'importe quel mot-clé avec la souris pour voir sa documentation :

```lingala
tanga  # Survolez "tanga" pour voir la documentation
```

La documentation s'affiche avec :
- Description du mot-clé
- Exemple d'utilisation en code Lingala
- Format Markdown pour une lisibilité optimale

## 📁 Structure du LSP

```
vscode-extension/
├── server/
│   ├── src/
│   │   └── server.ts          # Serveur LSP principal
│   ├── out/
│   │   └── server.js          # Serveur compilé
│   ├── package.json
│   └── tsconfig.json
├── src/
│   └── extension.ts           # Client LSP (extension VS Code)
├── out/
│   └── extension.js           # Extension compilée
├── syntaxes/
│   └── lingala.tmLanguage.json
├── language-configuration.json
└── package.json
```

## 🔧 Architecture

### Serveur LSP (`server/src/server.ts`)

Le serveur LSP implémente :
- **CompletionProvider** : Fournit les suggestions d'autocomplétion
- **HoverProvider** : Fournit la documentation au survol
- **TextDocumentSync** : Synchronisation des documents

### Client LSP (`src/extension.ts`)

L'extension VS Code agit comme client LSP :
- Démarre le serveur LSP
- Communique via IPC (Inter-Process Communication)
- Gère le cycle de vie du serveur

## 🎨 Personnalisation

### Ajouter de nouveaux mots-clés

Pour ajouter un nouveau mot-clé à l'autocomplétion :

1. Éditer `server/src/server.ts`
2. Ajouter le mot-clé dans `LINGALA_KEYWORDS` :
```typescript
const LINGALA_KEYWORDS = [
  // ... mots-clés existants
  'nouveau_mot'
];
```

3. Ajouter la documentation dans `KEYWORD_DOCUMENTATION` :
```typescript
const KEYWORD_DOCUMENTATION: Record<string, string> = {
  // ... documentation existante
  'nouveau_mot': 'Description du nouveau mot-clé\n```lingala\nnouveau_mot\n```'
};
```

4. Recompiler le serveur :
```bash
cd server
npm run compile
```

## 🐛 Débogage

### Déboguer le serveur LSP

Le serveur LSP écoute sur le port 6009 en mode debug :

```bash
# Dans VS Code, créer un launch configuration :
{
  "type": "node",
  "request": "attach",
  "name": "Attach to Server",
  "port": 6009
}
```

### Voir les logs du serveur

Les logs du serveur LSP apparaissent dans la console "Output" de VS Code :
1. Ouvrir View → Output
2. Sélectionner "LingalaAutomation Language Server" dans le menu déroulant

## 📊 Prochaines améliorations

Fonctionnalités LSP à ajouter :

1. **Diagnostic d'erreurs** : Détection d'erreurs de syntaxe en temps réel
2. **Go to Definition** : Navigation vers les définitions de fonctions/classes
3. **Find References** : Trouver toutes les références d'un symbole
4. **Rename Symbol** : Renommer des variables/fonctions automatiquement
5. **Code Formatting** : Formatage automatique du code Lingala
6. **Semantic Highlighting** : Coloration sémantique avancée
7. **Signature Help** : Aide pour les paramètres de fonctions

## 🌍 Avantages du LSP

**Pourquoi un véritable LSP ?**

- ✅ **Séparation des responsabilités** : Le serveur LSP est indépendant de VS Code
- ✅ **Réutilisabilité** : Le même serveur peut être utilisé dans d'autres éditeurs (Vim, Emacs, etc.)
- ✅ **Performance** : Communication optimisée entre client et serveur
- ✅ **Extensibilité** : Facile d'ajouter de nouvelles fonctionnalités LSP
- ✅ **Standard** : Utilise le protocole standard de l'industrie

## 📚 Ressources

- [Language Server Protocol Specification](https://microsoft.github.io/language-server-protocol/)
- [VS Code Extension API](https://code.visualstudio.com/api)
- [vscode-languageclient](https://github.com/microsoft/vscode-languageserver-node)

---

**LingalaAutomation - LSP et autocomplétion intelligente** 🚀🇨🇩
