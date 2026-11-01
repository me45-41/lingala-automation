import * as fs from "fs";
import * as path from "path";
import { compile } from "./compiler.js";
import { LingalaAutomationError } from "./errors.js";
import { CompilationCache } from "./cache.js";
import { EnhancedErrorHandler } from "./enhancedErrorHandler.js";
import { ObfuscateurJS } from "./obfuscateur.js";
import { LingalaLinter } from "./linter.js";
import { LingalaFormatter } from "./formatter.js";

function main(): void {
  const input = process.argv[2];
  const useAST = process.argv.includes("--ast");
  const useTypeChecking = process.argv.includes("--type-check");
  const useCache = !process.argv.includes("--no-cache");
  const execute = process.argv.includes("--run");
  const watch = process.argv.includes("--watch");
  const cleanCache = process.argv.includes("--clean-cache");
  const cacheStats = process.argv.includes("--cache-stats");
  const noObfuscate = process.argv.includes("--no-obfuscate");
  const obfuscateLevelArg = process.argv.indexOf("--obfuscate-level");
  const obfuscateLevel = obfuscateLevelArg !== -1 && process.argv[obfuscateLevelArg + 1]
    ? process.argv[obfuscateLevelArg + 1] as "basique" | "moyen" | "eleve" | "extreme"
    : "moyen";
  const lint = process.argv.includes("--lint");
  const format = process.argv.includes("--format");

  // Initialiser le cache
  const cache = new CompilationCache();
  
  // Initialiser le gestionnaire d'erreurs amélioré
  const errorHandler = new EnhancedErrorHandler();

  // Commandes de gestion du cache
  if (cleanCache) {
    cache.clear();
    console.log("Cache vidé avec succès");
    return;
  }

  if (cacheStats) {
    cache.stats();
    return;
  }

  if (!input) {
    console.error(
      "Utilisation : node dist/cli-fast.js scripts/mon-script.lingala [--ast] [--type-check] [--run] [--watch] [--no-cache] [--clean-cache] [--cache-stats] [--no-obfuscate] [--obfuscate-level <niveau>] [--lint] [--format]"
    );
    console.error("  --ast                : Utiliser le compilateur AST (recommandé)");
    console.error("  --type-check         : Activer la validation des types");
    console.error("  --run                : Exécuter le programme après compilation");
    console.error("  --watch              : Mode watch (recompilation automatique)");
    console.error("  --no-cache           : Désactiver le cache de compilation");
    console.error("  --clean-cache        : Vider le cache de compilation");
    console.error("  --cache-stats        : Afficher les statistiques du cache");
    console.error("  --no-obfuscate       : Désactiver l'obfuscation (développement)");
    console.error("  --obfuscate-level    : Niveau d'obfuscation (basique|moyen|eleve|extreme, défaut: moyen)");
    console.error("  --lint               : Linter le code (détecter les erreurs)");
    console.error("  --format             : Formater le code (améliorer la lisibilité)");
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

  // Linter
  if (lint) {
    const source = fs.readFileSync(inputPath, "utf8");
    const linter = new LingalaLinter();
    const errors = linter.lint(source);
    
    console.log("=== RÉSULTATS DU LINTER ===");
    if (errors.length === 0) {
      console.log("✓ Aucune erreur détectée");
    } else {
      errors.forEach(error => {
        const prefix = error.severity === "error" ? "✗" : "⚠";
        console.log(`${prefix} Ligne ${error.line}: ${error.message}`);
      });
    }
    return;
  }

  // Formateur
  if (format) {
    const source = fs.readFileSync(inputPath, "utf8");
    const formatter = new LingalaFormatter();
    const formatted = formatter.format(source);
    
    fs.writeFileSync(inputPath, formatted, "utf8");
    console.log("✓ Code formaté avec succès");
    return;
  }

  // Gestion du cache seulement pour la compilation
  if (cleanCache) {
    cache.clear();
    console.log("Cache vidé avec succès");
    return;
  }

  if (cacheStats) {
    cache.stats();
    return;
  }

  const compileAndRun = () => {
    try {
      const fileName = path.basename(inputPath, ".lingala");
      const scriptDir = path.dirname(inputPath);
      const outputPath = path.join(scriptDir, fileName + ".js");

      // Vérifier le cache
      if (useCache && cache.isCached(inputPath)) {
        const cachedPath = cache.getCached(inputPath);
        if (cachedPath) {
          console.log("✓ Utilisation du cache (fichier non modifié)");
          console.log(`JavaScript (cached) : ${cachedPath}`);
          
          if (execute) {
            console.log("Exécution du programme...");
            try {
              require(cachedPath);
            } catch (error) {
              console.error(errorHandler.catchAndFormat(error, inputPath));
              process.exitCode = 1;
            }
          }
          return;
        }
      }

      // Compiler le fichier
      const source = fs.readFileSync(inputPath, "utf8");
      let javascript = compile(source, useAST, useTypeChecking);

      // Appliquer l'obfuscation par défaut (sauf si --no-obfuscate)
      if (!noObfuscate) {
        const obfuscateur = new ObfuscateurJS();
        javascript = obfuscateur.obfusquerNiveau(javascript, obfuscateLevel);
        console.log(`✓ Obfuscation activée (niveau: ${obfuscateLevel})`);
      }

      // Copier les modules runtime
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

      // Ajouter au cache
      if (useCache) {
        cache.addToCache(inputPath, outputPath);
      }

      console.log("Traduction réussie !");
      if (useAST) console.log("✓ Compilateur AST utilisé");
      if (useTypeChecking) console.log("✓ Validation des types activée");
      if (useCache) console.log("✓ Cache activé");
      if (!noObfuscate) console.log("✓ Obfuscation par défaut activée (protection de production)");
      console.log(`JavaScript généré : ${outputPath}`);

      if (execute) {
        console.log("Exécution du programme...");
        try {
          require(outputPath);
        } catch (error) {
          console.error(errorHandler.catchAndFormat(error, inputPath));
          process.exitCode = 1;
        }
      }
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
  };

  // Mode watch
  if (watch) {
    console.log(`Mode watch activé pour : ${inputPath}`);
    console.log("Appuyez sur Ctrl+C pour arrêter");
    
    compileAndRun();

    fs.watchFile(inputPath, { interval: 1000 }, (curr, prev) => {
      if (curr.mtime !== prev.mtime) {
        console.log("\n🔄 Fichier modifié, recompilation...");
        if (useCache) {
          cache.invalidate(inputPath);
        }
        compileAndRun();
      }
    });
  } else {
    compileAndRun();
  }
}

main();
