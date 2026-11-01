/**
 * Lexer pour LingalaAutomation
 * Convertit le code source en tokens
 */

export enum TokenType {
  // Mots-clés
  TANGA,      // tanga
  ELOBI,      // elobi
  OK,         // ok
  TE,         // te
  SOKI,       // soki
  SOKI_TE,    // soki te
  SUSA,       // susa
  TANTIKE,    // tantike
  MPO_NA_MOKO_NA_MOKO, // mpo na moko na moko
  MOSALA,     // mosala
  ZONGA,      // zonga
  KOSALA,     // kosala
  LUKA,       // luka
  LONGOLA,    // longola
  KOKISA,     // kokisa
  SUKISA,     // sukisa
  BONGOLIKOMBO, // bongoliKombo
  BOTIA,      // botia
  KOKOMISA,   // kokomisa
  KOYOKA,     // koyoka
  SALISA,     // salisa
  KOZINGA,    // kozinga
  MBULA,      // mbula
  MAKOMI,     // makomi
  KLASI,      // klasi
  MBOTAKA,    // mbotaka
  BANDA,      // banda
  BIKAT,      // bika
  ESSAYER,    // essayer
  KANGA,      // kanga
  MISUSU,     // misusu
  SANGISA,    // sangisa
  KOKOTA,     // kokota (utilisé aussi dans plusieurs contextes)
  MBOOKA,     // mboka (type annotation)
  
  // Literals
  NUMBER,
  STRING,
  IDENTIFIER,
  
  // Opérateurs (JavaScript standard pour compatibilité)
  PLUS,        // +
  MINUS,       // -
  MULTIPLY,    // *
  DIVIDE,      // /
  EQUAL,       // =
  EQUAL_EQUAL, // ==
  NOT_EQUAL,  // !=
  LESS,        // <
  LESS_EQUAL,  // <=
  GREATER,     // >
  GREATER_EQUAL, // >=
  AND,         // &&
  OR,          // ||
  NOT,         // !
  
  // Ponctuation
  LPAREN,      // (
  RPAREN,      // )
  LBRACE,      // {
  RBRACE,      // }
  LBRACKET,    // [
  RBRACKET,    // ]
  COMMA,       // ,
  DOT,         // .
  SEMICOLON,   // ;
  COLON,       // :
  
  // Spécial
  EOF,
  UNKNOWN
}

export interface Token {
  type: TokenType;
  value: string;
  line: number;
  column: number;
}

export class Lexer {
  private source: string;
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;

  constructor(source: string) {
    this.source = source;
  }

  private peek(offset = 0): string {
    const pos = this.position + offset;
    if (pos >= this.source.length) return '\0';
    return this.source[pos];
  }

  private advance(): string {
    const char = this.peek();
    this.position++;
    if (char === '\n') {
      this.line++;
      this.column = 1;
    } else {
      this.column++;
    }
    return char;
  }

  private skipWhitespace(): void {
    while (/\s/.test(this.peek()) && this.peek() !== '\0') {
      this.advance();
    }
  }

  private skipComment(): void {
    if (this.peek() === '/' && this.peek(1) === '/') {
      while (this.peek() !== '\n' && this.peek() !== '\0') {
        this.advance();
      }
    }
  }

  private readNumber(): string {
    let result = '';
    while (/\d/.test(this.peek())) {
      result += this.advance();
    }
    return result;
  }

  private readString(): string {
    const quote = this.advance();
    let result = '';
    while (this.peek() !== quote && this.peek() !== '\0') {
      if (this.peek() === '\\') {
        this.advance(); // Skip escape
      }
      result += this.advance();
    }
    this.advance(); // Closing quote
    return result;
  }

  private readIdentifier(): string {
    let result = '';
    while (/[a-zA-Z_$0-9]/.test(this.peek())) {
      result += this.advance();
    }
    return result;
  }

  private getKeywordType(identifier: string): TokenType {
    const keywords: Record<string, TokenType> = {
      'tanga': TokenType.TANGA,
      'elobi': TokenType.ELOBI,
      'ok': TokenType.OK,
      'te': TokenType.TE,
      'soki': TokenType.SOKI,
      'susa': TokenType.SUSA,
      'tantike': TokenType.TANTIKE,
      'mosala': TokenType.MOSALA,
      'zonga': TokenType.ZONGA,
      'kosala': TokenType.KOSALA,
      'luka': TokenType.LUKA,
      'longola': TokenType.LONGOLA,
      'kokisa': TokenType.KOKISA,
      'sukisa': TokenType.SUKISA,
      'bongoliKombo': TokenType.BONGOLIKOMBO,
      'botia': TokenType.BOTIA,
      'kokomisa': TokenType.KOKOMISA,
      'koyoka': TokenType.KOYOKA,
      'salisa': TokenType.SALISA,
      'kozinga': TokenType.KOZINGA,
      'mbula': TokenType.MBULA,
      'makomi': TokenType.MAKOMI,
      'klasi': TokenType.KLASI,
      'mbotaka': TokenType.MBOTAKA,
      'banda': TokenType.BANDA,
      'bika': TokenType.BIKAT,
      'essayer': TokenType.ESSAYER,
      'kanga': TokenType.KANGA,
      'misusu': TokenType.MISUSU,
      'sangisa': TokenType.SANGISA,
      'kokota': TokenType.KOKOTA,
      'mboka': TokenType.MBOOKA,
    };

    // Gérer les mots-clés composés
    if (identifier === 'soki te') return TokenType.SOKI_TE;
    if (identifier === 'mpo na moko na moko') return TokenType.MPO_NA_MOKO_NA_MOKO;

    // Utiliser ?? pour éviter le bug falsy avec TokenType.TANGA = 0
    return keywords[identifier] ?? TokenType.IDENTIFIER;
  }

  tokenize(): Token[] {
    const tokens: Token[] = [];

    while (this.peek() !== '\0') {
      this.skipWhitespace();
      this.skipComment();

      const line = this.line;
      const column = this.column;

      if (this.peek() === '\0') break;

      const char = this.peek();

      // Numbers
      if (/\d/.test(char)) {
        tokens.push({
          type: TokenType.NUMBER,
          value: this.readNumber(),
          line,
          column
        });
        continue;
      }

      // Strings
      if (char === '"' || char === "'") {
        tokens.push({
          type: TokenType.STRING,
          value: this.readString(),
          line,
          column
        });
        continue;
      }

      // Identifiers and keywords
      if (/[a-zA-Z_$]/.test(char)) {
        const identifier = this.readIdentifier();
        tokens.push({
          type: this.getKeywordType(identifier),
          value: identifier,
          line,
          column
        });
        continue;
      }

      // Operators
      if (char === '+') {
        tokens.push({ type: TokenType.PLUS, value: '+', line, column });
        this.advance();
        continue;
      }
      if (char === '-') {
        tokens.push({ type: TokenType.MINUS, value: '-', line, column });
        this.advance();
        continue;
      }
      if (char === '*') {
        tokens.push({ type: TokenType.MULTIPLY, value: '*', line, column });
        this.advance();
        continue;
      }
      if (char === '/') {
        tokens.push({ type: TokenType.DIVIDE, value: '/', line, column });
        this.advance();
        continue;
      }
      if (char === '=') {
        if (this.peek(1) === '=') {
          tokens.push({ type: TokenType.EQUAL_EQUAL, value: '==', line, column });
          this.advance();
          this.advance();
        } else {
          tokens.push({ type: TokenType.EQUAL, value: '=', line, column });
          this.advance();
        }
        continue;
      }
      if (char === '!') {
        if (this.peek(1) === '=') {
          tokens.push({ type: TokenType.NOT_EQUAL, value: '!=', line, column });
          this.advance();
          this.advance();
        } else {
          tokens.push({ type: TokenType.NOT, value: '!', line, column });
          this.advance();
        }
        continue;
      }
      if (char === '<') {
        if (this.peek(1) === '=') {
          tokens.push({ type: TokenType.LESS_EQUAL, value: '<=', line, column });
          this.advance();
          this.advance();
        } else {
          tokens.push({ type: TokenType.LESS, value: '<', line, column });
          this.advance();
        }
        continue;
      }
      if (char === '>') {
        if (this.peek(1) === '=') {
          tokens.push({ type: TokenType.GREATER_EQUAL, value: '>=', line, column });
          this.advance();
          this.advance();
        } else {
          tokens.push({ type: TokenType.GREATER, value: '>', line, column });
          this.advance();
        }
        continue;
      }
      if (char === '&') {
        if (this.peek(1) === '&') {
          tokens.push({ type: TokenType.AND, value: '&&', line, column });
          this.advance();
          this.advance();
        }
        continue;
      }
      if (char === '|') {
        if (this.peek(1) === '|') {
          tokens.push({ type: TokenType.OR, value: '||', line, column });
          this.advance();
          this.advance();
        }
        continue;
      }

      // Ponctuation
      if (char === '(') {
        tokens.push({ type: TokenType.LPAREN, value: '(', line, column });
        this.advance();
        continue;
      }
      if (char === ')') {
        tokens.push({ type: TokenType.RPAREN, value: ')', line, column });
        this.advance();
        continue;
      }
      if (char === '{') {
        tokens.push({ type: TokenType.LBRACE, value: '{', line, column });
        this.advance();
        continue;
      }
      if (char === '}') {
        tokens.push({ type: TokenType.RBRACE, value: '}', line, column });
        this.advance();
        continue;
      }
      if (char === '[') {
        tokens.push({ type: TokenType.LBRACKET, value: '[', line, column });
        this.advance();
        continue;
      }
      if (char === ']') {
        tokens.push({ type: TokenType.RBRACKET, value: ']', line, column });
        this.advance();
        continue;
      }
      if (char === ',') {
        tokens.push({ type: TokenType.COMMA, value: ',', line, column });
        this.advance();
        continue;
      }
      if (char === '.') {
        tokens.push({ type: TokenType.DOT, value: '.', line, column });
        this.advance();
        continue;
      }
      if (char === ';') {
        tokens.push({ type: TokenType.SEMICOLON, value: ';', line, column });
        this.advance();
        continue;
      }
      if (char === ':') {
        tokens.push({ type: TokenType.COLON, value: ':', line, column });
        this.advance();
        continue;
      }

      // Unknown
      tokens.push({ type: TokenType.UNKNOWN, value: char, line, column });
      this.advance();
    }

    tokens.push({ type: TokenType.EOF, value: '', line: this.line, column: this.column });
    return tokens;
  }
}
