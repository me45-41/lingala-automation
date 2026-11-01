# LingalaAutomation - Extension VS Code

Extension VS Code pour le langage de programmation LingalaAutomation.

## Installation

1. Ouvrir VS Code
2. Aller dans Extensions (Ctrl+Shift+X)
3. Cliquer sur "..." -> "Install from VSIX..."
4. Sélectionner le fichier `lingala-automation.vsix`

## Fonctionnalités

- ✅ Coloration syntaxique pour le langage LingalaAutomation
- ✅ Support des fichiers `.lingala`
- ✅ Auto-closing des brackets et guillemets
- ✅ Support des commentaires avec `//`

## Éditer l'extension

```bash
cd vscode-extension
npm install
npm run package
```

## Syntaxe Supportée

### Mots-clés colorés
- **Variables** : `tanga` (bleu)
- **Contrôle** : `soki`, `soki te`, `susa`, `tantike`, `mpo na moko na moko` (rose)
- **Fonctions** : `mosala`, `zonga` (violet)
- **Classes** : `klasi`, `mbotaka` (orange)
- **Booléens** : `ok`, `te` (vert)
- **Affichage** : `elobi` (jaune)
- **Automatisation** : `kosala`, `luka`, `longola`, etc. (cyan)
- **Types** : `libuka`, `diktionere`, `tupple`, `ensemble` (magenta)

### Exemple

```lingala
// Commentaire en lingala
tanga message = "Mbote na LingalaAutomation !"
tanga nombres = libuka[1, 2, 3, 4, 5]

soki (nombres.bokoni() > 0) banda
    elobi "La liste contient " + nombres.bokoni() + " éléments"
susa
```

## Développement

Pour générer le fichier VSIX :
```bash
npm install -g vsce
vsce package
```
