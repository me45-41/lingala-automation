/**
 * Test Runner pour LingalaAutomation
 * Exécute les tests et rapporte les résultats
 */

import { compile } from "../dist/compiler.js";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration: number;
}

class TestRunner {
  private results: TestResult[] = [];

  async runTest(name: string, scriptPath: string): Promise<TestResult> {
    const startTime = Date.now();
    try {
      // Compiler le script
      const source = fs.readFileSync(scriptPath, "utf8");
      const javascript = compile(source);

      // Écrire le JavaScript généré
      const jsPath = scriptPath.replace(".lingala", ".js");
      fs.writeFileSync(jsPath, javascript, "utf8");

      // Exécuter le JavaScript
      const { stdout, stderr } = await execAsync(`node "${jsPath}"`, {
        cwd: path.dirname(scriptPath),
        timeout: 5000
      });

      if (stderr) {
        throw new Error(stderr);
      }

      const duration = Date.now() - startTime;
      this.results.push({ name, passed: true, duration });
      console.log(`✓ ${name} (${duration}ms)`);
      return { name, passed: true, duration };
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.results.push({ name, passed: false, error: errorMessage, duration });
      console.log(`✗ ${name} (${duration}ms) - ${errorMessage}`);
      return { name, passed: false, error: errorMessage, duration };
    }
  }

  printSummary(): void {
    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;
    const total = this.results.length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    console.log("\n" + "=".repeat(50));
    console.log(`RÉSUMÉ DES TESTS`);
    console.log("=".repeat(50));
    console.log(`Total: ${total}`);
    console.log(`Réussis: ${passed}`);
    console.log(`Échoués: ${failed}`);
    console.log(`Durée totale: ${totalDuration}ms`);
    console.log("=".repeat(50));

    if (failed > 0) {
      console.log("\nTests échoués:");
      this.results.filter(r => !r.passed).forEach(r => {
        console.log(`  - ${r.name}: ${r.error}`);
      });
    }
  }

  async runAll(): Promise<void> {
    console.log("🧪 Exécution des tests LingalaAutomation\n");

    const testsDir = path.join(process.cwd(), "scripts");
    const testFiles = fs.readdirSync(testsDir)
      .filter(f => f.endsWith(".lingala"))
      .filter(f => !f.startsWith("ast-")) // Ignorer les tests AST expérimentaux
      .sort();

    for (const file of testFiles) {
      const scriptPath = path.join(testsDir, file);
      const testName = file.replace(".lingala", "");
      await this.runTest(testName, scriptPath);
    }

    this.printSummary();
  }
}

// Exécuter les tests
const runner = new TestRunner();
runner.runAll().catch(console.error);
