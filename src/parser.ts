/**
 * Parser pour LingalaAutomation
 * Convertit les tokens en AST (Abstract Syntax Tree)
 */

import { Token, TokenType } from "./lexer.js";

// Types de nœuds AST
export enum NodeType {
  Program,
  VariableDeclaration,
  FunctionDeclaration,
  ClassDeclaration,
  IfStatement,
  WhileStatement,
  ReturnStatement,
  ExpressionStatement,
  BinaryExpression,
  CallExpression,
  Literal,
  Identifier,
  Block,
  ArrayExpression,
  ObjectExpression,
  PropertyAccess,
  TypeAnnotation,
}

export interface ASTNode {
  type: NodeType;
  [key: string]: any;
}

export class Parser {
  private tokens: Token[];
  private current: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private advance(): Token {
    return this.tokens[this.current++];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    throw new Error(message);
  }

  parse(): ASTNode {
    return {
      type: NodeType.Program,
      body: this.parseBlock()
    };
  }

  private parseBlock(): ASTNode[] {
    const statements: ASTNode[] = [];
    while (!this.isAtEnd() && !this.check(TokenType.RBRACE) && !this.check(TokenType.SUSA)) {
      statements.push(this.parseStatement());
    }
    return statements;
  }

  private parseStatement(): ASTNode {
    if (this.match(TokenType.TANGA)) return this.parseVariableDeclaration();
    if (this.match(TokenType.MOSALA)) return this.parseFunctionDeclaration();
    if (this.match(TokenType.KLASI)) return this.parseClassDeclaration();
    if (this.match(TokenType.SOKI)) return this.parseIfStatement();
    if (this.match(TokenType.TANTIKE)) return this.parseWhileStatement();
    if (this.match(TokenType.ZONGA)) return this.parseReturnStatement();
    if (this.match(TokenType.SUSA)) {
      // 'susa' ferme le bloc actuel, retourner null pour ignorer
      return { type: NodeType.Literal, value: null };
    }
    return this.parseExpressionStatement();
  }

  private parseVariableDeclaration(): ASTNode {
    // TANGA est déjà consommé par match()
    const name = this.consume(TokenType.IDENTIFIER, "Attendu un nom de variable après 'tanga'").value;
    
    // Vérifier annotation de type : tanga x mboka Number = 42
    let typeAnnotation: ASTNode | null = null;
    if (this.match(TokenType.MBOOKA)) {
      const typeName = this.consume(TokenType.IDENTIFIER, "Attendu un type après 'mboka'").value;
      typeAnnotation = {
        type: NodeType.TypeAnnotation,
        typeName
      };
    }
    
    this.consume(TokenType.EQUAL, "Attendu '=' après le nom de variable");
    const value = this.parseOr();
    
    if (this.match(TokenType.SEMICOLON)) {
      // Point-virgule consommé
    }

    return {
      type: NodeType.VariableDeclaration,
      name,
      value,
      typeAnnotation
    };
  }

  private parseFunctionDeclaration(): ASTNode {
    const name = this.consume(TokenType.IDENTIFIER, "Attendu un nom de fonction après 'mosala'").value;
    this.consume(TokenType.LPAREN, "Attendu '(' après le nom de fonction");
    
    // Parser les paramètres avec types optionnels
    const params: Array<{ name: string; type?: string }> = [];
    if (!this.check(TokenType.RPAREN)) {
      do {
        const paramName = this.consume(TokenType.IDENTIFIER, "Attendu un nom de paramètre").value;
        let paramType: string | undefined;
        
        // Vérifier annotation de type : (x mboka Number, y mboka String)
        if (this.match(TokenType.MBOOKA)) {
          paramType = this.consume(TokenType.IDENTIFIER, "Attendu un type après 'mboka'").value;
        }
        
        params.push({ name: paramName, type: paramType });
      } while (this.match(TokenType.COMMA));
    }
    
    this.consume(TokenType.RPAREN, "Attendu ')' après les paramètres");
    this.consume(TokenType.BANDA, "Attendu 'banda' après '('");
    const body = this.parseBlock();
    this.consume(TokenType.RBRACE, "Attendu '}' à la fin de la fonction");

    return {
      type: NodeType.FunctionDeclaration,
      name,
      body,
      params
    };
  }

  private parseClassDeclaration(): ASTNode {
    const name = this.consume(TokenType.IDENTIFIER, "Attendu un nom de classe après 'klasi'").value;
    this.consume(TokenType.BANDA, "Attendu 'banda' après le nom de classe");
    const body = this.parseBlock();
    this.consume(TokenType.RBRACE, "Attendu '}' à la fin de la classe");

    return {
      type: NodeType.ClassDeclaration,
      name,
      body
    };
  }

  private parseIfStatement(): ASTNode {
    // La condition peut être avec ou sans parenthèses
    let condition: ASTNode;
    if (this.match(TokenType.LPAREN)) {
      condition = this.parseExpression();
      this.consume(TokenType.RPAREN, "Attendu ')' après la condition");
    } else {
      condition = this.parseExpression();
    }

    // Vérifier si "te" vient après la condition (syntaxe: soki condition te banda)
    const isNot = this.match(TokenType.TE);

    // Si c'est "soki te", appliquer la négation
    if (isNot) {
      condition = {
        type: NodeType.BinaryExpression,
        left: { type: NodeType.Literal, value: true },
        operator: "!",
        right: condition
      };
    }

    this.consume(TokenType.BANDA, "Attendu 'banda' après la condition");
    const thenBranch = this.parseBlock();
    this.consume(TokenType.RBRACE, "Attendu '}' à la fin du bloc if");

    return {
      type: NodeType.IfStatement,
      condition,
      thenBranch
    };
  }

  private parseWhileStatement(): ASTNode {
    // La condition peut être avec ou sans parenthèses
    let condition: ASTNode;
    if (this.match(TokenType.LPAREN)) {
      condition = this.parseExpression();
      this.consume(TokenType.RPAREN, "Attendu ')' après la condition");
    } else {
      condition = this.parseExpression();
    }
    this.consume(TokenType.BANDA, "Attendu 'banda' après la condition");
    const body = this.parseBlock();
    this.consume(TokenType.RBRACE, "Attendu '}' à la fin du bloc while");

    return {
      type: NodeType.WhileStatement,
      condition,
      body
    };
  }

  private parseReturnStatement(): ASTNode {
    const value = !this.check(TokenType.SEMICOLON) ? this.parseExpression() : null;
    this.consume(TokenType.SEMICOLON, "Attendu ';' après la valeur de retour");

    return {
      type: NodeType.ReturnStatement,
      value
    };
  }

  private parseExpressionStatement(): ASTNode {
    const expression = this.parseExpression();
    // Le point-virgule est optionnel
    if (this.match(TokenType.SEMICOLON)) {
      // Point-virgule consommé
    }

    return {
      type: NodeType.ExpressionStatement,
      expression
    };
  }

  private parseExpression(): ASTNode {
    return this.parseAssignment();
  }

  private parseSimpleExpression(): ASTNode {
    return this.parseOr();
  }

  private parseAssignment(): ASTNode {
    const expr = this.parseOr();

    // Ne traiter l'assignation que si c'est un identificateur et qu'on n'est pas dans une déclaration
    if (this.match(TokenType.EQUAL) && expr.type === NodeType.Identifier) {
      const value = this.parseAssignment();
      return {
        type: NodeType.BinaryExpression,
        left: expr,
        operator: "=",
        right: value
      };
    }

    return expr;
  }

  private parseOr(): ASTNode {
    let expr = this.parseAnd();

    while (this.match(TokenType.OR)) {
      const operator = this.previous().value;
      const right = this.parseAnd();
      expr = {
        type: NodeType.BinaryExpression,
        left: expr,
        operator,
        right
      };
    }

    return expr;
  }

  private parseAnd(): ASTNode {
    let expr = this.parseEquality();

    while (this.match(TokenType.AND)) {
      const operator = this.previous().value;
      const right = this.parseEquality();
      expr = {
        type: NodeType.BinaryExpression,
        left: expr,
        operator,
        right
      };
    }

    return expr;
  }

  private parseEquality(): ASTNode {
    let expr = this.parseComparison();

    while (this.match(TokenType.EQUAL_EQUAL, TokenType.NOT_EQUAL)) {
      const operator = this.previous().value;
      const right = this.parseComparison();
      expr = {
        type: NodeType.BinaryExpression,
        left: expr,
        operator,
        right
      };
    }

    return expr;
  }

  private parseComparison(): ASTNode {
    let expr = this.parseTerm();

    while (this.match(TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL)) {
      const operator = this.previous().value;
      const right = this.parseTerm();
      expr = {
        type: NodeType.BinaryExpression,
        left: expr,
        operator,
        right
      };
    }

    return expr;
  }

  private parseTerm(): ASTNode {
    let expr = this.parseFactor();

    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
      const operator = this.previous().value;
      const right = this.parseFactor();
      expr = {
        type: NodeType.BinaryExpression,
        left: expr,
        operator,
        right
      };
    }

    return expr;
  }

  private parseFactor(): ASTNode {
    let expr = this.parseUnary();

    while (this.match(TokenType.MULTIPLY, TokenType.DIVIDE)) {
      const operator = this.previous().value;
      const right = this.parseUnary();
      expr = {
        type: NodeType.BinaryExpression,
        left: expr,
        operator,
        right
      };
    }

    return expr;
  }

  private parseUnary(): ASTNode {
    if (this.match(TokenType.MINUS, TokenType.NOT_EQUAL)) {
      const operator = this.previous().value;
      const right = this.parseUnary();
      return {
        type: NodeType.BinaryExpression,
        left: { type: NodeType.Literal, value: 0 },
        operator,
        right
      };
    }

    return this.parseCall();
  }

  private parseCall(): ASTNode {
    let expr = this.parsePrimary();

    // Appel de fonction: identifiant(args)
    if (this.match(TokenType.LPAREN)) {
      const args: ASTNode[] = [];
      if (!this.check(TokenType.RPAREN)) {
        do {
          args.push(this.parseExpression());
        } while (this.match(TokenType.COMMA));
      }
      this.consume(TokenType.RPAREN, "Attendu ')' après les arguments");
      return {
        type: NodeType.CallExpression,
        callee: expr,
        arguments: args
      };
    }

    // Appel sans parenthèses pour elobi
    if (expr.type === NodeType.Identifier && expr.name === "elobi") {
      // Parser l'argument après elobi
      const arg = this.parseExpression();
      return {
        type: NodeType.CallExpression,
        callee: expr,
        arguments: [arg]
      };
    }

    // Accès à propriété: objet.propriété
    if (this.match(TokenType.DOT)) {
      const property = this.consume(TokenType.IDENTIFIER, "Attendu un nom de propriété après '.'");
      return {
        type: NodeType.PropertyAccess,
        object: expr,
        property: property.value
      };
    }

    return expr;
  }

  private parsePrimary(): ASTNode {
    // Booléens
    if (this.match(TokenType.OK)) {
      return { type: NodeType.Literal, value: true };
    }
    if (this.match(TokenType.TE)) {
      return { type: NodeType.Literal, value: false };
    }

    // Nombres
    if (this.match(TokenType.NUMBER)) {
      return {
        type: NodeType.Literal,
        value: Number(this.previous().value)
      };
    }

    // Strings
    if (this.match(TokenType.STRING)) {
      return {
        type: NodeType.Literal,
        value: this.previous().value
      };
    }

    // Identifiants (y compris elobi traité comme identifiant)
    if (this.match(TokenType.IDENTIFIER, TokenType.ELOBI)) {
      return {
        type: NodeType.Identifier,
        name: this.previous().value
      };
    }

    // Parenthèses
    if (this.match(TokenType.LPAREN)) {
      const expr = this.parseExpression();
      this.consume(TokenType.RPAREN, "Attendu ')' après l'expression");
      return expr;
    }

    // Tableaux
    if (this.match(TokenType.LBRACKET)) {
      const elements: ASTNode[] = [];
      if (!this.check(TokenType.RBRACKET)) {
        do {
          elements.push(this.parseExpression());
        } while (this.match(TokenType.COMMA));
      }
      this.consume(TokenType.RBRACKET, "Attendu ']' à la fin du tableau");
      return {
        type: NodeType.ArrayExpression,
        elements
      };
    }

    // Objets
    if (this.match(TokenType.LBRACE)) {
      const properties: Map<string, ASTNode> = new Map();
      if (!this.check(TokenType.RBRACE)) {
        do {
          const key = this.consume(TokenType.IDENTIFIER, "Attendu une clé de propriété").value;
          this.consume(TokenType.COLON, "Attendu ':' après la clé");
          const value = this.parseExpression();
          properties.set(key, value);
        } while (this.match(TokenType.COMMA));
      }
      this.consume(TokenType.RBRACE, "Attendu '}' à la fin de l'objet");
      return {
        type: NodeType.ObjectExpression,
        properties
      };
    }

    throw new Error(`Token inattendu: ${this.peek().type} (${this.peek().value})`);
  }
}
