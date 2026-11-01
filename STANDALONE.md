# LingalaAutomation - Exécutable Standalone

## 📦 Qu'est-ce que l'exécutable standalone ?

L'exécutable standalone (`lingala.exe`) est une version compilée de LingalaAutomation qui peut s'exécuter **sans Node.js** sur l'ordinateur de l'utilisateur.

### Avantages
- ✅ **Pas besoin d'installer Node.js**
- ✅ **Pas besoin de npm**
- ✅ **Un seul fichier exécutable**
- ✅ **Fonctionne sur Windows, Linux et macOS**
- ✅ **Taille : ~56 MB** (inclut Node.js embarqué)

## 🚀 Installation

### 1. Télécharger l'exécutable

L'exécutable se trouve dans le dossier `build/` après compilation :

```
E:\gestion\lingala-automation\build\lingala.exe
```

### 2. Ajouter au PATH (optionnel)

Pour utiliser `lingala` depuis n'importe où, ajoutez le dossier `build/` à votre PATH Windows.

## 📝 Utilisation

### Compiler un fichier .lingala

```bash
# Windows
lingala.exe scripts/mon-script.lingala

# Avec AST (expérimental)
lingala.exe scripts/mon-script.lingala --ast

# Avec validation des types
lingala.exe scripts/mon-script.lingala --ast --type-check
```

### Exécuter le JavaScript généré

Après compilation, exécutez le fichier JavaScript généré :

```bash
node scripts/mon-script.js
```

**Note :** L'exécutable standalone compile uniquement les fichiers .lingala en JavaScript. L'exécution du JavaScript nécessite toujours Node.js (ou un navigateur).

## 🔧 Compiler l'exécutable

### Pour Windows uniquement

```bash
npm run build:exe
```

### Pour toutes les plateformes (Windows, Linux, macOS)

```bash
npm run build:exe:all
```

Cela générera :
- `lingala-win-x64.exe` (Windows)
- `lingala-linux-x64` (Linux)
- `lingala-macos-x64` (macOS)

## 📁 Structure des fichiers

```
lingala-automation/
├── build/
│   └── lingala.exe          # Exécutable standalone (56 MB)
├── dist/
│   ├── cli-standalone.js    # CLI pour standalone
│   └── ...                  # Autres modules
├── scripts/
│   └── mon-script.lingala   # Code source
└── package.json
```

## 🎯 Cas d'utilisation

### Pour les développeurs RDC

L'exécutable standalone est idéal pour :
- Partager LingalaAutomation avec des collègues qui n'ont pas Node.js
- Distribuer le compilateur sans dépendances
- Créer des installations simples

### Limitations

- L'exécutable **compile uniquement** les fichiers .lingala
- L'exécution du JavaScript généré nécessite toujours Node.js
- Pour une exécution complète standalone, utilisez le runtime JavaScript pur (navigateur/Deno)

## 🔍 Exemple complet

```bash
# 1. Compiler un script
lingala.exe scripts/bonjour.lingala --ast

# Sortie :
# Traduction réussie !
# ✓ Compilateur AST utilisé
# JavaScript généré : E:\gestion\lingala-automation\scripts\bonjour.js

# 2. Exécuter le JavaScript généré
node scripts/bonjour.js

# Sortie :
# Bonjour le monde !
```

## 🌍 Prochaines améliorations

Pour une expérience encore plus standalone :

1. **Mode REPL interactif** - Exécuter du code Lingala directement dans l'exécutable
2. **Exécution intégrée** - Exécuter le JavaScript généré sans Node.js externe
3. **Taille réduite** - Utiliser Node.js SEA (Single Executable Applications) pour réduire la taille

## 📚 Ressources

- [Documentation pkg](https://yao-pkg.github.io/pkg/)
- [Node.js Single Executable Applications](https://nodejs.org/api/single-executable-applications.html)
- [Documentation principale](README.md)

---

**LingalaAutomation - Langage de programmation en lingala** 🇨🇩
