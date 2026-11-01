# Bibliothèque Crypto-Armee - Documentation

## 📋 Vue d'ensemble

La bibliothèque `crypto-armee` fournit des fonctionnalités cryptographiques avancées pour les applications de sécurité et défense nationale de la RDC.

## 🔐 Fonctionnalités

### 1. Chiffrement AES-256

Chiffrement symétrique pour les communications et fichiers sécurisés.

#### Utilisation

```lingala
sangisa { crypterAES } depuis "crypto-armee";

tanga crypteur = crypterAES("ma-cle-secrete");
tanga resultat = crypteur.chiffrer("Informations classifiées");
tanga dechiffre = crypteur.dechiffrer(resultat.chiffre, resultat.iv);
```

#### Méthodes

- `chiffrer(donnees)` - Chiffre des données
- `dechiffrer(chiffre, iv)` - Déchiffre des données
- `chiffrerFichier(entree, sortie)` - Chiffre un fichier
- `dechiffrerFichier(entree, sortie)` - Déchiffre un fichier

### 2. Chiffrement RSA-4096

Chiffrement asymétrique pour l'échange de clés et signatures numériques.

#### Utilisation

```lingala
sangisa { crypterRSA } depuis "crypto-armee";

tanga rsa = crypterRSA(4096);
tanga chiffre = rsa.chiffrer("Données sensibles");
tanga dechiffre = rsa.dechiffrer(chiffre);
tanga signature = rsa.signer("Document important");
tanga valide = rsa.verifierSignature("Document important", signature);
```

#### Méthodes

- `chiffrer(donnees)` - Chiffre avec clé publique
- `dechiffrer(chiffre)` - Déchiffre avec clé privée
- `signer(donnees)` - Signe des données
- `verifierSignature(donnees, signature)` - Vérifie une signature
- `exporterClePublique()` - Exporte la clé publique en PEM
- `exporterClePrivee()` - Exporte la clé privée en PEM

### 3. Hash Cryptographique

SHA-256 et SHA-512 pour l'intégrité et les empreintes numériques.

#### Utilisation

```lingala
sangisa { genererHash, verifierHash } depuis "crypto-armee";

tanga hash = genererHash("Données à hacher");
tanga valide = verifierHash("Données à hacher", hash);
```

#### Méthodes

- `sha256(donnees)` - Hash SHA-256
- `sha512(donnees)` - Hash SHA-512
- `hashFichier(chemin)` - Hash d'un fichier
- `verifierIntegrite(donnees, hash)` - Vérifie l'intégrité
- `hmac(donnees, cle)` - HMAC
- `verifierHMAC(donnees, cle, hmac)` - Vérifie un HMAC

### 4. Génération de Clés

Génération sécurisée de mots de passe et clés cryptographiques.

#### Utilisation

```lingala
sangisa { genererMotDePasse, genererCle } depuis "crypto-armee";

tanga motDePasse = genererMotDePasse(32);
tanga cle = genererCle(64);
```

#### Méthodes

- `generer(longueur)` - Génère un mot de passe sécurisé
- `genererCleHex(longueur)` - Génère une clé hexadécimale
- `genererCleBase64(longueur)` - Génère une clé base64

## 🎯 Cas d'Utilisation

### Sécurisation des Communications

```lingala
sangisa { crypterAES, crypterRSA } depuis "crypto-armee";

// Chiffrement hybride : RSA pour la clé de session, AES pour les données
tanga rsa = crypterRSA(4096);
tanga cleSession = genererCle(32);
tanga cleChiffree = rsa.chiffrer(cleSession);
tanga crypteur = crypterAES(cleSession);
tanga donneesChiffrees = crypteur.chiffrer("Message secret");
```

### Protection de Fichiers

```lingala
sangisa { crypterAES } depuis "crypto-armee";

tanga crypteur = crypterAES("cle-fichier-securise");
crypteur.chiffrerFichier("document.confidentiel.txt", "document.chiffre");
crypteur.dechiffrerFichier("document.chiffre", "document.dechiffre.txt");
```

### Signatures Numériques

```lingala
sangisa { crypterRSA } depuis "crypto-armee";

tanga rsa = crypterRSA(4096);
tanga document = "Ordre opérationnel #123";
tanga signature = rsa.signer(document);

// Vérification
tanga valide = rsa.verifierSignature(document, signature);
soki valide banda
  elobi("Signature valide - Document authentique");
}
```

### Vérification d'Intégrité

```lingala
sangisa { genererHash, verifierHash } depuis "crypto-armee";

tanga donnees = "Données importantes";
tanga hashOriginal = genererHash(donnees);

// Après transmission
tanga hashRecu = genererHash(donnees);
soki hashOriginal == hashRecu banda
  elobi("Intégrité vérifiée");
}
```

## ⚠️ Sécurité

### Bonnes Pratiques

1. **Ne jamais exposer les clés privées**
2. **Utiliser des clés suffisamment longues** (AES-256, RSA-4096)
3. **Rotation régulière des clés**
4. **Stockage sécurisé des clés** (vault, HSM)
5. **Validation des entrées**

### Recommandations

- Utiliser AES-256 pour le chiffrement de grandes quantités de données
- Utiliser RSA-4096 pour l'échange de clés et signatures
- Utiliser SHA-512 pour les empreintes critiques
- Stocker les clés dans un vault sécurisé
- Utiliser MFA pour l'accès aux clés

## 📚 Référence API

### CrypteurAES

```typescript
class CrypteurAES {
  constructor(cle: string | Buffer);
  chiffrer(donnees: string | Buffer): { chiffre: string; iv: string };
  dechiffrer(chiffre: string, iv: string): string;
  chiffrerFichier(entree: string, sortie: string): void;
  dechiffrerFichier(entree: string, sortie: string): void;
}
```

### CrypteurRSA

```typescript
class CrypteurRSA {
  constructor(tailleBits?: number);
  static depuisCles(clePubliquePEM: string, clePriveePEM: string): CrypteurRSA;
  chiffrer(donnees: string): string;
  dechiffrer(chiffre: string): string;
  signer(donnees: string): string;
  verifierSignature(donnees: string, signature: string): boolean;
  exporterClePublique(): string;
  exporterClePrivee(): string;
}
```

### HashCryptographique

```typescript
class HashCryptographique {
  static sha256(donnees: string | Buffer): string;
  static sha512(donnees: string | Buffer): string;
  static hashFichier(chemin: string, algorithme?: "sha256" | "sha512"): string;
  static verifierIntegrite(donnees: string | Buffer, hashAttendu: string): boolean;
  static hmac(donnees: string, cle: string): string;
  static verifierHMAC(donnees: string, cle: string, hmacAttendu: string): boolean;
}
```

### GenerateurMotDePasse

```typescript
class GenerateurMotDePasse {
  static generer(longueur?: number): string;
  static genererCleHex(longueur?: number): string;
  static genererCleBase64(longueur?: number): string;
}
```

## 🔮 Fonctionnalités Futures

- Chiffrement homomorphe
- Cryptographie post-quantique
- ZKP (Zero-Knowledge Proofs)
- MPC (Multi-Party Computation)
- Intégration HSM (Hardware Security Module)

---

**Crypto-Armee - Cryptographie pour la Défense Nationale** 🇨🇩🛡️
