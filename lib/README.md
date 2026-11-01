# Bibliothèques LingalaAutomation

## lib-mongo.lingala
Bibliothèque de chaînes de caractères.

**Fonctions :**
- `kofuta(mongo)` - Longueur de la chaîne
- `kokotaMbote(mongo, sousMongo)` - Vérifie si contient
- `kobongolaKombo(mongo, vieux, nouveau)` - Remplace
- `koyombaMonene(mongo)` - Majuscules
- `koyombaMoke(mongo)` - Minuscules
- `kokotaSe(mongo)` - Supprime les espaces
- `kobimbisa(mongo, separateur)` - Sépare

**Utilisation :**
```lingala
kokota {kofuta, kobongolaKombo} na "../lib/lib-mongo.lingala"
elobi kofuta("Bonjour")
```

## Créer votre propre bibliothèque

1. Créez un fichier dans `lib/`
2. Utilisez `salisa mosala` pour exporter les fonctions
3. Importez avec `kokota {fonction} na "../lib/nom.lingala"`
