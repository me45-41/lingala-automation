/**
 * Tests Unitaires pour le Lexer
 */

import { Lexer, TokenType } from "../src/lexer.js";
import { runner } from "./testRunner.js";

console.log("=== TESTS DU LEXER ===\n");

// Test 1: Tokenisation de variable
runner.test("Lexer: Tokenisation de variable", () => {
  const lexer = new Lexer("tanga x = 42");
  const tokens = lexer.tokenize();
  runner.assertTrue(tokens.length > 0);
  const tangaToken = tokens.find(t => t.type === TokenType.TANGA);
  const identToken = tokens.find(t => t.type === TokenType.IDENTIFIER);
  const numberToken = tokens.find(t => t.type === TokenType.NUMBER);
  runner.assertTrue(tangaToken !== undefined);
  runner.assertTrue(identToken !== undefined);
  runner.assertTrue(numberToken !== undefined);
});

// Test 2: Tokenisation de nombre
runner.test("Lexer: Tokenisation de nombre", () => {
  const lexer = new Lexer("42");
  const tokens = lexer.tokenize();
  runner.assertTrue(tokens.length > 0);
  const numberToken = tokens.find(t => t.type === TokenType.NUMBER);
  runner.assertTrue(numberToken !== undefined);
  runner.assertTrue(numberToken.value === "42");
});

// Test 3: Tokenisation de chaîne
runner.test("Lexer: Tokenisation de chaîne", () => {
  const lexer = new Lexer('"Bonjour"');
  const tokens = lexer.tokenize();
  runner.assertTrue(tokens.length >= 1);
  runner.assertEqual(tokens[0].type, TokenType.STRING);
  runner.assertEqual(tokens[0].value, "Bonjour");
});

// Test 4: Tokenisation de condition
runner.test("Lexer: Tokenisation de condition soki", () => {
  const lexer = new Lexer("soki x > 20 banda");
  const tokens = lexer.tokenize();
  runner.assertTrue(tokens.length >= 5);
  runner.assertEqual(tokens[0].type, TokenType.SOKI);
  runner.assertEqual(tokens[1].type, TokenType.IDENTIFIER);
  runner.assertEqual(tokens[2].type, TokenType.GREATER);
  runner.assertEqual(tokens[3].type, TokenType.NUMBER);
  runner.assertEqual(tokens[4].type, TokenType.BANDA);
});

// Test 5: Tokenisation de boucle
runner.test("Lexer: Tokenisation de boucle tantike", () => {
  const lexer = new Lexer("tantike x < 10 banda");
  const tokens = lexer.tokenize();
  runner.assertTrue(tokens.length >= 5);
  runner.assertEqual(tokens[0].type, TokenType.TANTIKE);
  runner.assertEqual(tokens[1].type, TokenType.IDENTIFIER);
  runner.assertEqual(tokens[2].type, TokenType.LESS);
  runner.assertEqual(tokens[3].type, TokenType.NUMBER);
  runner.assertEqual(tokens[4].type, TokenType.BANDA);
});

// Test 6: Tokenisation de fonction
runner.test("Lexer: Tokenisation de fonction mosala", () => {
  const lexer = new Lexer("mosala saluer() banda");
  const tokens = lexer.tokenize();
  runner.assertTrue(tokens.length >= 4);
  runner.assertEqual(tokens[0].type, TokenType.MOSALA);
  runner.assertEqual(tokens[1].type, TokenType.IDENTIFIER);
  runner.assertEqual(tokens[2].type, TokenType.LPAREN);
  runner.assertEqual(tokens[3].type, TokenType.RPAREN);
});

// Test 7: Tokenisation de classe
runner.test("Lexer: Tokenisation de classe klasi", () => {
  const lexer = new Lexer("klasi Muntu banda");
  const tokens = lexer.tokenize();
  runner.assertTrue(tokens.length >= 3);
  runner.assertEqual(tokens[0].type, TokenType.KLASI);
  runner.assertEqual(tokens[1].type, TokenType.IDENTIFIER);
  runner.assertEqual(tokens[2].type, TokenType.BANDA);
});

// Test 8: Tokenisation de sortie
runner.test("Lexer: Tokenisation de sortie elobi", () => {
  const lexer = new Lexer("elobi(x)");
  const tokens = lexer.tokenize();
  runner.assertTrue(tokens.length >= 4);
  runner.assertEqual(tokens[0].type, TokenType.ELOBI);
  runner.assertEqual(tokens[1].type, TokenType.LPAREN);
  runner.assertEqual(tokens[2].type, TokenType.IDENTIFIER);
  runner.assertEqual(tokens[3].type, TokenType.RPAREN);
});

// Test 9: Tokenisation de retour
runner.test("Lexer: Tokenisation de retour zonga", () => {
  const lexer = new Lexer("zonga x");
  const tokens = lexer.tokenize();
  runner.assertTrue(tokens.length >= 2);
  runner.assertEqual(tokens[0].type, TokenType.ZONGA);
  runner.assertEqual(tokens[1].type, TokenType.IDENTIFIER);
});

// Test 10: Tokenisation vide
runner.test("Lexer: Tokenisation de code vide", () => {
  const lexer = new Lexer("");
  const tokens = lexer.tokenize();
  runner.assertTrue(tokens.length >= 0);
});

setTimeout(() => {
  runner.summary();
  process.exit(runner.allPassed() ? 0 : 1);
}, 100);
