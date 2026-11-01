# Bibliothèque Auth-Armee - Documentation

## 📋 Vue d'ensemble

La bibliothèque `auth-armee` fournit des fonctionnalités d'authentification et de gestion des identités pour les applications de sécurité et défense nationale de la RDC.

## 🔐 Fonctionnalités

### 1. MFA (Multi-Factor Authentication)

Authentification à deux facteurs avec TOTP (Time-based One-Time Password).

#### Utilisation

```lingala
sangisa { genererOTP, verifierOTP } depuis "auth-armee";

tanga secret = genererSecret("UTILISATEUR-123");
tanga code = genererOTP(secret);
tanga valide = verifierOTP(secret, code);
```

#### Méthodes

- `genererSecretTOTP()` - Génère un secret pour TOTP
- `genererOTP(secret)` - Génère un code OTP à 6 chiffres
- `verifierOTP(secret, code)` - Vérifie un code OTP
- `enregistrerSecret(utilisateurId, secret)` - Enregistre un secret
- `recupererSecret(utilisateurId)` - Récupère un secret

### 2. RBAC (Role-Based Access Control)

Contrôle d'accès basé sur les rôles et permissions.

#### Utilisation

```lingala
sangisa { verifierPermission, verifierPermissions } depuis "auth-armee";

tanga aAcces = verifierPermission("UTILISATEUR-123", "lecture_confidentielle");
tanga aAccesTotal = verifierPermissions("UTILISATEUR-123", ["lecture_confidentielle", "rapport_ops"]);
```

#### Rôles Prédéfinis

- **COMMANDANT** - Accès total, commandement opérations
- **OFFICIER** - Lecture/modification données confidentielles
- **INTEL** - Analyse de menaces, rapports intelligence
- **OPERATEUR** - Accès basique, rapports opérationnels
- **ADMIN** - Gestion utilisateurs, accès total

#### Méthodes

- `definirRole(nom, permissions)` - Définit un rôle personnalisé
- `ajouterPermissionRole(nom, permission)` - Ajoute une permission à un rôle
- `enregistrerUtilisateur(utilisateur)` - Enregistre un utilisateur
- `verifierPermission(utilisateurId, permission)` - Vérifie une permission
- `verifierPermissions(utilisateurId, permissions)` - Vérifie plusieurs permissions
- `changerRole(utilisateurId, nouveauRole)` - Change le rôle d'un utilisateur

### 3. Certificats X.509

Gestion PKI pour l'authentification forte avec certificats numériques.

#### Utilisation

```lingala
sangisa { genererCertificat } depuis "auth-armee";

tanga cert = genererCertificat({
  nomCommun: "Jean Mbemba",
  organisation: "Ministère de la Défense",
  pays: "CD"
});
```

#### Méthodes

- `genererCertificatAutoSigne(subject)` - Génère un certificat auto-signé
- `verifierCertificat(certificatPEM)` - Vérifie un certificat
- `extraireInfosCertificat(certificatPEM)` - Extrait les informations d'un certificat

### 4. Key Management System (KMS)

Stockage sécurisé et rotation des clés cryptographiques.

#### Utilisation

```lingala
sangisa { stockerCle, recupererCle } depuis "auth-armee";

stockerCle("cle-api", "ma-cle-secrete");
tanga cle = recupererCle("cle-api");
```

#### Méthodes

- `stockerCle(id, cle)` - Stocke une clé de manière sécurisée
- `recupererCle(id)` - Récupère une clé
- `supprimerCle(id)` - Supprime une clé
- `rotationCle(id)` - Fait une rotation de clé
- `listerCles()` - Liste toutes les clés
- `recupererMetadonnees(id)` - Récupère les métadonnées d'une clé

### 5. Système d'Authentification Complet

Système intégré combinant MFA, RBAC, certificats et KMS.

#### Utilisation

```lingala
sangisa { SystemeAuthentification } depuis "auth-armee";

tanga auth = nouveau SystemeAuthentification();

// Enregistrer un utilisateur
auth.enregistrerUtilisateur({
  id: "USR-001",
  nom: "Jean Mbemba",
  identifiant: "jmbemba",
  role: "OFFICIER",
  permissions: []
}, "motDePasseSecurite123!");

// Authentifier
tanga resultat = auth.authentifier("jmbemba", "motDePasseSecurite123!");
```

#### Méthodes

- `enregistrerUtilisateur(utilisateur, motDePasse)` - Enregistre un utilisateur
- `authentifier(identifiant, motDePasse, code2FA)` - Authentifie un utilisateur
- `activer2FA(utilisateurId)` - Active le 2FA pour un utilisateur
- `verifierSession(sessionId)` - Vérifie une session
- `revoquerSession(sessionId)` - Révoque une session
- `genererCertificatUtilisateur(utilisateurId, subject)` - Génère un certificat
- `verifierPermissions(utilisateurId, permissions)` - Vérifie les permissions

## 🎯 Cas d'Utilisation

### Authentification avec 2FA

```lingala
sangisa { SystemeAuthentification } depuis "auth-armee";

tanga auth = nouveau SystemeAuthentification();

// Enregistrer et activer 2FA
auth.enregistrerUtilisateur({
  id: "AGENT-007",
  nom: "Agent Secret",
  identifiant: "agent007",
  role: "INTEL",
  permissions: []
}, "motDePasseUltraSecurite!");

tanga secret2FA = auth.activer2FA("AGENT-007");
elobi("Secret 2FA : " + secret2FA);

// Authentifier avec 2FA
tanga resultat = auth.authentifier("agent007", "motDePasseUltraSecurite!", "123456");
```

### Contrôle d'Accès par Rôle

```lingala
sangisa { SystemeAuthentification } depuis "auth-armee";

tanga auth = nouveau SystemeAuthentification();

// Définir un rôle personnalisé
auth.rbac.definirRole("MEDECIN_MILITAIRE", [
  "lecture_dossiers_patients",
  "modification_prescriptions",
  "rapport_medical"
]);

// Vérifier les permissions
tanga peutLire = auth.verifierPermissions("MEDECIN-001", ["lecture_dossiers_patients"]);
```

### Certificats pour Authentification Forte

```lingala
sangisa { SystemeAuthentification } depuis "auth-armee";

tanga auth = nouveau SystemeAuthentification();

tanga cert = auth.genererCertificatUtilisateur("OPERATEUR-001", {
  nomCommun: "Opérateur Alpha",
  organisation: "Unité Spéciale",
  pays: "CD"
});

elobi("Certificat généré : " + cert.certificat);
elobi("Clé privée : " + cert.clePrivee);
```

### Vault de Clés Sécurisé

```lingala
sangisa { SystemeAuthentification } depuis "auth-armee";

tanga auth = nouveau SystemeAuthentification();

// Stocker des clés API
auth.stockerCle("api-secrete", "sk_live_xxxxxxxxxxxxxx");
auth.stockerCle("db-password", "motdepasse-db-secure");

// Récupérer les clés
tanga cleAPI = auth.recupererCle("api-secrete");
tanga cleDB = auth.recupererCle("db-password");
```

## ⚠️ Sécurité

### Bonnes Pratiques

1. **Toujours utiliser le 2FA** pour les comptes sensibles
2. **Rotation régulière des clés** (tous les 90 jours)
3. **Principe du moindre privilège** - donner le minimum de permissions
4. **Audit des accès** - logger toutes les authentifications
5. **Révocation automatique** des sessions inactives

### Recommandations

- Utiliser des mots de passe forts (minimum 16 caractères)
- Activer le 2FA pour tous les utilisateurs avec accès sensibles
- Révoquer les sessions après inactivité prolongée
- Rotation automatique des clés cryptographiques
- Stocker les clés dans un HSM (Hardware Security Module) pour la production

## 📚 Référence API

### GestionnaireMFA

```typescript
class GestionnaireMFA {
  genererSecretTOTP(): string;
  genererOTP(secret: string): string;
  verifierOTP(secret: string, code: string): boolean;
  enregistrerSecret(utilisateurId: string, secret: string): void;
  recupererSecret(utilisateurId: string): string | undefined;
}
```

### GestionnaireRBAC

```typescript
class GestionnaireRBAC {
  definirRole(nom: string, permissions: string[]): void;
  ajouterPermissionRole(nom: string, permission: string): void;
  enregistrerUtilisateur(utilisateur: Utilisateur): void;
  verifierPermission(utilisateurId: string, permission: string): boolean;
  verifierPermissions(utilisateurId: string, permissions: string[]): boolean;
  changerRole(utilisateurId: string, nouveauRole: string): boolean;
}
```

### GestionnaireCertificats

```typescript
class GestionnaireCertificats {
  genererCertificatAutoSigne(subject: Subject): { certificat: string; clePrivee: string };
  verifierCertificat(certificatPEM: string): boolean;
  extraireInfosCertificat(certificatPEM: string): any;
}
```

### GestionnaireCles

```typescript
class GestionnaireCles {
  stockerCle(id: string, cle: string): void;
  recupererCle(id: string): string | null;
  supprimerCle(id: string): boolean;
  rotationCle(id: string): string;
  listerCles(): string[];
  recupererMetadonnees(id: string): { creeA: Date; rotation: number } | null;
}
```

### SystemeAuthentification

```typescript
class SystemeAuthentification {
  enregistrerUtilisateur(utilisateur: Partial<Utilisateur>, motDePasse: string): Utilisateur;
  authentifier(identifiant: string, motDePasse: string, code2FA?: string): ResultatAuth;
  activer2FA(utilisateurId: string): string;
  verifierSession(sessionId: string): boolean;
  revoquerSession(sessionId: string): boolean;
  genererCertificatUtilisateur(utilisateurId: string, subject: any): Certificat;
  verifierPermissions(utilisateurId: string, permissions: string[]): boolean;
  stockerCle(id: string, cle: string): void;
  recupererCle(id: string): string | null;
}
```

## 🔮 Fonctionnalités Futures

- Biometrique (empreintes, reconnaissance faciale)
- SSO (Single Sign-On)
- OAuth 2.0 / OpenID Connect
- SAML 2.0
- Hardware Security Module (HSM) integration
- Blockchain pour l'audit des identités

---

**Auth-Armee - Authentification pour la Défense Nationale** 🇨🇩🛡️
