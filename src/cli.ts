import * as fs from "fs";
import * as path from "path";
import { compile } from "./compiler.js";
import { LingalaAutomationError } from "./errors.js";
import { ObfuscateurJS } from "./obfuscateur.js";

function main(): void {
  const input = process.argv[2];
  const useAST = process.argv.includes("--ast");
  const useTypeChecking = process.argv.includes("--type-check");
  const noObfuscate = process.argv.includes("--no-obfuscate");
  const obfuscateLevelArg = process.argv.indexOf("--obfuscate-level");
  const obfuscateLevel = obfuscateLevelArg !== -1 && process.argv[obfuscateLevelArg + 1]
    ? process.argv[obfuscateLevelArg + 1] as "basique" | "moyen" | "eleve" | "extreme"
    : "moyen";

  if (!input) {
    console.error(
      "Utilisation : node dist/cli.js scripts/mon-script.lingala [--ast] [--type-check] [--no-obfuscate] [--obfuscate-level <niveau>]"
    );
    console.error("  --ast              : Utiliser le compilateur AST (recommandé)");
    console.error("  --type-check       : Activer la validation des types");
    console.error("  --no-obfuscate     : Désactiver l'obfuscation (développement)");
    console.error("  --obfuscate-level  : Niveau d'obfuscation (basique|moyen|eleve|extreme, défaut: moyen)");
    process.exitCode = 1;
    return;
  }

  const inputPath = path.resolve(input);

  if (!fs.existsSync(inputPath)) {
    console.error(`Fichier introuvable : ${inputPath}`);
    process.exitCode = 1;
    return;
  }

  if (!/\.lingala$/i.test(inputPath)) {
    console.error(
      "Erreur : le fichier source doit avoir l'extension .lingala"
    );
    process.exitCode = 1;
    return;
  }

  try {
    const source = fs.readFileSync(inputPath, "utf8");
    let javascript = compile(source, useAST, useTypeChecking);

    // Appliquer l'obfuscation par défaut (sauf si --no-obfuscate)
    if (!noObfuscate) {
      const obfuscateur = new ObfuscateurJS();
      javascript = obfuscateur.obfusquerNiveau(javascript, obfuscateLevel);
      console.log(`✓ Obfuscation activée (niveau: ${obfuscateLevel})`);
    }

    const fileName = path.basename(inputPath, ".lingala");
    const scriptDir = path.dirname(inputPath);
    const outputPath = path.join(scriptDir, fileName + ".js");

    // Copier tous les modules runtime dans le dossier du script
    const modules = ["automation.js", "types.js", "classes.js", "http.js", "html.js", "server.js", "css.js", "errors.js", "database.js", "templates.js", "testing.js", "standards.js", "runtime.js"];
    const distDir = path.join(process.cwd(), "dist");

    for (const module of modules) {
      const src = path.join(distDir, module);
      const dest = path.join(scriptDir, module);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
      }
    }

    fs.writeFileSync(outputPath, javascript, "utf8");

    console.log("Traduction réussie !");
    if (useAST) console.log("✓ Compilateur AST utilisé");
    if (useTypeChecking) console.log("✓ Validation des types activée");
    if (!noObfuscate) console.log("✓ Obfuscation par défaut activée (protection de production)");
    console.log(`JavaScript généré : ${outputPath}`);
    console.log("Pour exécuter le programme, lancez :");
    console.log(`node "${outputPath}"`);
  } catch (error) {
    if (error instanceof LingalaAutomationError) {
      console.error(error.message);
    } else {
      console.error(
        error instanceof Error ? error.message : String(error)
      );
    }

    process.exitCode = 1;
  }
}

main();
