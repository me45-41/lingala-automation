# Exemples LingalaAutomation

## Automatisation
```lingala
kosala("test.txt", "Bonjour")
luka("test.txt")
```

## Web
```lingala
kokota("h1", "Mbote")
langi("body", "#333")
```

## Classes
```lingala
klasi Muntu banda
  mbotaka kombo banda
    kombo = kombo
  susa
susa
```

## Héritage
```lingala
klasi Etudiant bika Muntu banda
  mbotaka kombo, filiere banda
    super(kombo)
    filiere = filiere
  susa
susa
```

## Modules
```lingala
kokota {saluer} na "./module.lingala"
saluer("Jean")
```

## Exceptions
```lingala
essayer banda
    sangisa("Erreur")
kanga erreur banda
    elobi erreur.message
```

## Base de données
```lingala
tanga db = database.kokangisa("test.db")
database.kokotaLibanga(db, "utilisateurs", "id INTEGER, nom TEXT")
```

## Templates
```lingala
tanga tpl = templates.Kinongo.kobima("<h1>{{titre}}</h1>")
tpl.ekokele("titre", "Mbote")
```
