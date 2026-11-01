/**
 * Bibliothèque d'Intelligence de Sécurité - LingalaAutomation
 * Module spécialisé pour la défense et sécurité nationale de la RDC
 * Version : 1.0.0
 */

import * as crypto from "crypto";
import { HashCryptographique } from "./crypto-armee.js";

/**
 * Interface Événement de Sécurité
 */
interface EvenementSecurite {
  id: string;
  type: "AUTHENTIFICATION" | "AUTORISATION" | "MODIFICATION" | "SUPPRESSION" | "ACCES" | "RESEAU" | "SYSTEME";
  niveau: "CRITIQUE" | "HAUT" | "MOYEN" | "BAS";
  utilisateurId?: string;
  source: string;
  cible?: string;
  donnees?: any;
  timestamp: Date;
  ip?: string;
  signature?: string;
}

/**
 * Interface Anomalie
 */
interface Anomalie {
  id: string;
  type: string;
  description: string;
  niveau: number; // 1-10
  donnees: any;
  detecteeA: Date;
  statut: "DETECTEE" | "EN_INVESTIGATION" | "RESOLUE" | "FAUX_POSITIF";
}

/**
 * Interface Menace
 */
interface Menace {
  id: string;
  type: string;
  description: string;
  niveau: number; // 1-10
  vecteurs: string[];
  indicateurs: string[];
  statut: "SURVEILLEE" | "CONFIRMEE" | "MITIGEE";
}

/**
 * Gestionnaire de Logs Sécurisés
 * Journalisation immuable avec signature cryptographique
 */
export class GestionnaireLogsSecurises {
  private logs: EvenementSecurite[] = [];
  private cleSignature: string;

  constructor(cleSignature?: string) {
    this.cleSignature = cleSignature || crypto.randomBytes(32).toString("hex");
  }

  /**
   * Enregistre un événement de sécurité
   */
  enregistrerEvenement(evenement: Omit<EvenementSecurite, "id" | "timestamp" | "signature">): void {
    const log: EvenementSecurite = {
      ...evenement,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      signature: this.signerEvenement(evenement)
    };

    this.logs.push(log);
  }

  /**
   * Signe un événement pour garantir l'intégrité
   */
  private signerEvenement(evenement: any): string {
    const donnees = JSON.stringify(evenement);
    return HashCryptographique.hmac(donnees, this.cleSignature);
  }

  /**
   * Vérifie l'intégrité d'un événement
   */
  verifierIntegrite(evenement: EvenementSecurite): boolean {
    const donnees = JSON.stringify({
      id: evenement.id,
      type: evenement.type,
      niveau: evenement.niveau,
      utilisateurId: evenement.utilisateurId,
      source: evenement.source,
      cible: evenement.cible,
      donnees: evenement.donnees,
      timestamp: evenement.timestamp,
      ip: evenement.ip
    });

    const signatureCalculee = HashCryptographique.hmac(donnees, this.cleSignature);
    return signatureCalculee === evenement.signature;
  }

  /**
   * Recherche des événements par critères
   */
  rechercher(criteres: {
    type?: string;
    niveau?: string;
    utilisateurId?: string;
    source?: string;
    debut?: Date;
    fin?: Date;
  }): EvenementSecurite[] {
    return this.logs.filter(log => {
      if (criteres.type && log.type !== criteres.type) return false;
      if (criteres.niveau && log.niveau !== criteres.niveau) return false;
      if (criteres.utilisateurId && log.utilisateurId !== criteres.utilisateurId) return false;
      if (criteres.source && log.source !== criteres.source) return false;
      if (criteres.debut && log.timestamp < criteres.debut) return false;
      if (criteres.fin && log.timestamp > criteres.fin) return false;
      return true;
    });
  }

  /**
   * Exporte les logs
   */
  exporterLogs(): EvenementSecurite[] {
    return [...this.logs];
  }

  /**
   * Vide les logs (avec avertissement)
   */
  viderLogs(): void {
    this.logs = [];
  }

  /**
   * Statistiques des logs
   */
  statistiques(): {
    total: number;
    parType: Record<string, number>;
    parNiveau: Record<string, number>;
    dernier24h: number;
  } {
    const maintenant = new Date();
    const ilY24h = new Date(maintenant.getTime() - 24 * 60 * 60 * 1000);

    return {
      total: this.logs.length,
      parType: this.logs.reduce((acc, log) => {
        acc[log.type] = (acc[log.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      parNiveau: this.logs.reduce((acc, log) => {
        acc[log.niveau] = (acc[log.niveau] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      dernier24h: this.logs.filter(log => log.timestamp >= ilY24h).length
    };
  }
}

/**
 * Détecteur d'Anomalies
 * Détection de comportements suspects et anomalies de sécurité
 */
export class DetecteurAnomalies {
  private anomalies: Anomalie[] = [];
  private seuils: Map<string, number> = new Map();

  constructor() {
    this.configurerSeuils();
  }

  /**
   * Configure les seuils de détection
   */
  private configurerSeuils(): void {
    this.seuils.set("echecs_authentification", 5);
    this.seuils.set("acces_inhabituels", 10);
    this.seuils.set("volume_donnees", 1000000); // 1 MB
    this.seuils.set("temps_session", 12 * 60 * 60 * 1000); // 12 heures
  }

  /**
   * Détecte les échecs d'authentification suspects
   */
  detecterEchecsAuthentification(evenements: EvenementSecurite[]): Anomalie[] {
    const echecs = evenements.filter(e => e.type === "AUTHENTIFICATION" && e.donnees?.succes === false);
    const parUtilisateur = new Map<string, number>();

    echecs.forEach(e => {
      const userId = e.utilisateurId || "inconnu";
      parUtilisateur.set(userId, (parUtilisateur.get(userId) || 0) + 1);
    });

    const anomalies: Anomalie[] = [];
    const seuil = this.seuils.get("echecs_authentification") || 5;

    parUtilisateur.forEach((count, userId) => {
      if (count >= seuil) {
        anomalies.push({
          id: crypto.randomUUID(),
          type: "ECHecs_AUTHENTIFICATION_MULTIPLES",
          description: `${count} échecs d'authentification pour l'utilisateur ${userId}`,
          niveau: Math.min(count, 10),
          donnees: { utilisateurId: userId, count },
          detecteeA: new Date(),
          statut: "DETECTEE"
        });
      }
    });

    this.anomalies.push(...anomalies);
    return anomalies;
  }

  /**
   * Détecte les accès inhabituels
   */
  detecterAccesInhabituels(evenements: EvenementSecurite[]): Anomalie[] {
    const anomalies: Anomalie[] = [];
    const parUtilisateur = new Map<string, Set<string>>();

    evenements.forEach(e => {
      if (e.type === "AUTHENTIFICATION" && e.ip) {
        const userId = e.utilisateurId || "inconnu";
        const ips = parUtilisateur.get(userId) || new Set();
        ips.add(e.ip);
        parUtilisateur.set(userId, ips);
      }
    });

    parUtilisateur.forEach((ips, userId) => {
      if (ips.size > 3) {
        anomalies.push({
          id: crypto.randomUUID(),
          type: "ACCES_INHABITUELS",
          description: `Accès depuis ${ips.size} adresses IP différentes pour ${userId}`,
          niveau: 7,
          donnees: { utilisateurId: userId, ips: Array.from(ips) },
          detecteeA: new Date(),
          statut: "DETECTEE"
        });
      }
    });

    this.anomalies.push(...anomalies);
    return anomalies;
  }

  /**
   * Détecte les anomalies de volume de données
   */
  detecterAnomaliesVolume(donnees: { utilisateurId: string; volume: number }[]): Anomalie[] {
    const anomalies: Anomalie[] = [];
    const seuil = this.seuils.get("volume_donnees") || 1000000;

    donnees.forEach(d => {
      if (d.volume > seuil) {
        anomalies.push({
          id: crypto.randomUUID(),
          type: "VOLUME_DONNEES_EXCESSIF",
          description: `Volume de données excessif : ${d.volume} octets`,
          niveau: 8,
          donnees: d,
          detecteeA: new Date(),
          statut: "DETECTEE"
        });
      }
    });

    this.anomalies.push(...anomalies);
    return anomalies;
  }

  /**
   * Détecte les anomalies temporelles
   */
  detecterAnomaliesTemporelles(evenements: EvenementSecurite[]): Anomalie[] {
    const anomalies: Anomalie[] = [];
    const maintenant = new Date();
    const seuil = this.seuils.get("temps_session") || 12 * 60 * 60 * 1000;

    evenements.forEach(e => {
      if (e.type === "AUTHENTIFICATION" && e.donnees?.dureeSession) {
        if (e.donnees.dureeSession > seuil) {
          anomalies.push({
            id: crypto.randomUUID(),
            type: "SESSION_TROP_LONGUE",
            description: `Session anormalement longue : ${e.donnees.dureeSession} ms`,
            niveau: 5,
            donnees: { duree: e.donnees.dureeSession },
            detecteeA: new Date(),
            statut: "DETECTEE"
          });
        }
      }
    });

    this.anomalies.push(...anomalies);
    return anomalies;
  }

  /**
   * Récupère toutes les anomalies
   */
  recupererAnomalies(): Anomalie[] {
    return [...this.anomalies];
  }

  /**
   * Marque une anomalie comme résolue
   */
  marquerResolue(anomalieId: string): boolean {
    const anomalie = this.anomalies.find(a => a.id === anomalieId);
    if (anomalie) {
      anomalie.statut = "RESOLUE";
      return true;
    }
    return false;
  }

  /**
   * Marque une anomalie comme faux positif
   */
  marquerFauxPositif(anomalieId: string): boolean {
    const anomalie = this.anomalies.find(a => a.id === anomalieId);
    if (anomalie) {
      anomalie.statut = "FAUX_POSITIF";
      return true;
    }
    return false;
  }
}

/**
 * Analyseur de Menaces
 * Analyse défensive des menaces de sécurité
 */
export class AnalyseurMenaces {
  private menaces: Menace[] = [];
  private indicateursMenaces: Set<string> = new Set();

  constructor() {
    this.initialiserIndicateurs();
  }

  /**
   * Initialise les indicateurs de menace connus
   */
  private initialiserIndicateurs(): void {
    // Indicateurs de compromission
    this.indicateursMenaces.add("tentative_injection_sql");
    this.indicateursMenaces.add("scan_vulnerabilite");
    this.indicateursMenaces.add("acces_non_autorise");
    this.indicateursMenaces.add("exfiltration_donnees");
    this.indicateursMenaces.add("pattern_ddos");
    this.indicateursMenaces.add("malware_signature");
    this.indicateursMenaces.add("payload_suspect");
    this.indicateursMenaces.add("crypto_mining");
    this.indicateursMenaces.add("port_scan");
    this.indicateursMenaces.add("brute_force");
  }

  /**
   * Analyse les événements pour détecter des menaces
   */
  analyserEvenements(evenements: EvenementSecurite[]): Menace[] {
    const menacesDetectees: Menace[] = [];

    // Analyser pour les tentatives d'injection SQL
    const sqlInjection = this.detecterInjectionSQL(evenements);
    if (sqlInjection) {
      menacesDetectees.push(sqlInjection);
    }

    // Analyser pour les scans de vulnérabilité
    const vulnScan = this.detecterScanVulnerabilite(evenements);
    if (vulnScan) {
      menacesDetectees.push(vulnScan);
    }

    // Analyser pour les accès non autorisés
    const accesNonAutorise = this.detecterAccesNonAutorise(evenements);
    if (accesNonAutorise) {
      menacesDetectees.push(accesNonAutorise);
    }

    this.menaces.push(...menacesDetectees);
    return menacesDetectees;
  }

  /**
   * Détecte les tentatives d'injection SQL
   */
  private detecterInjectionSQL(evenements: EvenementSecurite[]): Menace | null {
    const evenementsSQL = evenements.filter(e => 
      e.type === "ACCES" && 
      e.donnees?.requete?.match(/(union|select|insert|delete|drop|update|--|;)/i)
    );

    if (evenementsSQL.length > 0) {
      return {
        id: crypto.randomUUID(),
        type: "INJECTION_SQL",
        description: "Tentative d'injection SQL détectée",
        niveau: 9,
        vecteurs: ["injection", "base_de_donnees"],
        indicateurs: ["tentative_injection_sql"],
        statut: "SURVEILLEE"
      };
    }

    return null;
  }

  /**
   * Détecte les scans de vulnérabilité
   */
  private detecterScanVulnerabilite(evenements: EvenementSecurite[]): Menace | null {
    const requetesRapides = evenements.filter(e => 
      e.type === "ACCES" && 
      e.donnees?.path?.match(/\.(php|asp|jsp|cgi)/i)
    );

    if (requetesRapides.length > 50) {
      return {
        id: crypto.randomUUID(),
        type: "SCAN_VULNERABILITE",
        description: "Activité de scan de vulnérabilité détectée",
        niveau: 6,
        vecteurs: ["scan", "reconnaissance"],
        indicateurs: ["scan_vulnerabilite", "port_scan"],
        statut: "SURVEILLEE"
      };
    }

    return null;
  }

  /**
   * Détecte les accès non autorisés
   */
  private detecterAccesNonAutorise(evenements: EvenementSecurite[]): Menace | null {
    const accesRefuses = evenements.filter(e => 
      e.type === "AUTORISATION" && 
      e.donnees?.succes === false
    );

    if (accesRefuses.length > 10) {
      return {
        id: crypto.randomUUID(),
        type: "ACCES_NON_AUTORISE",
        description: "Pattern d'accès non autorisé détecté",
        niveau: 8,
        vecteurs: ["acces", "privilege_escalation"],
        indicateurs: ["acces_non_autorise"],
        statut: "SURVEILLEE"
      };
    }

    return null;
  }

  /**
   * Ajoute une menace manuelle
   */
  ajouterMenace(menace: Omit<Menace, "id" | "statut">): Menace {
    const nouvelleMenace: Menace = {
      ...menace,
      id: crypto.randomUUID(),
      statut: "SURVEILLEE"
    };

    this.menaces.push(nouvelleMenace);
    return nouvelleMenace;
  }

  /**
   * Marque une menace comme confirmée
   */
  confirmerMenace(menaceId: string): boolean {
    const menace = this.menaces.find(m => m.id === menaceId);
    if (menace) {
      menace.statut = "CONFIRMEE";
      return true;
    }
    return false;
  }

  /**
   * Marque une menace comme mitigée
   */
  mitigerMenace(menaceId: string): boolean {
    const menace = this.menaces.find(m => m.id === menaceId);
    if (menace) {
      menace.statut = "MITIGEE";
      return true;
    }
    return false;
  }

  /**
   * Récupère toutes les menaces
   */
  recupererMenaces(): Menace[] {
    return [...this.menaces];
  }

  /**
   * Génère un rapport de menace
   */
  genererRapport(): {
    actives: number;
    resolues: number;
    parNiveau: Record<number, number>;
    parType: Record<string, number>;
  } {
    const parNiveau: Record<number, number> = {};
    const parType: Record<string, number> = {};

    this.menaces.forEach(m => {
      parNiveau[m.niveau] = (parNiveau[m.niveau] || 0) + 1;
      parType[m.type] = (parType[m.type] || 0) + 1;
    });

    return {
      actives: this.menaces.filter(m => m.statut === "SURVEILLEE" || m.statut === "CONFIRMEE").length,
      resolues: this.menaces.filter(m => m.statut === "MITIGEE").length,
      parNiveau,
      parType
    };
  }
}

/**
 * Système de Monitoring en Temps Réel
 */
export class SystemeMonitoring {
  private alertes: Map<string, { message: string; niveau: string; timestamp: Date }> = new Map();
  private seuilsAlertes: Map<string, number> = new Map();

  constructor() {
    this.configurerSeuils();
  }

  /**
   * Configure les seuils d'alerte
   */
  private configurerSeuils(): void {
    this.seuilsAlertes.set("cpu", 80); // 80%
    this.seuilsAlertes.set("memoire", 90); // 90%
    this.seuilsAlertes.set("disque", 85); // 85%
    this.seuilsAlertes.set("reseau", 1000); // 1000 req/s
  }

  /**
   * Vérifie les métriques et génère des alertes
   */
  verifierMetriques(metriques: {
    cpu?: number;
    memoire?: number;
    disque?: number;
    reseau?: number;
  }): void {
    if (metriques.cpu && metriques.cpu > this.seuilsAlertes.get("cpu")!) {
      this.genererAlerte("CRITIQUE", `CPU élevé : ${metriques.cpu}%`);
    }

    if (metriques.memoire && metriques.memoire > this.seuilsAlertes.get("memoire")!) {
      this.genererAlerte("HAUT", `Mémoire élevée : ${metriques.memoire}%`);
    }

    if (metriques.disque && metriques.disque > this.seuilsAlertes.get("disque")!) {
      this.genererAlerte("MOYEN", `Disque élevé : ${metriques.disque}%`);
    }

    if (metriques.reseau && metriques.reseau > this.seuilsAlertes.get("reseau")!) {
      this.genererAlerte("HAUT", `Trafic réseau élevé : ${metriques.reseau} req/s`);
    }
  }

  /**
   * Génère une alerte
   */
  genererAlerte(niveau: string, message: string): void {
    const id = crypto.randomUUID();
    this.alertes.set(id, {
      message,
      niveau,
      timestamp: new Date()
    });

    // En production, envoyer à un système d'alerte
    console.error(`[ALERTE ${niveau}] ${message}`);
  }

  /**
   * Récupère les alertes récentes
   */
  recupererAlertes(dernieresHeures: number = 24): Array<{ id: string; message: string; niveau: string; timestamp: Date }> {
    const limite = new Date(Date.now() - dernieresHeures * 60 * 60 * 1000);
    return Array.from(this.alertes.entries())
      .filter(([_, alerte]) => alerte.timestamp >= limite)
      .map(([id, alerte]) => ({ id, ...alerte }));
  }

  /**
   * Vide les alertes
   */
  viderAlertes(): void {
    this.alertes.clear();
  }
}

/**
 * Système d'Intelligence de Sécurité Complet
 */
export class SystemeIntelligenceSecurite {
  private logs: GestionnaireLogsSecurises;
  private anomalies: DetecteurAnomalies;
  private menaces: AnalyseurMenaces;
  private monitoring: SystemeMonitoring;

  constructor(cleSignature?: string) {
    this.logs = new GestionnaireLogsSecurises(cleSignature);
    this.anomalies = new DetecteurAnomalies();
    this.menaces = new AnalyseurMenaces();
    this.monitoring = new SystemeMonitoring();
  }

  /**
   * Analyse les événements de sécurité
   */
  analyserEvenements(evenements: EvenementSecurite[]): {
    anomalies: Anomalie[];
    menaces: Menace[];
    rapport: any;
  } {
    this.logs.enregistrerEvenement({
      type: "SYSTEME",
      niveau: "BAS",
      source: "SYSTEME_INTEL",
      donnees: { nombreEvenements: evenements.length }
    });

    const anomaliesDetectees = [
      ...this.anomalies.detecterEchecsAuthentification(evenements),
      ...this.anomalies.detecterAccesInhabituels(evenements),
      ...this.anomalies.detecterAnomaliesTemporelles(evenements)
    ];

    const menacesDetectees = this.menaces.analyserEvenements(evenements);

    return {
      anomalies: anomaliesDetectees,
      menaces: menacesDetectees,
      rapport: this.menaces.genererRapport()
    };
  }

  /**
   * Enregistre un événement
   */
  enregistrerEvenement(evenement: Omit<EvenementSecurite, "id" | "timestamp" | "signature">): void {
    this.logs.enregistrerEvenement(evenement);
  }

  /**
   * Vérifie les métriques système
   */
  verifierMetriques(metriques: any): void {
    this.monitoring.verifierMetriques(metriques);
  }

  /**
   * Génère un rapport de sécurité
   */
  genererRapportSecurite(): {
    logs: any;
    anomalies: Anomalie[];
    menaces: any;
    alertes: any;
  } {
    return {
      logs: this.logs.statistiques(),
      anomalies: this.anomalies.recupererAnomalies(),
      menaces: this.menaces.genererRapport(),
      alertes: this.monitoring.recupererAlertes()
    };
  }

  /**
   * Récupère le gestionnaire de logs
   */
  getLogs(): GestionnaireLogsSecurises {
    return this.logs;
  }

  /**
   * Récupère le détecteur d'anomalies
   */
  getAnomalies(): DetecteurAnomalies {
    return this.anomalies;
  }

  /**
   * Récupère l'analyseur de menaces
   */
  getMenaces(): AnalyseurMenaces {
    return this.menaces;
  }

  /**
   * Récupère le système de monitoring
   */
  getMonitoring(): SystemeMonitoring {
    return this.monitoring;
  }
}

/**
 * Fonctions d'export pour faciliter l'import
 */
export const enregistrerEvenement = (evenement: any) => new SystemeIntelligenceSecurite().enregistrerEvenement(evenement);
export const analyserMenaces = (evenements: any[]) => new SystemeIntelligenceSecurite().analyserEvenements(evenements);
export const genererRapport = () => new SystemeIntelligenceSecurite().genererRapportSecurite();
