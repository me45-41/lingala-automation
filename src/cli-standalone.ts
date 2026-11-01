import * as fs from "fs";
import * as path from "path";
import { compile } from "./compiler.js";
import { LingalaAutomationError } from "./errors.js";

function main(): void {
  const input = process.argv[2];
  const useAST = process.argv.includes("--ast");
  const useTypeChecking = process.argv.includes("--type-check");

  if (!input) {
    console.error(
      "Utilisation : lingala scripts/mon-script.lingala [--ast] [--type-check]"
    );
    console.error("  --ast        : Utiliser le compilateur AST (expérimental)");
    console.error("  --type-check : Activer la validation des types");
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
    const javascript = compile(source, useAST, useTypeChecking);
    const fileName = path.basename(inputPath, ".lingala");
    const scriptDir = path.dirname(inputPath);
    const outputPath = path.join(scriptDir, fileName + ".js");

    // Version standalone : ne pas copier les modules
    // Ils sont déjà inclus dans l'exécutable

    fs.writeFileSync(outputPath, javascript, "utf8");

    console.log("Traduction réussie !");
    if (useAST) console.log("✓ Compilateur AST utilisé");
    if (useTypeChecking) console.log("✓ Validation des types activée");
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
