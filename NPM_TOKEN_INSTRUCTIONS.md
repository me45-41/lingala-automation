# Instructions pour Publication npm avec 2FA

## ⚠️ Problème
Votre compte npm a la 2FA activée, ce qui empêche la publication en ligne de commande.

## ✅ Solution : Créer un Token avec Bypass 2FA

### Étape 1 : Créer un Token sur npmjs.com

1. Allez sur https://www.npmjs.com/settings/tokens
2. Cliquez sur "Create New Token"
3. Sélectionnez "Automation" (ce qui inclut le bypass 2FA)
4. Donnez un nom au token (ex: "LingalaAutomation Publish")
5. Cliquez sur "Create Token"
6. **COPIEZ IMMÉDIATEMENT LE TOKEN** (il ne sera affiché qu'une seule fois)

### Étape 2 : Ajouter le Token à votre configuration npm

Exécutez cette commande dans votre terminal :
```bash
npm config set //registry.npmjs.org/:_authToken <votre-token>
```

Remplacez `<votre-token>` par le token que vous avez copié.

### Étape 3 : Publier

Une fois le token configuré, exécutez :
```bash
cd E:/gestion/lingala-automation
npm publish
```

## 📊 État Actuel

**LingalaAutomation est prêt pour publication :**
- ✅ Package créé (`lingala-automation-1.0.0.tgz`)
- ✅ 34.9 kB, 25 fichiers
- ✅ Configuration npm complète
- ⚠️ Attente du token avec bypass 2FA

## 🎯 Une fois publié

Les développeurs pourront installer :
```bash
npm install -g lingala-automation
```

Et utiliser :
```bash
lingala mon-script.lingala
```
