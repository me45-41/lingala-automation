# Débogage Amélioré - LingalaAutomation

## 📋 Vue d'ensemble

LingalaAutomation dispose maintenant d'un système de débogage amélioré avec des stack traces lisibles en lingala et une traduction des messages d'erreur JavaScript vers le lingala.

## 🚀 Fonctionnalités

### 1. Stack Traces Lisibles en Lingala

Les stack traces JavaScript sont automatiquement converties pour afficher les lignes du fichier source `.lingala` au lieu des lignes du fichier JavaScript généré.

**Avant (JavaScript) :**
```
ReferenceError: x is not defined
    at test.js:5:10
    at test.js:10:5
```

**Après (Lingala) :**
```
Erreur de référence: x n'est pas défini
    at test.lingala:5:10
    at test.lingala:10:5
```

### 2. Traduction des Erreurs

Les messages d'erreur JavaScript sont automatiquement traduits en lingala pour une meilleure compréhension.

**Traductions supportées :**
- `SyntaxError` → `Erreur de syntaxe`
- `ReferenceError` → `Erreur de référence`
- `TypeError` → `Erreur de type`
- `RangeError` → `Erreur de plage`
- `URIError` → `Erreur d'URI`
- `is not defined` → `n'est pas défini`
- `is not a function` → `n'est pas une fonction`
- `Cannot read property` → `Impossible de lire la propriété`
- Et plus de 50 autres traductions

### 3. Mapping Source-to-Source

Le système de mapping source-to-source trace automatiquement la correspondance entre les lignes du fichier source `.lingala` et les lignes du fichier JavaScript généré.

**Fonctionnalités :**
- Génération automatique des mappings lors de la compilation
- Sauvegarde des mappings dans un fichier `.lingala-map.json`
- Chargement des mappings pour conversion des stack traces
- Support des compilateurs regex et AST

## 🔧 Utilisation

### Compilation avec Gestion d'Erreurs Améliorée

```bash
node dist/cli-fast.js scripts/mon-script.lingala --ast --run
```

Les erreurs seront automatiquement formatées avec :
- Traduction du type d'erreur
- Traduction du message d'erreur
- Stack trace avec lignes Lingala

### Gestionnaire d'Erreurs dans le Code

```typescript
import { EnhancedErrorHandler } from "./enhancedErrorHandler.js";

const errorHandler = new EnhancedErrorHandler();

// Initialiser le mapping source
errorHandler.initializeSourceMap("script.lingala", "script.js");

// Formater une erreur
try {
  // Code qui peut échouer
} catch (error) {
  console.error(errorHandler.formatError(error, "script.lingala"));
}
```

### Gestionnaire d'Erreurs Global

```typescript
import { EnhancedErrorHandler } from "./enhancedErrorHandler.js";

const errorHandler = new EnhancedErrorHandler();

// Enregistrer un gestionnaire d'erreurs global
errorHandler.registerGlobalErrorHandler("script.lingala");
```

## 📊 Exemples

### Exemple 1 : Erreur de Référence

**Code Lingala :**
```lingala
tanga x = 10;
elobi(y);  // y n'est pas défini
```

**Erreur traduite :**
```
Erreur de référence: y n'est pas défini
    at main (test.lingala:2:8)
    at Object.<anonymous> (test.lingala:2:1)
```

### Exemple 2 : Erreur de Type

**Code Lingala :**
```lingala
tanga x = 10;
x();  // x n'est pas une fonction
```

**Erreur traduite :**
```
Erreur de type: x n'est pas une fonction
    at main (test.lingala:2:2)
    at Object.<anonymous> (test.lingala:2:1)
```

### Exemple 3 : Erreur de Syntaxe

**Code Lingala :**
```lingala
tanga x = 10
elobi(x)  // Point-virgule manquant
```

**Erreur traduite :**
```
Erreur de syntaxe: Jeton inattendu
    at test.lingala:2:1
```

## 🎯 Recommandations

### Pour le Développement

✅ **Utilisez le gestionnaire d'erreurs global :**
```typescript
errorHandler.registerGlobalErrorHandler();
```

Avantages :
- Toutes les erreurs sont automatiquement traduites
- Stack traces lisibles en lingala
- Débogage plus facile

### Pour la Production

✅ **Sauvegardez les mappings source :**
```typescript
errorHandler.saveSourceMaps(".lingala-map.json");
```

Avantages :
- Stack traces post-mortem possibles
- Débogage des erreurs en production
- Analyse des erreurs

### Pour les Tests

✅ **Utilisez la méthode `catchAndFormat` :**
```typescript
try {
  // Code de test
} catch (error) {
  const formatted = errorHandler.catchAndFormat(error);
  assert(formatted.includes("traduction attendue"));
}
```

## 🔮 Fonctionnalités Futures

### 1. Mapping AST Sophistiqué

Mapping précis pour le compilateur AST avec informations de colonne et de portée.

### 2. Intégration avec le Débogueur VS Code

Utilisation des mappings pour afficher les breakpoints dans le fichier source `.lingala`.

### 3. Logs Structurés

Logs structurés avec traduction automatique et métadonnées enrichies.

### 4. Dashboard d'Erreurs

Interface web pour visualiser et analyser les erreurs.

## 💡 Bonnes Pratiques

### 1. Utiliser des Noms de Variables Significatifs

```lingala
# Bon
tanga nombreDElements = 10;

# Éviter
tanga x = 10;
```

### 2. Ajouter des Commentaires de Débogage

```lingala
// TODO: Ajouter validation
tanga x = getInput();
```

### 3. Utiliser le Gestionnaire d'Erreurs Global

Enregistrez le gestionnaire d'erreurs global pour capturer toutes les erreurs non gérées.

### 4. Sauvegarder les Mappings en Production

Sauvegardez les mappings source pour faciliter le débogage post-mortem.

### 5. Tester les Cas d'Erreur

Testez activement les cas d'erreur pour vous assurer que les traductions sont correctes.

## 📚 Référence API

### EnhancedErrorHandler

```typescript
class EnhancedErrorHandler {
  constructor();
  
  initializeSourceMap(lingalaFile: string, jsFile: string): void;
  loadSourceMaps(mapFile: string): void;
  saveSourceMaps(mapFile: string): void;
  formatError(error: Error, lingalaFile?: string): string;
  createLingalaError(message: string, line?: number, lingalaFile?: string): LingalaAutomationError;
  catchAndFormat(error: unknown, lingalaFile?: string): string;
  registerGlobalErrorHandler(lingalaFile?: string): void;
  translate(message: string): string;
  addTranslation(english: string, lingala: string): void;
}
```

### ErrorTranslator

```typescript
class ErrorTranslator {
  constructor();
  
  translate(errorMessage: string): string;
  translateErrorType(errorType: string): string;
  formatError(error: Error): string;
  addTranslation(english: string, lingala: string): void;
  addTranslations(translations: Record<string, string>): void;
}
```

### SourceMapManager

```typescript
class SourceMapManager {
  constructor();
  
  generateMapping(lingalaFile: string, jsFile: string): void;
  mapToLingala(jsFile: string, jsLine: number): SourceMapping | null;
  convertStackTrace(stackTrace: string): string;
  saveMappings(outputFile: string): void;
  loadMappings(inputFile: string): void;
}
```

## 🎯 Conclusion

**LingalaAutomation offre maintenant un système de débogage amélioré :**

- ✅ Stack traces lisibles en lingala
- ✅ Traduction automatique des erreurs JavaScript
- ✅ Mapping source-to-source
- ✅ Gestionnaire d'erreurs global
- ✅ Facilité de débogage

**Recommandation :** Utilisez le gestionnaire d'erreurs global et sauvegardez les mappings source pour un débogage optimal.

---

**LingalaAutomation - Débogage Amélioré** 🚀🇨🇩
