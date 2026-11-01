/**
 * Linter Basique pour LingalaAutomation
 * Détecte les erreurs courantes et les problèmes de style
 */

import { Lexer, TokenType } from "./lexer.js";

export interface LintError {
  line: number;
  column: number;
  message: string;
  severity: "error" | "warning";
}

export class LingalaLinter {
  private errors: LintError[] = [];

  lint(source: string): LintError[] {
    this.errors = [];
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();

    // Règles de linting
    this.checkUnusedVariables(tokens);
    this.checkUndefinedVariables(tokens);
    this.checkMissingSemicolons(tokens);
    this.checkEmptyBlocks(tokens);

    return this.errors;
  }

  private checkUndefinedVariables(tokens: any[]): void {
    const defined = new Set<string>();
    let inDeclaration = false;

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      
      if (token.type === TokenType.TANGA) {
        inDeclaration = true;
      } else if (token.type === TokenType.IDENTIFIER && inDeclaration) {
        defined.add(token.value);
        inDeclaration = false;
      } else if (token.type === TokenType.IDENTIFIER && !defined.has(token.value)) {
        this.errors.push({
          line: token.line || 0,
          column: token.column || 0,
          message: `Variable '${token.value}' non définie`,
          severity: "error"
        });
      }
    }
  }

  private checkMissingSemicolons(tokens: any[]): void {
    for (let i = 0; i < tokens.length - 1; i++) {
      const token = tokens[i];
      const next = tokens[i + 1];
      
      if (token.type === TokenType.NUMBER || token.type === TokenType.STRING || token.type === TokenType.IDENTIFIER) {
        if (next.type !== TokenType.SEMICOLON && next.type !== TokenType.EOF) {
          this.errors.push({
            line: token.line || 0,
            column: token.column || 0,
            message: "Point-virgule manquant",
            severity: "warning"
          });
        }
      }
    }
  }

  private checkEmptyBlocks(tokens: any[]): void {
    let blockDepth = 0;
    let blockStart = -1;

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      
      if (token.type === TokenType.BANDA) {
        blockDepth++;
        if (blockDepth === 1) blockStart = i;
      } else if (token.type === TokenType.RBRACE) {
        blockDepth--;
        if (blockDepth === 0 && blockStart !== -1) {
          const blockTokens = tokens.slice(blockStart, i);
          if (blockTokens.length < 5) {
            this.errors.push({
              line: token.line || 0,
              column: token.column || 0,
              message: "Bloc vide ou presque vide",
              severity: "warning"
            });
          }
        }
      }
    }
  }

  private checkUnusedVariables(tokens: any[]): void {
    const defined = new Map<string, number>();
    const used = new Set<string>();
    let inDeclaration = false;

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      
      if (token.type === TokenType.TANGA) {
        inDeclaration = true;
      } else if (token.type === TokenType.IDENTIFIER && inDeclaration) {
        defined.set(token.value, i);
        inDeclaration = false;
      } else if (token.type === TokenType.IDENTIFIER && defined.has(token.value)) {
        used.add(token.value);
      }
    }

    defined.forEach((index, name) => {
      if (!used.has(name)) {
        this.errors.push({
          line: tokens[index].line || 0,
          column: tokens[index].column || 0,
          message: `Variable '${name}' non utilisée`,
          severity: "warning"
        });
      }
    });
  }
}
