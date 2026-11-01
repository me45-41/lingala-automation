/**
 * Framework de Tests pour LingalaAutomation
 * Permet d'écrire des tests unitaires en lingala
 */
export class TestResult {
    name;
    passed;
    error;
    duration;
    constructor(name, passed, error, duration = 0) {
        this.name = name;
        this.passed = passed;
        this.error = error;
        this.duration = duration;
    }
}
export class TestSuite {
    name;
    tests = [];
    constructor(name) {
        this.name = name;
    }
    // Vérifier que deux valeurs sont égales
    bisisa(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(`Échec: ${message || 'bisisa'} - Attendu: ${expected}, Reçu: ${actual}`);
        }
    }
    // Vérifier qu'une condition est vraie
    esili(condition, message) {
        if (!condition) {
            throw new Error(`Échec: ${message || 'esili'} - Condition fausse`);
        }
    }
    // Vérifier qu'une exception est lancée
    kangaFonction(fn, message) {
        try {
            fn();
            throw new Error(`Échec: ${message || 'kangaFonction'} - Aucune exception lancée`);
        }
        catch (e) {
            // Success - exception was thrown
        }
    }
    // Ajouter un test
    kokotaTest(name, testFn) {
        const start = Date.now();
        try {
            testFn();
            this.tests.push(new TestResult(name, true, undefined, Date.now() - start));
        }
        catch (error) {
            this.tests.push(new TestResult(name, false, error instanceof Error ? error.message : String(error), Date.now() - start));
        }
    }
    // Exécuter tous les tests
    kojisa() {
        console.log(`\n🧪 Suite de tests: ${this.name}`);
        console.log("=".repeat(50));
        for (const test of this.tests) {
            if (test.passed) {
                console.log(`✅ ${test.name} (${test.duration}ms)`);
            }
            else {
                console.log(`❌ ${test.name} - ${test.error} (${test.duration}ms)`);
            }
        }
        const passed = this.tests.filter(t => t.passed).length;
        const total = this.tests.length;
        console.log("=".repeat(50));
        console.log(`Résultats: ${passed}/${total} tests réussis`);
    }
    // Vérifier si tous les tests ont réussi
    elobaSucces() {
        return this.tests.every(t => t.passed);
    }
}
