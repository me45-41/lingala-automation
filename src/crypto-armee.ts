/**
 * Bibliothèque de Cryptographie - LingalaAutomation
 * Module spécialisé pour la sécurité et la défense nationale
 * Version : 1.0.0
 */

import * as crypto from "crypto";

/**
 * Chiffrement AES-256 (Advanced Encryption Standard)
 * Chiffrement symétrique pour les communications et fichiers
 */
export class CrypteurAES {
  private algorithme: string = "aes-256-cbc";
  private cle: Buffer;

  constructor(cle: string | Buffer) {
    // La clé doit être de 32 octets pour AES-256
    if (typeof cle === "string") {
      this.cle = crypto.scryptSync(cle, "salt-armee", 32);
    } else {
      this.cle = cle;
    }
  }

  /**
   * Chiffre des données avec AES-256
   */
  chiffrer(donnees: string | Buffer): { chiffre: string; iv: string } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(this.algorithme, this.cle, iv);
    
    let chiffre: Buffer;
    if (typeof donnees === "string") {
      chiffre = Buffer.concat([cipher.update(donnees, "utf8"), cipher.final()]);
    } else {
      chiffre = Buffer.concat([cipher.update(donnees), cipher.final()]);
    }

    return {
      chiffre: chiffre.toString("base64"),
      iv: iv.toString("base64")
    };
  }

  /**
   * Déchiffre des données chiffrées avec AES-256
   */
  dechiffrer(chiffre: string, iv: string): string {
    const decipher = crypto.createDecipheriv(
      this.algorithme,
      this.cle,
      Buffer.from(iv, "base64")
    );

    const dechiffre = Buffer.concat([
      decipher.update(Buffer.from(chiffre, "base64")),
      decipher.final()
    ]);

    return dechiffre.toString("utf8");
  }

  /**
   * Chiffre un fichier
   */
  chiffrerFichier(cheminEntree: string, cheminSortie: string): void {
    const fs = require("fs");
    const donnees = fs.readFileSync(cheminEntree);
    const resultat = this.chiffrer(donnees);
    
    const contenuSortie = JSON.stringify({
      chiffre: resultat.chiffre,
      iv: resultat.iv,
      algorithme: this.algorithme
    });

    fs.writeFileSync(cheminSortie, contenuSortie);
  }

  /**
   * Déchiffre un fichier
   */
  dechiffrerFichier(cheminEntree: string, cheminSortie: string): void {
    const fs = require("fs");
    const contenu = JSON.parse(fs.readFileSync(cheminEntree, "utf8"));
    const dechiffre = this.dechiffrer(contenu.chiffre, contenu.iv);
    fs.writeFileSync(cheminSortie, dechiffre);
  }
}

/**
 * Chiffrement RSA (Rivest-Shamir-Adleman)
 * Chiffrement asymétrique pour l'échange de clés et signatures
 */
export class CrypteurRSA {
  private clePrivee: crypto.KeyObject;
  private clePublique: crypto.KeyObject;

  constructor(tailleBits: number = 4096) {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: tailleBits
    });

    this.clePublique = publicKey;
    this.clePrivee = privateKey;
  }

  /**
   * Crée un CrypteurRSA à partir de clés existantes
   */
  static depuisCles(clePubliquePEM: string, clePriveePEM: string): CrypteurRSA {
    const instance = new CrypteurRSA(4096);
    instance.clePublique = crypto.createPublicKey(clePubliquePEM);
    instance.clePrivee = crypto.createPrivateKey(clePriveePEM);
    return instance;
  }

  /**
   * Chiffre des données avec RSA
   */
  chiffrer(donnees: string): string {
    const chiffre = crypto.publicEncrypt(
      {
        key: this.clePublique,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256"
      },
      Buffer.from(donnees, "utf8")
    );

    return chiffre.toString("base64");
  }

  /**
   * Déchiffre des données avec RSA
   */
  dechiffrer(chiffre: string): string {
    const dechiffre = crypto.privateDecrypt(
      {
        key: this.clePrivee,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha256"
      },
      Buffer.from(chiffre, "base64")
    );

    return dechiffre.toString("utf8");
  }

  /**
   * Signe des données
   */
  signer(donnees: string): string {
    const signature = crypto.sign(
      "sha256",
      Buffer.from(donnees, "utf8"),
      {
        key: this.clePrivee,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING
      }
    );

    return signature.toString("base64");
  }

  /**
   * Vérifie une signature
   */
  verifierSignature(donnees: string, signature: string): boolean {
    try {
      return crypto.verify(
        "sha256",
        Buffer.from(donnees, "utf8"),
        {
          key: this.clePublique,
          padding: crypto.constants.RSA_PKCS1_PSS_PADDING
        },
        Buffer.from(signature, "base64")
      );
    } catch {
      return false;
    }
  }

  /**
   * Exporte la clé publique en PEM
   */
  exporterClePublique(): string {
    return this.clePublique.export({ type: "spki", format: "pem" }) as string;
  }

  /**
   * Exporte la clé privée en PEM
   */
  exporterClePrivee(): string {
    return this.clePrivee.export({ type: "pkcs8", format: "pem" }) as string;
  }
}

/**
 * Fonctions de Hash Cryptographique
 * SHA-256, SHA-512 pour l'intégrité et les empreintes
 */
export class HashCryptographique {
  /**
   * Génère un hash SHA-256
   */
  static sha256(donnees: string | Buffer): string {
    return crypto
      .createHash("sha256")
      .update(typeof donnees === "string" ? donnees : donnees)
      .digest("hex");
  }

  /**
   * Génère un hash SHA-512
   */
  static sha512(donnees: string | Buffer): string {
    return crypto
      .createHash("sha512")
      .update(typeof donnees === "string" ? donnees : donnees)
      .digest("hex");
  }

  /**
   * Génère un hash d'un fichier
   */
  static hashFichier(chemin: string, algorithme: "sha256" | "sha512" = "sha256"): string {
    const fs = require("fs");
    const contenu = fs.readFileSync(chemin);
    return algorithme === "sha256" ? this.sha256(contenu) : this.sha512(contenu);
  }

  /**
   * Vérifie l'intégrité de données
   */
  static verifierIntegrite(donnees: string | Buffer, hashAttendu: string): boolean {
    const hashCalcule = this.sha256(donnees);
    return hashCalcule === hashAttendu;
  }

  /**
   * Génère un HMAC (Hash-based Message Authentication Code)
   */
  static hmac(donnees: string, cle: string): string {
    return crypto
      .createHmac("sha256", cle)
      .update(donnees)
      .digest("hex");
  }

  /**
   * Vérifie un HMAC
   */
  static verifierHMAC(donnees: string, cle: string, hmacAttendu: string): boolean {
    const hmacCalcule = this.hmac(donnees, cle);
    return hmacCalcule === hmacAttendu;
  }
}

/**
 * Générateur de Mots de Passe Sécurisés
 */
export class GenerateurMotDePasse {
  static generer(longueur: number = 32): string {
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    let motDePasse = "";
    
    for (let i = 0; i < longueur; i++) {
      motDePasse += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }

    return motDePasse;
  }

  static genererCleHex(longueur: number = 64): string {
    return crypto.randomBytes(longueur).toString("hex");
  }

  static genererCleBase64(longueur: number = 48): string {
    return crypto.randomBytes(longueur).toString("base64");
  }
}

/**
 * Fonctions utilitaires pour la cryptographie
 */
export const CryptoUtils = {
  /**
   * Échange de clés Diffie-Hellman
   */
  echangeClesDiffieHellman(clePubliquePartenaire: string): { clePartage: string; clePublique: string } {
    const dh = crypto.createDiffieHellman(2048);
    const clePublique = dh.generateKeys().toString("hex");
    const clePartage = dh.computeSecret(clePubliquePartenaire, "hex", "hex");

    return { clePartage, clePublique };
  },

  /**
   * Génération de nombres aléatoires cryptographiquement sécurisés
   */
  nombreAleatoire(min: number, max: number): number {
    const range = max - min + 1;
    const bytes = crypto.randomBytes(4);
    const random = bytes.readUInt32BE(0) / 0xFFFFFFFF;
    return Math.floor(random * range) + min;
  },

  /**
   * Génération de bytes aléatoires
   */
  bytesAleatoires(longueur: number): Buffer {
    return crypto.randomBytes(longueur);
  }
};

/**
 * Fonctions d'export pour faciliter l'import
 */
export const crypterAES = (cle: string | Buffer) => new CrypteurAES(cle);
export const crypterRSA = (taille?: number) => new CrypteurRSA(taille);
export const genererHash = HashCryptographique.sha256;
export const verifierHash = HashCryptographique.verifierIntegrite;
export const genererMotDePasse = GenerateurMotDePasse.generer;
export const genererCle = GenerateurMotDePasse.genererCleHex;
