/**
 * Tests Unitaires pour le Code Generator
 */

import { CodeGenerator } from "../src/codeGenerator.js";
import { Parser } from "../src/parser.js";
import { Lexer } from "../src/lexer.js";
import { runner } from "./testRunner.js";

console.log("=== TESTS DU CODE GENERATOR ===\n");

// Test 1: Génération de variable
runner.test("CodeGenerator: Génération de variable", () => {
  const lexer = new Lexer("tanga x = 42");
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const generator = new CodeGenerator();
  const code = generator.generate(ast);
  runner.assertTrue(code.includes("let x = 42"));
});

// Test 2: Génération de nombre
runner.test("CodeGenerator: Génération de nombre", () => {
  const lexer = new Lexer("42");
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const generator = new CodeGenerator();
  const code = generator.generate(ast);
  runner.assertTrue(code.includes("42"));
});

// Test 3: Génération de chaîne
runner.test("CodeGenerator: Génération de chaîne", () => {
  const lexer = new Lexer('"Bonjour"');
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const generator = new CodeGenerator();
  const code = generator.generate(ast);
  runner.assertTrue(code.includes("Bonjour"));
});

// Test 4: Génération de sortie
runner.test("CodeGenerator: Génération de sortie elobi", () => {
  const lexer = new Lexer("elobi(42)");
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const generator = new CodeGenerator();
  const code = generator.generate(ast);
  runner.assertTrue(code.includes("console.log"));
});

// Test 5: Génération avec obfuscation
runner.test("CodeGenerator: Génération avec obfuscation", () => {
  const lexer = new Lexer("tanga x = 42");
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  const generator = new CodeGenerator({ obfusquer: true, niveauObfuscation: "basique" });
  const code = generator.generate(ast);
  runner.assertTrue(code.length > 0);
});

setTimeout(() => {
  runner.summary();
  process.exit(runner.allPassed() ? 0 : 1);
}, 100);
