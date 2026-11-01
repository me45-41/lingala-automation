/**
 * Tests Unitaires pour le Parser
 */

import { Parser } from "../src/parser.js";
import { Lexer } from "../src/lexer.js";
import { runner } from "./testRunner.js";

console.log("=== TESTS DU PARSER ===\n");

// Test 1: Parsing de variable
runner.test("Parser: Parsing de variable", () => {
  const lexer = new Lexer("tanga x = 42");
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  runner.assertTrue(ast !== null);
  runner.assertTrue(ast !== null && ast !== undefined);
});

// Test 2: Parsing de nombre
runner.test("Parser: Parsing de nombre", () => {
  const lexer = new Lexer("42");
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  runner.assertTrue(ast !== null);
});

// Test 3: Parsing de chaîne
runner.test("Parser: Parsing de chaîne", () => {
  const lexer = new Lexer('"Bonjour"');
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  runner.assertTrue(ast !== null);
});

// Test 4: Parsing de condition
runner.test("Parser: Parsing de condition soki", () => {
  const lexer = new Lexer("soki x > 20 banda }");
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  runner.assertTrue(ast !== null);
});

// Test 5: Parsing de boucle
runner.test("Parser: Parsing de boucle tantike", () => {
  const lexer = new Lexer("tantike x < 10 banda }");
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  runner.assertTrue(ast !== null);
});

// Test 6: Parsing de fonction
runner.test("Parser: Parsing de fonction mosala", () => {
  const lexer = new Lexer("mosala saluer() banda }");
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  runner.assertTrue(ast !== null);
});

// Test 7: Parsing de classe
runner.test("Parser: Parsing de classe klasi", () => {
  const lexer = new Lexer("klasi Muntu banda }");
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  runner.assertTrue(ast !== null);
});

// Test 8: Parsing vide
runner.test("Parser: Parsing de code vide", () => {
  const lexer = new Lexer("");
  const tokens = lexer.tokenize();
  const parser = new Parser(tokens);
  const ast = parser.parse();
  runner.assertTrue(ast !== null);
});

setTimeout(() => {
  runner.summary();
  process.exit(runner.allPassed() ? 0 : 1);
}, 100);
