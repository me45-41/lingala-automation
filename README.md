# LingalaAutomation - DSL d'Automatisation en Lingala

LingalaAutomation est un langage de programmation en lingala pour automatiser des tâches système, avec des fonctionnalités puissantes inspirées de Python et une sécurité intégrée pour la défense nationale.

**Auteur :** MUSABA MUNGWARI Victor - Ingénieur en Informatique de Gestion, RDC  
**Contact :** victor.musaba@lingala-automation.cd | WhatsApp: +243822738076  
**Propriétaire :** Langage de programmation LingalaAutomation  

**📖 Spécification Officielle :** Consultez [SPECIFICATION.md](SPECIFICATION.md) pour la documentation formelle complète du langage.

## 🚀 Installation

```bash
cd E:/gestion/lingala-automation
npm install
npm run build
```

## 📝 Utilisation

### Compiler un script (avec compilateur regex)

```bash
node dist/cli.js scripts/mon-script.lingala
```

### Compiler un script (avec compilateur AST)

```bash
node dist/cli.js scripts/mon-script.lingala --ast
```

### Compiler avec validation des types

```bash
node dist/cli.js scripts/mon-script.lingala --ast --type-check
```

### Désactiver l'obfuscation (développement uniquement)

```bash
node dist/cli.js scripts/mon-script.lingala --ast --no-obfuscate
```

### Exécuter le script compilé

```bash
node scripts/mon-script.js
```

### Utiliser l'exécutable standalone (sans Node.js)

```bash
# Compiler l'exécutable
npm run build:exe

# Utiliser l'exécutable (obfuscation activée par défaut)
./build/lingala.exe scripts/mon-script.lingala --ast

# Désactiver l'obfuscation (développement)
./build/lingala.exe scripts/mon-script.lingala --ast --no-obfuscate
```

**Note :** L'exécutable standalone compile les fichiers .lingala sans nécessiter Node.js installé. Voir [STANDALONE.md](STANDALONE.md) pour plus de détails.

### Optimisation des Performances

```bash
# Compilation avec cache (recommandé - 50x plus rapide)
node dist/cli-fast.js scripts/mon-script.lingala --ast

# Compilation + exécution
node dist/cli-fast.js scripts/mon-script.lingala --ast --run

# Mode watch (développement)
node dist/cli-fast.js scripts/mon-script.lingala --ast --watch

# Vider le cache
npm run cache:clean

# Statistiques du cache
npm run cache:stats
```

**Note :** Le système de cache intelligent évite de recompiler les fichiers qui n'ont pas changé. Voir [PERFORMANCE.md](PERFORMANCE.md) pour plus de détails.

### Obfuscation du Code (Protection)

**⚠️ IMPORTANT : L'obfuscation est activée PAR DÉFAUT pour protéger votre code en production.**

```bash
# Compilation normale (obfuscation niveau moyen PAR DÉFAUT)
node dist/cli-fast.js scripts/mon-script.lingala --ast

# Niveau d'obfuscation personnalisé
node dist/cli-fast.js scripts/mon-script.lingala --ast --obfuscate-level eleve

# Désactiver l'obfuscation (développement uniquement)
node dist/cli-fast.js scripts/mon-script.lingala --ast --no-obfuscate
```

**Niveaux d'obfuscation :**
- `basique` : Suppression commentaires + minification
- `moyen` (défaut) : Renommage variables + chiffrement parties critiques
- `eleve` : Encodage chaînes + code garbage
- `extreme` : Tous les moyens maximums

**Note :** L'obfuscation protège le code compilé contre le reverse engineering et la copie non autorisée. Voir [OBFUSCATION.md](OBFUSCATION.md) pour plus de détails.

## 📚 Vocabulaire du Langage

### Variables et Données

| Mot-clé | Syntaxe | JavaScript | Description |
|--------|---------|------------|-------------|
| `tanga` | `tanga x = valeur` | `let x = valeur` | Déclarer une variable |
| `elobi` | `elobi expression` | `console.log(expression)` | Afficher dans la console |
| `ok` | `ok` | `true` | Vrai |
| `te` | `te` | `false` | Faux |

### Types de Données Avancés (inspirés de Python)

| Type | Syntaxe | Description |
|------|---------|-------------|
| `libuka` | `libuka[1, 2, 3]` | Liste (similaire à Python list) |
| `diktionere` | `diktionere{cle: valeur}` | Dictionnaire (similaire à Python dict) |
| `tupple` | `tupple(1, 2, 3)` | Tuple immuable (similaire à Python tuple) |
| `ensemble` | `ensemble{1, 2, 3}` | Ensemble unique (similaire à Python set) |

### Méthodes des Listes (Libuka)

| Méthode | Description |
|---------|-------------|
| `kota(item)` | Ajouter un élément (append) |
| `kokota(liste)` | Étendre avec une autre liste (extend) |
| `kokisa(index, item)` | Insérer à un index (insert) |
| `longola(item)` | Supprimer par valeur (remove) |
| `zonga(index)` | Supprimer et retourner (pop) |
| `lotemisa()` | Trier (sort) |
| `kokanzisa()` | Inverser (reverse) |
| `bokoni()` | Longueur (len) |
| `index(item)` | Index d'un élément |
| `kobanda(item)` | Compter les occurrences |
| `kozwa(index)` | Obtenir un élément |
| `likisa(callback)` | Filtrer (filter) |
| `koboma(callback)` | Mapper (map) |

### Méthodes des Dictionnaires (Diktionere)

| Méthode | Description |
|---------|-------------|
| `kota(cle, valeur)` | Ajouter/modifier une valeur |
| `kozwa(cle)` | Obtenir une valeur |
| `koyoka(cle)` | Vérifier si la clé existe |
| `longola(cle)` | Supprimer une clé |
| `bikoki()` | Obtenir toutes les clés (keys) |
| `baliba()` | Obtenir toutes les valeurs (values) |
| `biloko()` | Obtenir les paires clé-valeur (items) |
| `bokoni()` | Longueur |
| `silisa()` | Effacer tout (clear) |
| `kobongola(other)` | Mettre à jour avec un autre dict (update) |

### Structures de Contrôle

| Mot-clé | Syntaxe | JavaScript | Description |
|--------|---------|------------|-------------|
| `soki` | `soki (condition) banda` | `if (condition) {` | Condition si |
| `soki te` | `soki te banda` | `} else {` | Sinon |
| `susa` | `susa` | `}` | Fermer un bloc |
| `tantike` | `tantike (condition) banda` | `while (condition) {` | Boucle tant que |
| `mpo na moko na moko` | `mpo na moko na moko(liste) banda` | `for (const item of liste) {` | Pour chaque |

**Note sur la fermeture des blocs :** LingalaAutomation a deux compilateurs. Le compilateur AST (recommandé) utilise `}` pour fermer les blocs, tandis que le compilateur regex utilise `susa`. Voir [BLOCK_CLOSURE.md](BLOCK_CLOSURE.md) pour plus de détails.

**Exemple AST (recommandé) :**
```lingala
soki nombre > 20 banda
  elobi("Nombre est grand");
}
```

**Exemple Regex (historique) :**
```lingala
soki nombre > 20 banda
  elobi("Nombre est grand");
susa
```

### Programmation Orientée Objet

| Mot-clé | Syntaxe | JavaScript | Description |
|--------|---------|------------|-------------|
| `klasi` | `klasi Nom banda` | `class Nom {` | Déclarer une classe |
| `mbotaka` | `mbotaka params banda` | `constructor(params) {` | Constructeur |
| `mosala` | `mosala nom() banda` | `nom() {` | Méthode |

**Note :** Dans les méthodes, utilisez `this.` pour accéder aux propriétés.

**Exemple de classe :**
```lingala
klasi Muntu banda
  mbotaka kombo, age banda
    kombo = kombo
    age = age
  susa

  mosala saluer() banda
    elobi "Mbote, nazali " + this.kombo + " mpo na " + this.age + " ans"
  susa
susa

tanga jean = Muntu("Jean", 25)
jean.saluer()
```

### Opérations sur les Fichiers

| Mot-clé | Syntaxe | Description |
|--------|---------|-------------|
| `kosala` | `kosala(chemin, contenu)` | Créer un fichier |
| `luka` | `luka(chemin)` | Lire un fichier |
| `longola` | `longola(chemin)` | Supprimer un fichier/dossier |
| `kokisa` | `kokisa(source, destination)` | Copier un fichier |
| `sukisa` | `sukisa(source, destination)` | Déplacer un fichier |
| `bongoliKombo` | `bongoliKombo(chemin, nouveauNom)` | Renommer un fichier |

### Opérations sur les Dossiers

| Mot-clé | Syntaxe | Description |
|--------|---------|-------------|
| `botia` | `botia(chemin)` | Créer un dossier |
| `kokomisa` | `kokomisa(chemin)` | Lister les fichiers d'un dossier |
| `koyoka` | `koyoka(chemin)` | Vérifier si un fichier/dossier existe |

### Opérations Système

| Mot-clé | Syntaxe | Description |
|--------|---------|-------------|
| `salisa` | `salisa(commande)` | Exécuter une commande système |
| `kozinga` | `kozinga(millisecondes)` | Attendre (pause) |
| `mbula` | `mbula()` | Obtenir la date/heure actuelle |
| `makomi` | `makomi(chemin)` | Obtenir les infos d'un fichier |

## 💡 Exemples

### Exemple 1 : Types de données avancés

```lingala
// Liste
tanga nombres = libuka[1, 2, 3, 4, 5]
nombres.kota(6)
elobi "Liste : " + nombres

// Dictionnaire
tanga personne = diktionere{kombo: "Jean", mbula: 25}
elobi "Nom : " + personne.kozwa("kombo")

// Tuple
tanga coordonnees = tupple(10, 20, 30)
elobi "X : " + coordonnees.kozwa(0)

// Ensemble
tanga unique = ensemble{1, 2, 3, 2, 1}
elobi "Unique : " + unique
```

### Exemple 2 : Créer un fichier

```lingala
tanga message = "Mbote na LingalaAutomation !"
tanga fichier = "E:/test.txt"

kosala(fichier, message)

soki (koyoka(fichier)) banda
    elobi "Fichier créé avec succès !"
susa
```

### Exemple 3 : Backup de dossier

```lingala
tanga source = "E:/documents"
tanga destination = "E:/backup"

botia(destination)

soki (koyoka(source)) banda
    tanga fichiers = kokomisa(source)
    elobi "Fichiers : " + fichiers
susa
```

### Exemple 4 : Boucle sur les fichiers

```lingala
tanga dossier = "E:/images"
tanga fichiers = kokomisa(dossier)

mpo na moko na moko(fichiers) banda
    elobi "Traitement : " + fichier
susa
```

### Exemple 5 : Fonction personnalisée

```lingala
mosala sauvegarder(chemin) banda
    elobi "Sauvegarde de : " + chemin
    tanga backup = chemin + ".bak"
    kokisa(chemin, backup)
susa

sauvegarder("E:/document.txt")
```

## 📁 Structure du Projet

```
lingala-automation/
├── src/
│   ├── compiler.ts       # Compilateur Lingala → JavaScript (regex + AST)
│   ├── lexer.ts          # Lexer pour AST (tokenisation)
│   ├── parser.ts         # Parser AST (analyse syntaxique)
│   ├── codeGenerator.ts  # Code Generator (AST → JavaScript)
│   ├── typeChecker.ts    # Type Checker (validation des types)
│   ├── cli.ts            # Interface ligne de commande
│   ├── cli-standalone.ts # CLI pour exécutable standalone
│   ├── automation.ts     # Fonctions d'automatisation
│   ├── types.ts          # Types de données avancés
│   ├── classes.ts        # Programmation orientée objet
│   ├── http.ts           # Fonctions HTTP
│   ├── html.ts           # Fonctions HTML
│   ├── server.ts         # Fonctions serveur
│   ├── css.ts            # Fonctions CSS
│   ├── database.ts       # Base de données en mémoire
│   ├── templates.ts      # Templates web
│   ├── testing.ts        # Framework de tests
│   ├── standards.ts      # Bibliothèques standards (CSV, XML, etc.)
│   ├── runtime.ts        # Runtime JavaScript pur
│   └── errors.ts         # Gestion des erreurs
├── scripts/
│   ├── test-fichier.lingala
│   ├── backup.lingala
│   ├── types-test.lingala
│   ├── ast-minimal.lingala
│   └── test-ast-complete.lingala
├── dist/                 # Fichiers JavaScript compilés
├── build/                # Exécutable standalone (lingala.exe)
├── package.json
├── tsconfig.json
├── STANDALONE.md         # Documentation exécutable standalone
└── RESOLUTION_INCONVENIENTS.md  # Suivi des problèmes résolus
```

## 🎯 Fonctionnalités

- ✅ Variables et expressions
- ✅ Types de données avancés (listes, dictionnaires, tuples, sets)
- ✅ Conditions (si/sinon)
- ✅ Boucles (tant que, pour chaque)
- ✅ Fonctions personnalisées
- ✅ Manipulation de fichiers
- ✅ Manipulation de dossiers
- ✅ Exécution de commandes système
- ✅ Gestion d'erreurs
- ✅ Opérations asynchrones

## 🔧 Développement

```bash
# Compiler en mode watch
npm run dev

# Compiler une fois
npm run build
```

## 📝 Notes

- Toutes les opérations d'automatisation sont asynchrones (async/await)
- Les chemins de fichiers utilisent des slashs `/` (compatible Windows)
- Les commentaires commencent par `//`
- Les chaînes de caractères sont entre guillemets doubles `"` ou simples `'`
- Les types de données sont inspirés de Python pour une familiarité maximale

## 🌐 Fonctionnalités Web ✅

LingalaAutomation supporte maintenant le développement web complet !

### HTTP
| Fonction | Description |
|----------|-------------|
| `koyoka(url)` | Requête GET |
| `kokisa(url, data)` | Requête POST |
| `koboma(url, data)` | Requête PUT |
| `longola(url)` | Requête DELETE |
| `kobongola(url, data)` | Requête PATCH |

### HTML
| Fonction | Description |
|----------|-------------|
| `kokota(tag, content)` | Ajouter un élément HTML |
| `kobomaHTML(html)` | Créer du HTML |
| `kokotaPage(title)` | Créer une page |
| `kotaLink(url, text)` | Ajouter un lien |
| `kotaImage(src, alt)` | Ajouter une image |
| `kotaForm(action)` | Créer un formulaire |
| `kotaInput(type, name, placeholder)` | Créer un input |
| `kotaButton(text)` | Créer un bouton |
| `kotaTable(headers)` | Créer une table |
| `kotaList(items)` | Créer une liste |

### Serveur
| Fonction | Description |
|----------|-------------|
| `kobotaServer(handler, options)` | Créer un serveur |
| `kobandaJSON(res, data)` | Envoyer JSON |
| `kobandaHTML(res, html)` | Envoyer HTML |
| `kobandaText(res, text)` | Envoyer texte |
| `kobandaBody(req)` | Lire le body |
| `kobandaJSONBody(req)` | Lire le body JSON |
| `kobandaQuery(req)` | Lire les query params |
| `kobandaParams(req)` | Lire les path params |

### CSS
| Fonction | Description |
|----------|-------------|
| `langi(selector, color)` | Couleur du texte |
| `nsima(selector, color)` | Couleur de fond |
| `bonene(selector, size)` | Taille du texte |
| `ndelo(selector, border)` | Bordure |
| `zinga(selector, radius)` | Coins arrondis |
| `mbole(selector, margin)` | Marge extérieure |
| `katikati(selector, padding)` | Espacement intérieur |
| `kobimisa(selector, width)` | Largeur |
| `botuka(selector, height)` | Hauteur |
| `kobanda(selector, display)` | Affichage |
| `molongo(selector, direction)` | Flexbox direction |
| `katikatiHorizontal(selector, align)` | Alignement horizontal |
| `katikatiVertical(selector, align)` | Alignement vertical |
| `kobola(selector, gap)` | Flexbox gap |
| `kima(selector, position)` | Position |
| `seko(selector, top)` | Position top |
| `sekoNaMolongo(selector, bottom)` | Position bottom |
| `sekoNaLiboso(selector, left)` | Position left |
| `sekoNaMbote(selector, right)` | Position right |
| `kotisa(selector, zIndex)` | Z-index |
| `boselu(selector, opacity)` | Opacité |
| `koyokaCSS(selector, visibility)` | Visibilité |
| `kotaMouse(selector, cursor)` | Curseur |
| `kobomaText(selector, decoration)` | Text decoration |
| `kobandaText(selector, transform)` | Text transform |
| `mbata(selector, weight)` | Font weight |
| `kokoma(selector, family)` | Font family |
| `kobimaText(selector, align)` | Text align |
| `kobimaOverflow(selector, overflow)` | Overflow |
| `kimaShadow(selector, shadow)` | Box-shadow |
| `kobimisaTransition(selector, property, duration)` | Transition |
| `kobongolaCSS(selector, transform)` | Transform |
| `kelasi(className, properties)` | Créer une classe CSS |
| `responsive(minWidth, css)` | Media query |
| `kobimaAnimation(name, keyframes)` | Animation |
| `kobomaCSS()` | Générer le CSS |
| `silisaCSS()` | Effacer les styles |

### Exemple Web
```lingala
// Créer du HTML
kokota("h1", "Mbote na LingalaAutomation !")

// Ajouter des styles CSS
langi("body", "#333")
nsima("body", "#f5f5f5")
bonene("h1", "24px")

// Générer le CSS
elobi(kobomaCSS())
```

### Exemple API REST
```lingala
klasi ApiHandler banda
  mosala repondre(req, res) banda
    kobandaJSON(res, {message: "Mbote"})
  susa
susa

tanga handler = ApiHandler()
kobotaServer(handler.repondre, {port: 3000})
```

## ⚠️ Gestion d'Exceptions ✅ NOUVEAU

LingalaAutomation supporte maintenant la gestion d'exceptions complète avec try/catch/finally !

| Concept | Mot-clé Lingala | JavaScript | Description |
|---------|----------------|------------|-------------|
| try | `essayer banda` | `try {` | Essayer un bloc de code |
| catch | `kanga variable banda` | `} catch (variable) {` | Attraper une exception |
| finally | `misusu banda` | `} finally {` | Toujours exécuter |
| throw | `sangisa(message, code?)` | `throw new Faute(...)` | Lancer une exception |

### Exemple simple
```lingala
essayer banda
    tanga x = 10
    tanga y = 0

    soki (y == 0) banda
        sangisa("Division par zéro impossible !")
    susa

kanga erreur banda
    elobi "Erreur attrapée : " + erreur.message

misusu banda
    elobi "Bloc finally toujours exécuté"
```

### Exception personnalisée avec code
```lingala
essayer banda
    tanga fichierExiste = te

    soki (fichierExiste == te) banda
        sangisa("Fichier introuvable", "FILE_NOT_FOUND")
    susa

kanga erreur banda
    elobi "Type d'erreur : " + erreur.name
    elobi "Message : " + erreur.message
    elobi "Code d'erreur : " + erreur.code

misusu banda
    elobi "Nettoyage des ressources..."
```

**Note :** Les blocs `essayer`, `kanga` et `misusu` se ferment automatiquement. Pas besoin de `susa` après `misusu`.

## � Système de Modules ✅ NOUVEAU

| Concept | Syntaxe Lingala | JavaScript |
|---------|----------------|------------|
| Import nommé | `kokota {nom} na "./module.lingala"` | `import {nom} from "./module"` |
| Export fonction | `salisa mosala nom` | `export function nom` |
| Export classe | `salisa klasi nom` | `export class nom` |

**Exemple module :**
```lingala
salisa mosala saluer(nom) banda
    elobi "Mbote, " + nom
susa
```

**Exemple import :**
```lingala
kokota {saluer} na "./module.lingala"
saluer("Jean")
```

## 📈 Statistiques Finales

- **~4700 lignes de code** TypeScript
- **13 fonctions d'automatisation**
- **5 fonctions HTTP** ✅
- **11 fonctions HTML** ✅
- **8 fonctions serveur** ✅
- **38 fonctions CSS** ✅
- **4 types de données** avec 37 méthodes
- **Gestion d'exceptions** (essayer/kanga/misusu/sangisa) ✅
- **Système de modules** (kokota/salisa) ✅
- **Héritage de classes** (bika) ✅
- **Extension VS Code** complète
- **Lexer AST complet** (tokenisation) ✅ NOUVEAU
- **Parser AST complet** (analyse syntaxique) ✅ NOUVEAU
- **Code Generator AST** (génération JavaScript) ✅ NOUVEAU
- **Type Checker** (validation des types) ✅ NOUVEAU
- **Exécutable standalone** (lingala.exe - 56 MB) ✅ NOUVEAU
- **100% en lingala**

## 🎯 État du Projet

### Architecture du Compilateur
- ✅ **Compilateur Regex** (stable, par défaut)
- ✅ **Compilateur AST** (moderne, avec `--ast`)
- ✅ **Type Checker** (validation statique, avec `--type-check`)
- ✅ **Exécutable Standalone** (sans Node.js, dans `build/lingala.exe`)

### Problèmes Résolus
- ✅ Pas de vrai parser - Pas d'AST → **RÉSOLU**
- ✅ Pas standalone - Ne peut pas s'exécuter comme .exe → **RÉSOLU**
- ✅ Manipulation de texte et edge cases → **RÉSOLU**

### Niveau de Complétion
**~95% complet pour devenir un vrai langage de production !**

**LingalaAutomation est maintenant un langage de programmation COMPLET capable de créer des applications web et des APIs, avec une gestion d'exceptions robuste, un compilateur AST moderne, et un exécutable standalone, tout en lingala !** 🚀🇨🇩
