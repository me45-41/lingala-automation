# Interopérabilité JavaScript - LingalaAutomation

## 📋 Vue d'ensemble

LingalaAutomation est conçu pour s'intégrer facilement avec les projets JavaScript existants. Cette documentation explique comment utiliser LingalaAutomation avec JavaScript, Node.js, et d'autres écosystèmes JavaScript.

## 🚀 Compilation en Module JavaScript

LingalaAutomation compile les fichiers `.lingala` en modules JavaScript ES6, ce qui permet de les utiliser directement dans les projets JavaScript.

### Exemple de Compilation

```bash
node dist/cli-fast.js scripts/mon-script.lingala --ast
```

Cela génère `scripts/mon-script.js` qui peut être importé dans JavaScript.

## 🔌 Importer du Code Lingala dans JavaScript

### Import de Fonctions

**Code Lingala (`utils.lingala`) :**
```lingala
mosala additionner(a mboka Number, b mboka Number) mboka Number banda
  zonga a + b;
}

mosala multiplier(a mboka Number, b mboka Number) mboka Number banda
  zonga a * b;
}
```

**Code JavaScript (`main.js`) :**
```javascript
import { additionner, multiplier } from './utils.js';

console.log(additionner(5, 3));  // 8
console.log(multiplier(4, 2));   // 8
```

### Import de Classes

**Code Lingala (`personne.lingala`) :**
```lingala
klasi Personne banda
  mbotaka nom mboka String, age mboka Number banda
    nom = nom;
    age = age;
  }

  mosala saluer() banda
    elobi("Mbote, nazali " + nom);
  }
}
```

**Code JavaScript (`main.js`) :**
```javascript
import { Personne } from './personne.js';

const jean = new Personne("Jean", 25);
jean.saluer();  // Mbote, nazali Jean
```

### Import par Défaut

**Code Lingala (`api.lingala`) :**
```lingala
mosala fetchDonnees() banda
  // Code pour récupérer des données
  zonga { donnees: "exemple" };
}

kokota fetchDonnees par défaut;
```

**Code JavaScript (`main.js`) :**
```javascript
import fetchDonnees from './api.js';

const donnees = fetchDonnees();
console.log(donnees);
```

## 🔌 Importer du Code JavaScript dans Lingala

### Import de Fonctions JavaScript

**Code JavaScript (`math-utils.js`) :**
```javascript
export function factorielle(n) {
  if (n <= 1) return 1;
  return n * factorielle(n - 1);
}

export function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
```

**Code Lingala (`calcul.lingala`) :**
```lingala
sangisa { factorielle, fibonacci } depuis "./math-utils.js";

tanga resultat1 = factorielle(5);
tanga resultat2 = fibonacci(10);

elobi("Factorielle: " + resultat1);
elobi("Fibonacci: " + resultat2);
```

### Import de Modules Node.js

**Code Lingala (`http-client.lingala`) :**
```lingala
sangisa { createServer } depuis "http";
sangisa { readFile } depuis "fs";

tanga server = createServer((requete, reponse) banda
  reponse.writeHead(200, { "Content-Type": "text/plain" });
  reponse.end("Bonjour depuis LingalaAutomation !");
});

server.ecouter(3000);
elobi("Serveur démarré sur http://localhost:3000");
```

### Import de Bibliothèques npm

**Code Lingala (`database.lingala`) :**
```lingala
sangisa { MongoClient } depuis "mongodb";

mosala connecter() banda
  tanga client = nouveau MongoClient("mongodb://localhost:27017");
  await client.connect();
  zonga client;
}
```

## 🎯 Utilisation dans les Projets Node.js

### Intégration dans un Projet Express

**Code Lingala (`routes.lingala`) :**
```lingala
mosala handlerAccueil(requete, reponse) banda
  reponse.json({ message: "Mbote!" });
}

mosala handlerApropos(requete, reponse) banda
  reponse.json({ version: "1.0.0" });
}

kokota { handlerAccueil, handlerApropos };
```

**Code JavaScript (`app.js`) :**
```javascript
import express from 'express';
import { handlerAccueil, handlerApropos } from './routes.js';

const app = express();

app.get('/', handlerAccueil);
app.get('/apropos', handlerApropos);

app.listen(3000, () => {
  console.log('Serveur Express démarré');
});
```

### Intégration dans un Projet React

**Code Lingala (`calculs.lingala`) :**
```lingala
mosala calculerTTC(prixHT mboka Number, tva mboka Number) mboka Number banda
  zonga prixHT * (1 + tva / 100);
}

kokota calculerTTC par défaut;
```

**Code React (`App.jsx`) :**
```jsx
import calculerTTC from './calculs.js';

function App() {
  const prix = calculerTTC(100, 20);
  
  return (
    <div>
      <h1>Prix TTC: {prix}€</h1>
    </div>
  );
}
```

## 🔌 Export vers JavaScript

### Export de Fonctions

Les fonctions Lingala sont automatiquement exportées comme fonctions JavaScript :

```lingala
mosala nomDeLaFonction(param1, param2) banda
  // Corps
  zonga resultat;
}
```

Devient en JavaScript :
```javascript
export function nomDeLaFonction(param1, param2) {
  // Corps
  return resultat;
}
```

### Export de Classes

Les classes Lingala sont automatiquement exportées comme classes JavaScript :

```lingala
klasi MaClasse banda
  mbotaka(param) banda
    // Constructeur
  }

  mosala methode() banda
    // Méthode
  }
}
```

Devient en JavaScript :
```javascript
export class MaClasse {
  constructor(param) {
    // Constructeur
  }

  methode() {
    // Méthode
  }
}
```

### Export par Défaut

Pour exporter par défaut, utilisez `kokota ... par défaut` :

```lingala
mosala fonctionPrincipale() banda
  // Code
}

kokota fonctionPrincipale par défaut;
```

## 📦 Utilisation avec TypeScript

LingalaAutomation génère du JavaScript pur, compatible avec TypeScript. Vous pouvez créer des fichiers de déclaration TypeScript (`.d.ts`) pour les modules Lingala.

**Fichier de déclaration (`calculs.d.ts`) :**
```typescript
export function additionner(a: number, b: number): number;
export function multiplier(a: number, b: number): number;
export class Calculatrice {
  constructor();
  calculer(a: number, b: number): number;
}
```

**Code TypeScript (`main.ts`) :**
```typescript
import { additionner, Calculatrice } from './calculs.js';

const resultat = additionner(5, 3);
const calc = new Calculatrice();
```

## 🎨 Bonnes Pratiques

### 1. Nommage Cohérent

Utilisez des noms cohérents entre Lingala et JavaScript :

```lingala
# Bon
mosala getUserById(id) banda
}

# Éviter
mosala kobotaMuntuNaId(id) banda
}
```

### 2. Documentation

Documentez les fonctions exportées pour faciliter l'utilisation par les développeurs JavaScript :

```lingala
// Récupère un utilisateur par son ID
// @param {Number} id - L'ID de l'utilisateur
// @returns {Object} L'utilisateur
mosala getUserById(id mboka Number) banda
  // Code
}
```

### 3. Types Consistants

Utilisez les types JavaScript standard pour l'interopérabilité :

```lingala
// Bon - Types standard
mosala processData(data mboka Array) banda
}

// Éviter - Types personnalisés
mosala processData(data mboka Libuka) banda
}
```

### 4. Gestion des Erreurs

Utilisez les erreurs JavaScript standard pour l'interopérabilité :

```lingala
essayer banda
  // Code
} kanga erreur banda
  // erreur est une Error JavaScript standard
  elobi(erreur.message);
}
```

## 🔧 Configuration du Package.json

Pour utiliser LingalaAutomation dans un projet JavaScript, ajoutez les scripts nécessaires :

```json
{
  "scripts": {
    "build:lingala": "node dist/cli-fast.js src/**/*.lingala --ast",
    "watch:lingala": "node dist/cli-fast.js src/**/*.lingala --ast --watch",
    "clean:lingala": "npm run cache:clean"
  }
}
```

## 📚 Exemples Complets

### Exemple 1 : API REST avec Express

**Code Lingala (`controllers.lingala`) :**
```lingala
sangisa { readFile } depuis "fs/promises";

mosala getProduits(requete, reponse) banda
  tanga data = luka("data/produits.json");
  tanga produits = JSON.parse(data);
  reponse.json(produits);
}

mosala createProduit(requete, reponse) banda
  tanga produit = requite.body;
  // Sauvegarder le produit
  reponse.status(201).json(produit);
}

kokota { getProduits, createProduit };
```

**Code JavaScript (`server.js`) :**
```javascript
import express from 'express';
import { getProduits, createProduit } from './controllers.js';

const app = express();
app.use(express.json());

app.get('/api/produits', getProduits);
app.post('/api/produits', createProduit);

app.listen(3000);
```

### Exemple 2 : Traitement de Données

**Code Lingala (`data-processor.lingala`) :**
```lingala
mosala filtrerDonnees(donnees mboka Array, critere mboka Function) mboka Array banda
  tanga resultat = [];
  mpo na moko na moko(item mboka donnees) banda
    soki critere(item) banda
      resultat.kota(item);
    }
  }
  zonga resultat;
}

mosala transformerDonnees(donnees mboka Array, transformation mboka Function) mboka Array banda
  zonga donnees.map(transformation);
}

kokota { filtrerDonnees, transformerDonnees };
```

**Code JavaScript (`main.js`) :**
```javascript
import { filtrerDonnees, transformerDonnees } from './data-processor.js';

const donnees = [1, 2, 3, 4, 5];

const pairs = filtrerDonnees(donnees, x => x % 2 === 0);
const doubles = transformerDonnees(donnees, x => x * 2);

console.log(pairs);   // [2, 4]
console.log(doubles); // [2, 4, 6, 8, 10]
```

## 🎯 Conclusion

**LingalaAutomation offre une interopérabilité complète avec JavaScript :**

- ✅ Compilation en modules JavaScript ES6
- ✅ Import de code JavaScript dans Lingala
- ✅ Export de code Lingala vers JavaScript
- ✅ Compatible avec Node.js, React, Express, etc.
- ✅ Compatible avec TypeScript
- ✅ Utilisation de bibliothèques npm

**Recommandation :** Utilisez LingalaAutomation pour la logique métier et JavaScript pour l'intégration avec l'écosystème existant.

---

**LingalaAutomation - Interopérabilité JavaScript Totale** 🚀🇨🇩
