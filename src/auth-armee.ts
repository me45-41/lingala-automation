/**
 * Bibliothèque d'Authentification - LingalaAutomation
 * Module spécialisé pour la sécurité et la défense nationale
 * Version : 1.0.0
 */

import * as crypto from "crypto";
import { CrypteurRSA, GenerateurMotDePasse } from "./crypto-armee.js";

/**
 * Interface Utilisateur
 */
interface Utilisateur {
  id: string;
  nom: string;
  identifiant: string;
  motDePasseHash: string;
  role: string;
  permissions: string[];
  cle2FA?: string;
  actif: boolean;
  derniereConnexion?: Date;
}

/**
 * Interface Session
 */
interface Session {
  id: string;
  utilisateurId: string;
  token: string;
  creeA: Date;
  expireA: Date;
  ip?: string;
  appareil?: string;
}

/**
 * Gestionnaire MFA (Multi-Factor Authentication)
 * Authentification à deux facteurs avec TOTP/HOTP
 */
export class GestionnaireMFA {
  private secrets: Map<string, string> = new Map();

  /**
   * Génère un secret pour TOTP
   */
  genererSecretTOTP(): string {
    const secret = crypto.randomBytes(20).toString("hex");
    return secret;
  }

  /**
   * Génère un code OTP à 6 chiffres
   */
  genererOTP(secret: string): string {
    const counter = Math.floor(Date.now() / 30000); // 30 secondes
    const hmac = crypto.createHmac("sha1", Buffer.from(secret, "hex"));
    hmac.update(Buffer.from(counter.toString().padStart(16, "0"), "hex"));
    const digest = hmac.digest();
    
    const offset = digest[digest.length - 1] & 0x0f;
    const code = ((digest[offset] & 0x7f) << 24 |
                 (digest[offset + 1] & 0xff) << 16 |
                 (digest[offset + 2] & 0xff) << 8 |
                 (digest[offset + 3] & 0xff)) % 1000000;
    
    return code.toString().padStart(6, "0");
  }

  /**
   * Vérifie un code OTP
   */
  verifierOTP(secret: string, code: string): boolean {
    // Vérifier le code actuel et le code précédent/ suivant (fenêtre de temps)
    for (let i = -1; i <= 1; i++) {
      const counter = Math.floor((Date.now() + i * 30000) / 30000);
      const hmac = crypto.createHmac("sha1", Buffer.from(secret, "hex"));
      hmac.update(Buffer.from(counter.toString().padStart(16, "0"), "hex"));
      const digest = hmac.digest();
      
      const offset = digest[digest.length - 1] & 0x0f;
      const expectedCode = ((digest[offset] & 0x7f) << 24 |
                         (digest[offset + 1] & 0xff) << 16 |
                         (digest[offset + 2] & 0xff) << 8 |
                         (digest[offset + 3] & 0xff)) % 1000000;
      
      if (code === expectedCode.toString().padStart(6, "0")) {
        return true;
      }
    }
    return false;
  }

  /**
   * Enregistre un secret pour un utilisateur
   */
  enregistrerSecret(utilisateurId: string, secret: string): void {
    this.secrets.set(utilisateurId, secret);
  }

  /**
   * Récupère le secret d'un utilisateur
   */
  recupererSecret(utilisateurId: string): string | undefined {
    return this.secrets.get(utilisateurId);
  }
}

/**
 * Gestionnaire RBAC (Role-Based Access Control)
 * Contrôle d'accès basé sur les rôles et permissions
 */
export class GestionnaireRBAC {
  private roles: Map<string, string[]> = new Map();
  private utilisateurs: Map<string, Utilisateur> = new Map();

  constructor() {
    this.initialiserRoles();
  }

  /**
   * Initialise les rôles par défaut
   */
  private initialiserRoles(): void {
    // Rôles pour la défense nationale
    this.roles.set("COMMANDANT", [
      "lecture_confidentielle",
      "modification_confidentielle",
      "suppression_confidentielle",
      "commandement_ops",
      "acces_total"
    ]);

    this.roles.set("OFFICIER", [
      "lecture_confidentielle",
      "modification_confidentielle",
      "rapport_ops"
    ]);

    this.roles.set("INTEL", [
      "lecture_confidentielle",
      "analyse_menaces",
      "rapport_intel"
    ]);

    this.roles.set("OPERATEUR", [
      "lecture_basique",
      "rapport_ops"
    ]);

    this.roles.set("ADMIN", [
      "lecture_confidentielle",
      "modification_confidentielle",
      "suppression_confidentielle",
      "gestion_utilisateurs",
      "gestion_roles",
      "acces_total"
    ]);
  }

  /**
   * Définit un rôle personnalisé
   */
  definirRole(nom: string, permissions: string[]): void {
    this.roles.set(nom, permissions);
  }

  /**
   * Ajoute une permission à un rôle
   */
  ajouterPermissionRole(nom: string, permission: string): void {
    const permissions = this.roles.get(nom) || [];
    permissions.push(permission);
    this.roles.set(nom, permissions);
  }

  /**
   * Enregistre un utilisateur
   */
  enregistrerUtilisateur(utilisateur: Utilisateur): void {
    this.utilisateurs.set(utilisateur.id, utilisateur);
  }

  /**
   * Vérifie si un utilisateur a une permission
   */
  verifierPermission(utilisateurId: string, permission: string): boolean {
    const utilisateur = this.utilisateurs.get(utilisateurId);
    if (!utilisateur || !utilisateur.actif) {
      return false;
    }

    const permissions = this.roles.get(utilisateur.role) || [];
    return permissions.includes(permission) || permissions.includes("acces_total");
  }

  /**
   * Vérifie si un utilisateur a toutes les permissions requises
   */
  verifierPermissions(utilisateurId: string, permissions: string[]): boolean {
    return permissions.every(perm => this.verifierPermission(utilisateurId, perm));
  }

  /**
   * Récupère les permissions d'un utilisateur
   */
  recupererPermissions(utilisateurId: string): string[] {
    const utilisateur = this.utilisateurs.get(utilisateurId);
    if (!utilisateur) {
      return [];
    }
    return this.roles.get(utilisateur.role) || [];
  }

  /**
   * Change le rôle d'un utilisateur
   */
  changerRole(utilisateurId: string, nouveauRole: string): boolean {
    const utilisateur = this.utilisateurs.get(utilisateurId);
    if (!utilisateur || !this.roles.has(nouveauRole)) {
      return false;
    }
    utilisateur.role = nouveauRole;
    this.utilisateurs.set(utilisateurId, utilisateur);
    return true;
  }
}

/**
 * Gestionnaire de Certificats X.509
 * Gestion PKI pour l'authentification forte
 */
export class GestionnaireCertificats {
  private caRSA: CrypteurRSA;

  constructor() {
    this.caRSA = new CrypteurRSA(4096);
  }

  /**
   * Génère un certificat X.509 auto-signé
   */
  genererCertificatAutoSigne(subject: {
    nomCommun: string;
    organisation: string;
    pays: string;
  }): { certificat: string; clePrivee: string } {
    const keyPair = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096
    });

    // Format PEM du certificat (simplifié - en production utiliser OpenSSL)
    const certPem = `-----BEGIN CERTIFICATE-----
${this.genererCertPEM(subject)}
-----END CERTIFICATE-----`;

    return {
      certificat: certPem,
      clePrivee: keyPair.privateKey.export({ format: "pem", type: "pkcs8" }) as string
    };
  }

  /**
   * Génère le contenu PEM d'un certificat (simplifié)
   */
  private genererCertPEM(subject: any): string {
    // En production, utiliser une vraie PKI comme OpenSSL
    // Ici on génère un format PEM basique
    const dateDebut = new Date().toISOString();
    const dateFin = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
    
    return `Version: 3
Serial Number: ${Date.now()}
Subject: CN=${subject.nomCommun}, O=${subject.organisation}, C=${subject.pays}
Issuer: CN=CA-RDC-DEFENSE, O=Ministère de la Défense, C=CD
Validity: ${dateDebut} - ${dateFin}
Key Usage: Digital Signature, Key Encipherment
Basic Constraints: CA:FALSE
SHA256 Fingerprint: ${crypto.randomBytes(32).toString("hex")}`;
  }

  /**
   * Vérifie un certificat
   */
  verifierCertificat(certificatPEM: string): boolean {
    try {
      const cert = new crypto.X509Certificate(certificatPEM);
      const now = new Date();
      const validFrom = new Date(cert.validFrom);
      const validTo = new Date(cert.validTo);
      
      return now >= validFrom && now <= validTo;
    } catch {
      return false;
    }
  }

  /**
   * Extrait les informations d'un certificat
   */
  extraireInfosCertificat(certificatPEM: string): any {
    try {
      const cert = new crypto.X509Certificate(certificatPEM);
      return {
        subject: cert.subject,
        issuer: cert.issuer,
        validFrom: cert.validFrom,
        validTo: cert.validTo,
        fingerprint: cert.fingerprint
      };
    } catch {
      return null;
    }
  }
}

/**
 * Système de Gestion des Clés (Key Management System)
 * Stockage sécurisé et rotation des clés
 */
export class GestionnaireCles {
  private vault: Map<string, { cle: string; creeA: Date; rotation: number }> = new Map();
  private cleMaitre: string;

  constructor() {
    this.cleMaitre = GenerateurMotDePasse.genererCleHex(64);
  }

  /**
   * Stocke une clé de manière sécurisée
   */
  stockerCle(id: string, cle: string): void {
    const cleChiffree = this.chiffrerCle(cle);
    this.vault.set(id, {
      cle: cleChiffree,
      creeA: new Date(),
      rotation: 0
    });
  }

  /**
   * Récupère une clé
   */
  recupererCle(id: string): string | null {
    const donnees = this.vault.get(id);
    if (!donnees) {
      return null;
    }
    return this.dechiffrerCle(donnees.cle);
  }

  /**
   * Supprime une clé
   */
  supprimerCle(id: string): boolean {
    return this.vault.delete(id);
  }

  /**
   * Fait une rotation de clé
   */
  rotationCle(id: string): string {
    const nouvelleCle = GenerateurMotDePasse.genererCleHex(32);
    this.stockerCle(id, nouvelleCle);
    return nouvelleCle;
  }

  /**
   * Chiffre une clé avec la clé maître
   */
  private chiffrerCle(cle: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(this.cleMaitre, "hex"), iv);
    const chiffre = Buffer.concat([cipher.update(cle, "utf8"), cipher.final()]);
    return iv.toString("hex") + ":" + chiffre.toString("hex");
  }

  /**
   * Déchiffre une clé avec la clé maître
   */
  private dechiffrerCle(cleChiffree: string): string {
    const [ivHex, chiffreHex] = cleChiffree.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const chiffre = Buffer.from(chiffreHex, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(this.cleMaitre, "hex"), iv);
    const dechiffre = Buffer.concat([decipher.update(chiffre), decipher.final()]);
    return dechiffre.toString("utf8");
  }

  /**
   * Liste toutes les clés
   */
  listerCles(): string[] {
    return Array.from(this.vault.keys());
  }

  /**
   * Récupère les métadonnées d'une clé
   */
  recupererMetadonnees(id: string): { creeA: Date; rotation: number } | null {
    const donnees = this.vault.get(id);
    if (!donnees) {
      return null;
    }
    return {
      creeA: donnees.creeA,
      rotation: donnees.rotation
    };
  }
}

/**
 * Système d'Authentification Complet
 */
export class SystemeAuthentification {
  private mfa: GestionnaireMFA;
  private rbac: GestionnaireRBAC;
  private certificats: GestionnaireCertificats;
  private kms: GestionnaireCles;
  private sessions: Map<string, Session> = new Map();

  constructor() {
    this.mfa = new GestionnaireMFA();
    this.rbac = new GestionnaireRBAC();
    this.certificats = new GestionnaireCertificats();
    this.kms = new GestionnaireCles();
  }

  /**
   * Enregistre un nouvel utilisateur
   */
  enregistrerUtilisateur(utilisateur: Omit<Utilisateur, "motDePasseHash">, motDePasse: string): Utilisateur {
    const hash = crypto.createHash("sha256").update(motDePasse).digest("hex");
    const utilisateurComplet: Utilisateur = {
      ...utilisateur,
      motDePasseHash: hash,
      actif: true
    };
    this.rbac.enregistrerUtilisateur(utilisateurComplet);
    return utilisateurComplet;
  }

  /**
   * Authentifie un utilisateur
   */
  authentifier(identifiant: string, motDePasse: string, code2FA?: string): { succes: boolean; session?: string; erreur?: string } {
    const utilisateur = Array.from(this.rbac["utilisateurs"].values()).find(u => u.identifiant === identifiant);
    
    if (!utilisateur) {
      return { succes: false, erreur: "Utilisateur introuvable" };
    }

    if (!utilisateur.actif) {
      return { succes: false, erreur: "Compte désactivé" };
    }

    const hash = crypto.createHash("sha256").update(motDePasse).digest("hex");
    if (hash !== utilisateur.motDePasseHash) {
      return { succes: false, erreur: "Mot de passe incorrect" };
    }

    // Vérifier 2FA si activé
    if (utilisateur.cle2FA && code2FA) {
      if (!this.mfa.verifierOTP(utilisateur.cle2FA, code2FA)) {
        return { succes: false, erreur: "Code 2FA incorrect" };
      }
    }

    // Créer une session
    const session = this.creerSession(utilisateur.id);
    return { succes: true, session: session.id };
  }

  /**
   * Active le 2FA pour un utilisateur
   */
  activer2FA(utilisateurId: string): string {
    const secret = this.mfa.genererSecretTOTP();
    this.mfa.enregistrerSecret(utilisateurId, secret);
    
    const utilisateur = this.rbac["utilisateurs"].get(utilisateurId);
    if (utilisateur) {
      utilisateur.cle2FA = secret;
      this.rbac.enregistrerUtilisateur(utilisateur);
    }

    return secret;
  }

  /**
   * Vérifie une session
   */
  verifierSession(sessionId: string): boolean {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return false;
    }

    if (new Date() > session.expireA) {
      this.sessions.delete(sessionId);
      return false;
    }

    return true;
  }

  /**
   * Révoque une session
   */
  revoquerSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  /**
   * Crée une nouvelle session
   */
  private creerSession(utilisateurId: string): Session {
    const sessionId = crypto.randomBytes(32).toString("hex");
    const session: Session = {
      id: sessionId,
      utilisateurId,
      token: crypto.randomBytes(32).toString("hex"),
      creeA: new Date(),
      expireA: new Date(Date.now() + 8 * 60 * 60 * 1000) // 8 heures
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Génère un certificat pour un utilisateur
   */
  genererCertificatUtilisateur(utilisateurId: string, subject: any): { certificat: string; clePrivee: string } {
    return this.certificats.genererCertificatAutoSigne(subject);
  }

  /**
   * Vérifie les permissions d'un utilisateur
   */
  verifierPermissions(utilisateurId: string, permissions: string[]): boolean {
    return this.rbac.verifierPermissions(utilisateurId, permissions);
  }

  /**
   * Stocke une clé dans le vault
   */
  stockerCle(id: string, cle: string): void {
    this.kms.stockerCle(id, cle);
  }

  /**
   * Récupère une clé du vault
   */
  recupererCle(id: string): string | null {
    return this.kms.recupererCle(id);
  }
}

/**
 * Fonctions d'export pour faciliter l'import
 */
export const genererOTP = (secret: string) => new GestionnaireMFA().genererOTP(secret);
export const verifierOTP = (secret: string, code: string) => new GestionnaireMFA().verifierOTP(secret, code);
export const verifierPermission = (utilisateurId: string, permission: string) => new GestionnaireRBAC().verifierPermission(utilisateurId, permission);
export const genererCertificat = (subject: any) => new GestionnaireCertificats().genererCertificatAutoSigne(subject);
