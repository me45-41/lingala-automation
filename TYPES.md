# Système de Types - LingalaAutomation

## 📋 Vue d'ensemble

LingalaAutomation dispose maintenant d'un **système de types statique** qui permet aux utilisateurs d'annoter leurs variables et fonctions avec des types, avec validation automatique à la compilation !

## 🎯 Syntaxe des Types

### Annotation de Variable

```lingala
tanga nom mboka Type = valeur;
```

**Types supportés :**
- `Number` - Nombres entiers et décimaux
- `String` - Chaînes de caractères
- `Boolean` - Vrai ou faux
- `Array` - Tableaux/listes
- `Object` - Objets/dictionnaires
- `Any` - N'importe quel type
- `Void` - Pas de valeur de retour
- `Null` - Valeur nulle

### Exemples

```lingala
tanga nombre mboka Number = 42;
tanga texte mboka String = "Bonjour";
tanga actif mboka Boolean = ok;
tanga liste mboka Array = [1, 2, 3];
tanga personne mboka Object = {nom: "Jean"};
```

### Annotation de Fonction

```lingala
mosala nom(param1 mboka Type, param2 mboka Type) banda
  // corps
}
```

**Exemple :**

```lingala
mosala additionner(a mboka Number, b mboka Number) banda
  zonga a + b;
}
```

### Annotation de Type de Retour

Pour spécifier le type de retour (à venir) :

```lingala
mosala additionner(a mboka Number, b mboka Number) mboka Number banda
  zonga a + b;
}
```

## 🔧 Validation des Types

### Activer la Validation des Types

```bash
node dist/cli.js scripts/mon-script.lingala --ast --type-check
```

### Erreurs de Type

Le Type Checker détecte :

1. **Mismatch de type lors de l'assignation** :
```lingala
tanga x mboka Number = "ceci est une chaine";  // Erreur !
```

2. **Types incompatibles dans les expressions** :
```lingala
tanga x mboka Number = 42;
tanga y mboka String = x;  // Erreur : Number -> String
```

3. **Types de paramètres incorrects** :
```lingala
mosala afficher(texte mboka String) banda
  elobi(texte);
}

afficher(42);  // Erreur : Number != String
```

## 📊 Inférence de Types

Le Type Checker peut aussi **inférer** automatiquement les types quand aucune annotation n'est fournie :

```lingala
tanga x = 42;           // Type inféré : Number
tanga y = "Bonjour";    // Type inféré : String
tanga z = ok;           // Type inféré : Boolean
```

## 🎨 Mode Permissif

Par défaut, le Type Checker est en **mode permissif** :
- Les types non annotés sont acceptés
- Les erreurs de type sont des avertissements (ne bloquent pas la compilation)
- Permet une transition progressive vers le typage statique

## 📈 Prochaines Améliorations

Fonctionnalités à ajouter :

1. **Types de retour explicites** : `mboka Number` après la fonction
2. **Types génériques** : `libuka<Number>`
3. **Interfaces** : Définir des structures de types
4. **Types d'union** : `Number | String`
5. **Types d'intersection** : `Number & Positive`
6. **Types littéraux** : `type Etat = "actif" | "inactif"`
7. **Type Guards** : Vérification de types à l'exécution

## 💡 Bonnes Pratiques

### Quand utiliser les types ?

- ✅ Fonctions publiques d'une bibliothèque
- ✅ API partagées entre modules
- ✅ Structures de données complexes
- ✅ Variables critiques de l'application

### Quand ne pas utiliser les types ?

- ⚠️ Scripts simples et rapides
- ⚠️ Prototypage expérimental
- ⚠️ Code temporaire

## 🌍 Exemple Complet

```lingala
// Variables typées
tanga nom mboka String = "Jean";
tanga age mboka Number = 25;
tanga estActif mboka Boolean = ok;

// Fonction typée
mosala calculerAge(anneeNaissance mboka Number) mboka Number banda
  tanga anneeActuelle mboka Number = 2024;
  zonga anneeActuelle - anneeNaissance;
}

// Utilisation
tanga ageJean mboka Number = calculerAge(1999);
elobi("Age: " + ageJean);
```

## 📚 Ressources

- [Documentation Type Checker](../src/typeChecker.ts)
- [Documentation Parser](../src/parser.ts)
- [README principal](../README.md)

---

**LingalaAutomation - Système de Types Statique** 🚀🇨🇩
