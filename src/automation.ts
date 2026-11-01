import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

/**
 * Créer un fichier
 * @param chemin - Chemin du fichier à créer
 * @param contenu - Contenu du fichier
 */
export async function kosala(chemin: string, contenu: string = ""): Promise<void> {
  const dir = path.dirname(chemin);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(chemin, contenu, "utf8");
}

/**
 * Lire un fichier
 * @param chemin - Chemin du fichier à lire
 * @returns Contenu du fichier
 */
export async function luka(chemin: string): Promise<string> {
  if (!fs.existsSync(chemin)) {
    throw new Error(`Fichier introuvable : ${chemin}`);
  }
  return fs.readFileSync(chemin, "utf8");
}

/**
 * Supprimer un fichier ou un dossier
 * @param chemin - Chemin à supprimer
 */
export async function longola(chemin: string): Promise<void> {
  if (!fs.existsSync(chemin)) {
    throw new Error(`Fichier/dossier introuvable : ${chemin}`);
  }

  const stats = fs.statSync(chemin);
  if (stats.isDirectory()) {
    fs.rmSync(chemin, { recursive: true, force: true });
  } else {
    fs.unlinkSync(chemin);
  }
}

/**
 * Copier un fichier
 * @param source - Chemin source
 * @param destination - Chemin destination
 */
export async function kokisa(source: string, destination: string): Promise<void> {
  if (!fs.existsSync(source)) {
    throw new Error(`Fichier source introuvable : ${source}`);
  }

  const destDir = path.dirname(destination);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  fs.copyFileSync(source, destination);
}

/**
 * Déplacer un fichier
 * @param source - Chemin source
 * @param destination - Chemin destination
 */
export async function sukisa(source: string, destination: string): Promise<void> {
  if (!fs.existsSync(source)) {
    throw new Error(`Fichier source introuvable : ${source}`);
  }

  const destDir = path.dirname(destination);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  fs.renameSync(source, destination);
}

/**
 * Renommer un fichier
 * @param chemin - Chemin actuel
 * @param nouveauNom - Nouveau nom
 */
export async function bongoliKombo(chemin: string, nouveauNom: string): Promise<void> {
  if (!fs.existsSync(chemin)) {
    throw new Error(`Fichier introuvable : ${chemin}`);
  }

  const dir = path.dirname(chemin);
  const nouveauChemin = path.join(dir, nouveauNom);
  fs.renameSync(chemin, nouveauChemin);
}

/**
 * Créer un dossier
 * @param chemin - Chemin du dossier à créer
 */
export async function botia(chemin: string): Promise<void> {
  if (!fs.existsSync(chemin)) {
    fs.mkdirSync(chemin, { recursive: true });
  }
}

/**
 * Lister les fichiers d'un dossier
 * @param chemin - Chemin du dossier
 * @returns Liste des fichiers
 */
export async function kokomisa(chemin: string): Promise<string[]> {
  if (!fs.existsSync(chemin)) {
    throw new Error(`Dossier introuvable : ${chemin}`);
  }

  const items = fs.readdirSync(chemin);
  return items.map((item: string) => path.join(chemin, item));
}

/**
 * Vérifier si un fichier/dossier existe
 * @param chemin - Chemin à vérifier
 * @returns true si existe, false sinon
 */
export async function koyoka(chemin: string): Promise<boolean> {
  return fs.existsSync(chemin);
}

/**
 * Exécuter une commande système
 * @param commande - Commande à exécuter
 * @returns Sortie de la commande
 */
export async function salisa(commande: string): Promise<string> {
  try {
    const { stdout, stderr } = await execAsync(commande);
    if (stderr) {
      console.error(`Erreur : ${stderr}`);
    }
    return stdout;
  } catch (error) {
    throw new Error(`Erreur lors de l'exécution : ${error}`);
  }
}

/**
 * Attendre (pause)
 * @param millisecondes - Temps d'attente en ms
 */
export async function kozinga(millisecondes: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, millisecondes));
}

/**
 * Obtenir la date/heure actuelle
 * @returns Date actuelle
 */
export async function mbula(): Promise<Date> {
  return new Date();
}

/**
 * Obtenir les informations sur un fichier
 * @param chemin - Chemin du fichier
 * @returns Statistiques du fichier
 */
export async function makomi(chemin: string): Promise<fs.Stats> {
  if (!fs.existsSync(chemin)) {
    throw new Error(`Fichier introuvable : ${chemin}`);
  }
  return fs.statSync(chemin);
}
