# Débogueur LingalaAutomation

## 📋 Vue d'ensemble

LingalaAutomation dispose maintenant d'un **Debug Adapter** complet qui permet de déboguer directement les fichiers `.lingala` dans VS Code !

## 🚀 Installation

### 1. Compiler le débogueur

```bash
cd vscode-extension/debugger
npm install
npm run compile
```

### 2. Compiler l'extension complète

```bash
cd vscode-extension
npm run compile:debugger
```

### 3. Empaqueter l'extension

```bash
npm run package
```

### 4. Installer l'extension

```bash
code --install-extension lingala-automation-1.0.0.vsix
```

## 🎯 Utilisation du Débogueur

### Créer une configuration de débogage

Dans VS Code, créer un fichier `.vscode/launch.json` dans votre projet :

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "lingala",
      "request": "launch",
      "name": "Déboguer LingalaAutomation",
      "program": "${workspaceFolder}/scripts/mon-script.lingala",
      "noDebug": false,
      "runtime": "node",
      "cwd": "${workspaceFolder}"
    }
  ]
}
```

### Lancer le débogage

1. Ouvrir un fichier `.lingala`
2. Appuyer sur `F5` ou cliquer sur "Run and Debug"
3. Sélectionner "Déboguer LingalaAutomation"

Le débogueur va :
- ✅ Compiler automatiquement le fichier `.lingala` en JavaScript
- ✅ Copier les modules runtime nécessaires
- ✅ Lancer le programme avec Node.js en mode débogage
- ✅ Permettre de définir des breakpoints
- ✅ Afficher la sortie dans la console de débogage

## 🔧 Fonctionnalités du Débogueur

### Compilation automatique

Le débogueur compile automatiquement le fichier `.lingala` en JavaScript avant l'exécution :
- Utilise le compilateur AST
- Génère le fichier `.js` dans le même dossier
- Copie tous les modules runtime nécessaires

### Points d'arrêt (Breakpoints)

- Cliquez dans la marge gauche pour ajouter un breakpoint
- Les breakpoints sont placés sur les lignes du fichier `.lingala`
- Le débogueur mappe les lignes vers le JavaScript généré

### Sortie (Output)

La sortie du programme s'affiche dans :
- La console de débogage de VS Code
- Le terminal "Debug Console"

### Variables

Les variables locales sont affichées dans le panneau "Variables" :
- Variables locales de la fonction actuelle
- Variables globales
- Variables de scope

### Stack Trace

La pile d'appel (stack trace) est affichée dans le panneau "Call Stack"

## 📁 Structure du Débogueur

```
vscode-extension/
├── debugger/
│   ├── src/
│   │   └── debugAdapter.ts      # Adaptateur de débogage principal
│   ├── out/
│   │   └── debugAdapter.js      # Débogueur compilé
│   ├── package.json
│   └── tsconfig.json
├── src/
│   └── extension.ts             # Extension VS Code (client)
└── package.json                 # Configuration avec debuggers
```

## 🎨 Configuration

### Options de lancement

| Option | Type | Description | Défaut |
|--------|------|-------------|---------|
| `program` | string | Fichier .lingala à déboguer | Requis |
| `noDebug` | boolean | Lancer sans débogage | `false` |
| `runtime` | string | Runtime à utiliser | `node` |
| `cwd` | string | Répertoire de travail | `${workspaceFolder}` |
| `env` | object | Variables d'environnement | `{}` |

### Exemple de configuration avancée

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "lingala",
      "request": "launch",
      "name": "Déboguer avec Node.js",
      "program": "${workspaceFolder}/scripts/app.lingala",
      "runtime": "node",
      "cwd": "${workspaceFolder}",
      "env": {
        "NODE_ENV": "development"
      }
    },
    {
      "type": "lingala",
      "request": "launch",
      "name": "Lancer sans débogage",
      "program": "${workspaceFolder}/scripts/app.lingala",
      "noDebug": true
    }
  ]
}
```

## 🐛 Débogage du Débogueur

Pour déboguer le débogueur lui-même :

1. Ouvrir `debugger/src/debugAdapter.ts`
2. Ajouter des breakpoints dans le code TypeScript
3. Lancer avec `npm run watch`
4. Utiliser un launch configuration pour tester

## 🔧 Architecture

### Debug Adapter Protocol

Le débogueur utilise le **Debug Adapter Protocol (DAP)** de VS Code :

1. **Extension VS Code** (Client) : Gère l'interface utilisateur
2. **Debug Adapter** (Serveur) : Communique avec le runtime Node.js
3. **Runtime Node.js** : Exécute le JavaScript généré

### Workflow de débogage

```
Fichier .lingala
    ↓ (Compilation AST)
Fichier .js
    ↓ (Exécution Node.js)
Débogueur Node.js
    ↓ (Communication DAP)
Debug Adapter
    ↓ (Communication DAP)
Extension VS Code
```

## 📊 Limitations Actuelles

Fonctionnalités non encore implémentées :

- ⚠️ **Source Maps** : Mapping précis lignes .lingala → .js
- ⚠️ **Step Over/Step Into/Step Out** : Navigation pas-à-pas
- ⚠️ **Watch Expressions** : Évaluation d'expressions
- ⚠️ **Conditional Breakpoints** : Breakpoints conditionnels
- ⚠️ **Exception Breakpoints** : Arrêt sur exceptions

Ces fonctionnalités nécessitent une intégration plus profonde avec le débogueur Node.js et des source maps sophistiquées.

## 🌍 Prochaines améliorations

Pour un débogueur complet :

1. **Source Maps** : Mapping précis entre .lingala et .js
2. **Step Over/Into/Out** : Navigation pas-à-pas dans le code
3. **Watch Expressions** : Évaluation d'expressions en temps réel
4. **Conditional Breakpoints** : Breakpoints avec conditions
5. **Exception Breakpoints** : Arrêt sur exceptions
6. **Hot Reload** : Rechargement à chaud lors des modifications

## 💡 Alternatives

En attendant un débogueur complet :

1. **Déboguer le JavaScript généré** :
   - Compiler le fichier `.lingala` avec `--ast`
   - Ouvrir le fichier `.js` généré
   - Utiliser le débogueur JavaScript standard

2. **Console.log** :
   - Utiliser `elobi` pour afficher des valeurs
   - Équivalent de `console.log` en Lingala

## 📚 Ressources

- [Debug Adapter Protocol](https://microsoft.github.io/debug-adapter-protocol/)
- [VS Code Debugging](https://code.visualstudio.com/docs/editor/debugging)
- [Node.js Debugger](https://nodejs.org/en/docs/guides/debugging-getting-started/)

---

**LingalaAutomation - Débogage intégré dans VS Code** 🚀🇨🇩
