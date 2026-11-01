# Spécification Formelle du Langage LingalaAutomation

**Version :** 1.0.0  
**Date :** 2024  
**Statut :** Spécification Officielle

---

## Table des Matières

1. [Introduction](#introduction)
2. [Vue d'ensemble du Langage](#vue-densemble-du-langage)
3. [Lexique et Grammaire](#lexique-et-grammaire)
4. [Types de Données](#types-de-données)
5. [Structure du Programme](#structure-du-programme)
6. [Expressions et Opérateurs](#expressions-et-opérateurs)
7. [Structures de Contrôle](#structures-de-contrôle)
8. [Fonctions](#fonctions)
9. [Classes et POO](#classes-et-poo)
10. [Modules](#modules)
11. [Gestion des Erreurs](#gestion-des-erreurs)
12. [Bibliothèque Standard](#bibliothèque-standard)
13. [Conventions de Nommage](#conventions-de-nommage)
14. [Sémantique](#sémantique)
15. [Annexes](#annexes)

---

## 1. Introduction

### 1.1 But de la Spécification

Cette spécification définit formellement le langage de programmation **LingalaAutomation**, un langage de programmation en lingala pour l'automatisation, avec une syntaxe hybride (mots-clés lingala, opérateurs JavaScript standard).

### 1.2 Principes de Design

1. **Accessibilité** : Syntaxe hybride pour faciliter l'adoption par les développeurs JavaScript
2. **Identité Culturelle** : Mots-clés en lingala pour l'expression culturelle
3. **Modernité** : Support des types statiques, LSP, débogueur intégré
4. **Interopérabilité** : Compatible avec l'écosystème JavaScript/Node.js
5. **Simplicité** : Courbe d'apprentissage réduite

### 1.3 Historique des Versions

| Version | Date | Changements Majeurs |
|---------|------|---------------------|
| 1.0.0 | 2024 | Première version officielle, AST complet, types statiques, LSP, débogueur |

---

## 2. Vue d'ensemble du Langage

### 2.1 Hello World

```lingala
tanga message mboka String = "Mbote, mokili !";
elobi(message);
```

### 2.2 Programme Complet

```lingala
// Calcul de la factorielle
mosala factorielle(n mboka Number) mboka Number banda
  soki n <= 1 banda
    zonga 1;
  }
  zonga n * factorielle(n - 1);
}

tanga resultat = factorielle(5);
elobi("Factorielle de 5: " + resultat);
```

### 2.3 Modes de Compilation

LingalaAutomation supporte deux compilateurs :

1. **Compilateur Regex (Historique)** : Utilise des expressions régulières pour la traduction
2. **Compilateur AST (Recommandé)** : Utilise un analyseur syntaxique complet avec types statiques

**Recommandation :** Utiliser le compilateur AST pour tous les nouveaux projets.

---

## 3. Lexique et Grammaire

### 3.1 Mots-clés Réservés

Les mots-clés suivants sont réservés et ne peuvent pas être utilisés comme identifiants :

| Mot-clé | Catégorie | Signification |
|---------|-----------|---------------|
| `tanga` | Déclaration | Déclarer une variable |
| `elobi` | Sortie | Afficher dans la console |
| `ok` | Booléen | Vrai |
| `te` | Booléen | Faux |
| `soki` | Condition | Si |
| `soki te` | Condition | Sinon |
| `susa` | Fermeture (regex) | Fermer un bloc (compilateur regex) |
| `tantike` | Boucle | Tant que |
| `mpo na moko na moko` | Boucle | Pour chaque |
| `mosala` | Fonction | Déclarer une fonction |
| `zonga` | Retour | Retourner une valeur |
| `kosala` | Fichier | Créer un fichier |
| `luka` | Fichier | Lire un fichier |
| `longola` | Fichier | Supprimer un fichier |
| `kokisa` | Fichier | Copier un fichier |
| `sukisa` | Fichier | Déplacer un fichier |
| `bongoliKombo` | Fichier | Renommer un fichier |
| `botia` | Dossier | Créer un dossier |
| `kokomisa` | Dossier | Lister un dossier |
| `koyoka` | Dossier | Vérifier existence |
| `salisa` | Réseau | Requête HTTP |
| `kozinga` | Réseau | Serveur HTTP |
| `mbula` | Réseau | Base de données |
| `makomi` | Texte | Manipulation de texte |
| `klasi` | Classe | Déclarer une classe |
| `mbotaka` | Classe | Constructeur |
| `bika` | Erreur | Lancer une erreur |
| `essayer` | Erreur | Bloc try |
| `kanga` | Erreur | Bloc catch |
| `misusu` | Erreur | Bloc finally |
| `sangisa` | Utilitaire | Importer |
| `kokota` | Utilitaire | Exporter |
| `mboka` | Type | Annotation de type |

### 3.2 Identifiants

**Syntaxe :**
- Doit commencer par une lettre (a-z, A-Z) ou un underscore (_)
- Peut contenir des lettres, chiffres et underscores
- Sensible à la casse
- Longueur maximale : 255 caractères

**Exemples valides :**
```lingala
tanga maVariable = 10;
tanga _private = 20;
tanga nombre123 = 30;
```

**Exemples invalides :**
```lingala
tanga 123variable = 10;  // Commence par un chiffre
tanga ma-variable = 20;  // Contient un tiret
```

### 3.3 Littéraux

#### 3.3.1 Nombres

```lingala
tanga entier = 42;
tanga decimal = 3.14;
tanga scientifique = 1.5e10;
tanga hex = 0xFF;
tanga binaire = 0b1010;
```

#### 3.3.2 Chaînes de caractères

```lingala
tanga simple = "Bonjour";
tanga double = 'Monde';
tanga template = `Valeur: ${x}`;
```

#### 3.3.3 Booléens

```lingala
tanga vrai = ok;
tanga faux = te;
```

#### 3.3.4 Tableaux

```lingala
tanga liste = [1, 2, 3, 4, 5];
tanga mixte = [1, "deux", ok, te];
```

#### 3.3.5 Objets

```lingala
tanga personne = {
  nom: "Jean",
  age: 25,
  actif: ok
};
```

### 3.4 Opérateurs

#### 3.4.1 Opérateurs Arithmétiques

| Opérateur | Description | Priorité |
|-----------|-------------|----------|
| `+` | Addition | 5 |
| `-` | Soustraction | 5 |
| `*` | Multiplication | 6 |
| `/` | Division | 6 |
| `%` | Modulo | 6 |
| `**` | Puissance | 7 |

#### 3.4.2 Opérateurs de Comparaison

| Opérateur | Description | Priorité |
|-----------|-------------|----------|
| `==` | Égalité | 4 |
| `!=` | Différence | 4 |
| `===` | Égalité stricte | 4 |
| `!==` | Différence stricte | 4 |
| `<` | Inférieur | 4 |
| `>` | Supérieur | 4 |
| `<=` | Inférieur ou égal | 4 |
| `>=` | Supérieur ou égal | 4 |

#### 3.4.3 Opérateurs Logiques

| Opérateur | Description | Priorité |
|-----------|-------------|----------|
| `&&` | ET logique | 3 |
| `\|\|` | OU logique | 2 |
| `!` | NON logique | 7 |

#### 3.4.4 Opérateurs d'Assignation

| Opérateur | Description |
|-----------|-------------|
| `=` | Assignation simple |
| `+=` | Addition et assignation |
| `-=` | Soustraction et assignation |
| `*=` | Multiplication et assignation |
| `/=` | Division et assignation |
| `%=` | Modulo et assignation |

---

## 4. Types de Données

### 4.1 Types Primitifs

#### 4.1.1 Number

Représente les nombres entiers et décimaux (IEEE 754 double precision).

```lingala
tanga x mboka Number = 42;
tanga y mboka Number = 3.14;
```

#### 4.1.2 String

Représente les chaînes de caractères UTF-16.

```lingala
tanga texte mboka String = "Bonjour";
```

#### 4.1.3 Boolean

Représente les valeurs booléennes.

```lingala
tanga actif mboka Boolean = ok;
```

### 4.2 Types Composites

#### 4.2.1 Array

Collection ordonnée d'éléments.

```lingala
tanga liste mboka Array = [1, 2, 3];
```

#### 4.2.2 Object

Collection de paires clé-valeur.

```lingala
tanga objet mboka Object = {cle: "valeur"};
```

### 4.3 Types Spéciaux

#### 4.3.1 Any

Type qui accepte n'importe quelle valeur.

```lingala
tanga x mboka Any = 42;
x = "maintenant une chaine";
```

#### 4.3.2 Void

Indique l'absence de valeur de retour.

```lingala
mosala rien() banda
  elobi("Pas de retour");
}
```

#### 4.3.3 Null

Représente l'absence intentionnelle de valeur.

```lingala
tanga x mboka Null = null;
```

### 4.4 Annotations de Type

Syntaxe : `mboka Type`

```lingala
tanga nombre mboka Number = 42;
tanga texte mboka String = "Bonjour";

mosala additionner(a mboka Number, b mboka Number) mboka Number banda
  zonga a + b;
}
```

---

## 5. Structure du Programme

### 5.1 Déclarations de Variables

```lingala
tanga x = 10;              // Déclaration avec inférence
tanga y mboka Number = 20; // Déclaration avec type explicite
```

### 5.2 Commentaires

```lingala
// Commentaire sur une ligne

/*
  Commentaire
  sur plusieurs
  lignes
*/
```

### 5.3 Points-Virgules

Les points-virgules sont optionnels mais recommandés pour la clarté.

```lingala
tanga x = 10;
tanga y = 20;
```

---

## 6. Expressions et Opérateurs

### 6.1 Expressions Arithmétiques

```lingala
tanga resultat = 10 + 5 * 2;  // 20
tanga puissance = 2 ** 8;     // 256
tanga modulo = 17 % 5;        // 2
```

### 6.2 Expressions de Chaînes

```lingala
tanga a = "Bonjour";
tanga b = "Monde";
tanga c = a + " " + b;  // "Bonjour Monde"
```

### 6.3 Expressions Logiques

```lingala
tanga a = ok;
tanga b = te;
tanga c = a && b;  // te
tanga d = a || b;  // ok
tanga e = !a;      // te
```

### 6.4 Opérateur Ternaire

```lingala
tanga x = 10;
tanga resultat = x > 5 ? "grand" : "petit";
```

---

## 7. Structures de Contrôle

### 7.1 Conditionnelles

#### 7.1.1 If

```lingala
soki condition banda
  elobi("Vrai");
}
```

#### 7.1.2 If-Else

```lingala
soki condition banda
  elobi("Vrai");
} else {
  elobi("Faux");
}
```

#### 7.1.3 If-Else-If

```lingala
soki x > 10 banda
  elobi("Grand");
} else soki x > 5 banda
  elobi("Moyen");
} else {
  elobi("Petit");
}
```

### 7.2 Boucles

#### 7.2.1 While

```lingala
tantike condition banda
  elobi("Boucle");
}
```

#### 7.2.2 For-Each

```lingala
mpo na moko na moko(element mboka Array) banda
  elobi(element);
}
```

### 7.3 Break et Continue

```lingala
tantike ok banda
  soki condition banda
    bika;  // Sortir de la boucle
  }
  soki autreCondition banda
    tantike;  // Passer à l'itération suivante
  }
}
```

---

## 8. Fonctions

### 8.1 Déclaration de Fonction

```lingala
mosala nom(param1 mboka Type, param2 mboka Type) mboka TypeRetour banda
  // Corps de la fonction
  zonga valeur;
}
```

### 8.2 Appel de Fonction

```lingala
tanga resultat = nom(arg1, arg2);
```

### 8.3 Fonctions Anonymes

```lingala
tanga fonction = function(x mboka Number) banda
  zonga x * 2;
};

tanga resultat = fonction(5);
```

### 8.4 Fonctions Fléchées (Futur)

```lingala
tanga fonction = (x mboka Number) => x * 2;
```

### 8.5 Paramètres par Défaut

```lingala
mosala saluer(nom mboka String = "Monde") banda
  elobi("Bonjour, " + nom);
}
```

### 8.6 Paramètres Variadiques (Futur)

```lingala
mosala somme(...nombres mboka Number[]) banda
  tanga total = 0;
  mpo na moko na moko(n mboka nombres) banda
    total = total + n;
  }
  zonga total;
}
```

---

## 9. Classes et POO

### 9.1 Déclaration de Classe

```lingala
klasi Muntu banda
  mbotaka kombo mboka String, age mboka Number banda
    kombo = kombo;
    age = age;
  }

  mosala saluer() banda
    elobi("Mbote, nazali " + kombo);
  }

  mosala anniversaire() banda
    age = age + 1;
  }
}
```

### 9.2 Instanciation

```lingala
tanga jean = Muntu("Jean", 25);
jean.saluer();
```

### 9.3 Héritage

```lingala
klasi Etudiant banda Muntu banda
  mbotaka kombo mboka String, age mboka Number, filiere mboka String banda
    kombo = kombo;
    age = age;
    filiere = filiere;
  }

  mosala etudier() banda
    elobi(kombo + " étudie " + filiere);
  }
}
```

### 9.4 Méthodes Statiques (Futur)

```lingala
klasi MathUtil banda
  mosala statique carre(x mboka Number) mboka Number banda
    zonga x * x;
  }
}

tanga resultat = MathUtil.carre(5);
```

---

## 10. Modules

### 10.1 Import

```lingala
sangisa "./monModule.lingala";
sangisa { fonction1, fonction2 } depuis "./module.lingala";
```

### 10.2 Export

```lingala
kokota maFonction;
kokota { fonction1, fonction2 };
kokota maClasi par défaut;
```

---

## 11. Gestion des Erreurs

### 11.1 Try-Catch

```lingala
essayer banda
  // Code qui peut échouer
  tanga resultat = operationRisquee();
} kanga erreur banda
  elobi("Erreur: " + erreur.message);
}
```

### 11.2 Try-Catch-Finally

```lingala
essayer banda
  // Code qui peut échouer
} kanga erreur banda
  elobi("Erreur: " + erreur.message);
} misusu banda
  // Toujours exécuté
  elobi("Nettoyage");
}
```

### 11.3 Lancer une Erreur

```lingala
mosala validerAge(age mboka Number) banda
  soki age < 0 banda
    bika "L'age ne peut pas être négatif";
  }
}
```

---

## 12. Bibliothèque Standard

### 12.1 Opérations sur les Fichiers

| Fonction | Description |
|----------|-------------|
| `kosala(chemin, contenu)` | Créer un fichier |
| `luka(chemin)` | Lire un fichier |
| `longola(chemin)` | Supprimer un fichier |
| `kokisa(source, destination)` | Copier un fichier |
| `sukisa(source, destination)` | Déplacer un fichier |
| `bongoliKombo(chemin, nouveauNom)` | Renommer un fichier |

### 12.2 Opérations sur les Dossiers

| Fonction | Description |
|----------|-------------|
| `botia(chemin)` | Créer un dossier |
| `kokomisa(chemin)` | Lister un dossier |
| `koyoka(chemin)` | Vérifier existence |

### 12.3 Opérations Réseau

| Fonction | Description |
|----------|-------------|
| `salisa(url, options)` | Requête HTTP |
| `kozinga(port, handler)` | Serveur HTTP |

### 12.4 Opérations de Base de Données

| Fonction | Description |
|----------|-------------|
| `mbula.connect(config)` | Connexion DB |
| `mbula.query(sql)` | Exécuter requête |

---

## 13. Conventions de Nommage

### 13.1 Variables

- **camelCase** pour les variables locales
- **PascalCase** pour les classes
- **UPPER_CASE** pour les constantes

```lingala
tanga maVariable = 10;
tanga MA_CONSTANTE = 3.14;
klasi MaClasi banda
}
```

### 13.2 Fonctions

- **camelCase** pour les fonctions

```lingala
mosala calculerSomme() banda
}
```

### 13.3 Fichiers

- **kebab-case** pour les noms de fichiers

```
mon-script.lingala
module-api.lingala
```

---

## 14. Sémantique

### 14.1 Portée (Scope)

Les variables ont une portée de bloc (block scope).

```lingala
soki ok banda
  tanga x = 10;
}
elobi(x);  // Erreur: x n'est pas défini
```

### 14.2 Hoisting

Les déclarations de variables et de fonctions sont hissées (hoisted).

```lingala
elobi(x);  // undefined (pas d'erreur)
tanga x = 10;

maFonction();  // Fonctionne
mosala maFonction() banda
  elobi("Bonjour");
}
```

### 14.3 Closures

Les fonctions conservent l'accès aux variables de leur portée parente.

```lingala
mosala creerCompteur() banda
  tanga compteur = 0;
  zonga function() banda
    compteur = compteur + 1;
    zonga compteur;
  };
}

tanga compteur1 = creerCompteur();
tanga compteur2 = creerCompteur();
```

### 14.4 This

`this` fait référence à l'instance de l'objet dans les méthodes.

```lingala
klasi Muntu banda
  mbotaka nom banda
    nom = nom;
  }

  mosala saluer() banda
    elobi("Je suis " + nom);
  }
}
```

---

## 15. Annexes

### 15.1 Grammaire BNF

```
<program> ::= <statement>*

<statement> ::= <variable_declaration>
             | <function_declaration>
             | <class_declaration>
             | <if_statement>
             | <while_statement>
             | <for_statement>
             | <return_statement>
             | <expression_statement>

<variable_declaration> ::= "tanga" <identifier> [ "mboka" <type> ] "=" <expression> ";"

<function_declaration> ::= "mosala" <identifier> "(" [ <parameter_list> ] ")" [ "mboka" <type> ] "banda" <block>

<parameter_list> ::= <parameter> ( "," <parameter> )*

<parameter> ::= <identifier> [ "mboka" <type> ]

<block> ::= "{" <statement>* "}"

<if_statement> ::= "soki" "(" <expression> ")" "banda" <block> [ "else" "{" <block> "}" ]

<while_statement> ::= "tantike" "(" <expression> ")" "banda" <block>

<for_statement> ::= "mpo na moko na moko" "(" <identifier> "mboka" <type> ")" "banda" <block>

<expression> ::= <assignment_expression>

<assignment_expression> ::= <logical_or_expression> [ "=" <assignment_expression> ]

<logical_or_expression> ::= <logical_and_expression> ( "||" <logical_and_expression> )*

<logical_and_expression> ::= <equality_expression> ( "&&" <equality_expression> )*

<equality_expression> ::= <comparison_expression> ( "==" | "!=" | "===" | "!==" <comparison_expression> )*

<comparison_expression> ::= <additive_expression> ( "<" | ">" | "<=" | ">=" <additive_expression> )*

<additive_expression> ::= <multiplicative_expression> ( "+" | "-" <multiplicative_expression> )*

<multiplicative_expression> ::= <unary_expression> ( "*" | "/" | "%" <unary_expression> )*

<unary_expression> ::= ( "!" | "-" ) <unary_expression> | <primary_expression>

<primary_expression> ::= <literal>
                        | <identifier>
                        | "(" <expression> ")"
                        | <call_expression>
                        | <array_expression>
                        | <object_expression>

<literal> ::= <number_literal> | <string_literal> | <boolean_literal>

<boolean_literal> ::= "ok" | "te"

<type> ::= "Number" | "String" | "Boolean" | "Array" | "Object" | "Any" | "Void" | "Null"
```

### 15.2 Tableau des Priorités

| Priorité | Opérateurs | Associativité |
|----------|-----------|---------------|
| 1 | `,` | Gauche à droite |
| 2 | `||` | Gauche à droite |
| 3 | `&&` | Gauche à droite |
| 4 | `==`, `!=`, `===`, `!==`, `<`, `>`, `<=`, `>=` | Gauche à droite |
| 5 | `+`, `-` | Gauche à droite |
| 6 | `*`, `/`, `%` | Gauche à droite |
| 7 | `**`, `!`, `-` (unaire) | Droite à gauche |
| 8 | `()`, `[]`, `.` | Gauche à droite |

### 15.3 Mots-clés Réservés (Futur)

Les mots-clés suivants sont réservés pour une utilisation future :

- `await`
- `async`
- `class` (alternative à `klasi`)
- `const` (alternative à `tanga`)
- `let` (alternative à `tanga`)
- `interface`
- `type`
- `enum`
- `implements`
- `extends` (alternative à l'héritage implicite)
- `super`
- `static`
- `public`
- `private`
- `protected`
- `abstract`
- `final`

---

## Historique des Révisions

| Version | Date | Auteur | Description |
|---------|------|--------|-------------|
| 1.0.0 | 2024 | Équipe LingalaAutomation | Première version officielle |

---

**Fin de la Spécification** 🚀🇨🇩
