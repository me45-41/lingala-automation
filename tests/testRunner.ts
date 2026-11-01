/**
 * Test Runner Simple pour LingalaAutomation
 * Évite les dépendances externes comme Jest
 */

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

export class TestRunner {
  private results: TestResult[] = [];

  /**
   * Exécute un test
   */
  test(name: string, fn: () => void | Promise<void>): void {
    try {
      const result = fn();
      if (result instanceof Promise) {
        result.then(() => {
          this.results.push({ name, passed: true });
          console.log(`✓ ${name}`);
        }).catch((error) => {
          this.results.push({ name, passed: false, error: error.message });
          console.error(`✗ ${name}: ${error.message}`);
        });
      } else {
        this.results.push({ name, passed: true });
        console.log(`✓ ${name}`);
      }
    } catch (error) {
      this.results.push({ name, passed: false, error: (error as Error).message });
      console.error(`✗ ${name}: ${(error as Error).message}`);
    }
  }

  /**
   * Assertion d'égalité
   */
  assertEqual(actual: any, expected: any, message?: string): void {
    if (actual !== expected) {
      throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
  }

  /**
   * Assertion de vérité
   */
  assertTrue(value: any, message?: string): void {
    if (!value) {
      throw new Error(message || `Expected truthy value, got ${value}`);
    }
  }

  /**
   * Assertion de fausseté
   */
  assertFalse(value: any, message?: string): void {
    if (value) {
      throw new Error(message || `Expected falsy value, got ${value}`);
    }
  }

  /**
   * Assertion d'erreur
   */
  assertThrows(fn: () => void, message?: string): void {
    try {
      fn();
      throw new Error(message || "Expected function to throw");
    } catch (error) {
      // Expected
    }
  }

  /**
   * Affiche le résumé des tests
   */
  summary(): void {
    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;
    const total = this.results.length;

    console.log("\n=== RÉSUMÉ DES TESTS ===");
    console.log(`Total: ${total}`);
    console.log(`✓ Réussis: ${passed}`);
    console.log(`✗ Échoués: ${failed}`);

    if (failed > 0) {
      console.log("\n=== TESTS ÉCHOUÉS ===");
      this.results.filter(r => !r.passed).forEach(r => {
        console.error(`✗ ${r.name}: ${r.error}`);
      });
    }

    console.log(`\nPourcentage de réussite: ${((passed / total) * 100).toFixed(1)}%`);
  }

  /**
   * Retourne si tous les tests ont réussi
   */
  allPassed(): boolean {
    return this.results.every(r => r.passed);
  }
}

export const runner = new TestRunner();
