/**
 * Type Checker pour LingalaAutomation
 * Validation statique des types et inférence de types
 */

import { ASTNode, NodeType } from "./parser.js";

// Types de données supportés
export enum DataType {
  Number = "Number",
  String = "String",
  Boolean = "Boolean",
  Array = "Array",
  Object = "Object",
  Any = "Any",
  Unknown = "Unknown",
  Void = "Void",
  Null = "Null",
}

// Interface pour les informations de type
export interface TypeInfo {
  type: DataType;
  subType?: TypeInfo; // Pour les arrays
  properties?: Map<string, TypeInfo>; // Pour les objects
  isNullable?: boolean;
}

// Erreur de type
export class TypeError extends Error {
  constructor(message: string, public node?: ASTNode) {
    super(message);
    this.name = "TypeError";
  }
}

// Symbole dans la table des symboles
export interface Symbol {
  name: string;
  type: TypeInfo;
  isConstant?: boolean;
  isFunction?: boolean;
  parameters?: Map<string, TypeInfo>;
  returnType?: TypeInfo;
}

// Scope (portée)
export class Scope {
  symbols: Map<string, Symbol> = new Map();
  parent?: Scope;

  constructor(parent?: Scope) {
    this.parent = parent;
  }

  define(name: string, symbol: Symbol): void {
    this.symbols.set(name, symbol);
  }

  resolve(name: string): Symbol | undefined {
    const symbol = this.symbols.get(name);
    if (symbol) return symbol;
    return this.parent?.resolve(name);
  }

  has(name: string): boolean {
    return this.symbols.has(name) || (this.parent?.has(name) ?? false);
  }
}

export class TypeChecker {
  private scopes: Scope[] = [];
  private currentScope: Scope;
  private errors: TypeError[] = [];

  constructor() {
    this.currentScope = new Scope();
    this.scopes.push(this.currentScope);
  }

  // Créer un nouveau scope
  private enterScope(): void {
    const newScope = new Scope(this.currentScope);
    this.scopes.push(newScope);
    this.currentScope = newScope;
  }

  // Quitter le scope actuel
  private exitScope(): void {
    this.scopes.pop();
    this.currentScope = this.scopes[this.scopes.length - 1];
  }

  // Définir un symbole
  private defineSymbol(name: string, type: TypeInfo, isConstant = false): void {
    this.currentScope.define(name, {
      name,
      type,
      isConstant,
    });
  }

  // Résoudre un symbole
  private resolveSymbol(name: string): Symbol | undefined {
    return this.currentScope.resolve(name);
  }

  // Inférer le type d'une expression
  private inferType(node: ASTNode): TypeInfo {
    switch (node.type) {
      case NodeType.Literal:
        return this.inferLiteralType(node);
      case NodeType.Identifier:
        return this.inferIdentifierType(node);
      case NodeType.BinaryExpression:
        return this.inferBinaryExpressionType(node);
      case NodeType.CallExpression:
        return this.inferCallExpressionType(node);
      default:
        return { type: DataType.Unknown };
    }
  }

  // Inférer le type d'un littéral
  private inferLiteralType(node: ASTNode): TypeInfo {
    const value = node.value;
    if (typeof value === "number") {
      return { type: DataType.Number };
    }
    if (typeof value === "string") {
      return { type: DataType.String };
    }
    if (typeof value === "boolean") {
      return { type: DataType.Boolean };
    }
    if (value === null) {
      return { type: DataType.Null };
    }
    return { type: DataType.Unknown };
  }

  // Inférer le type d'un identificateur
  private inferIdentifierType(node: ASTNode): TypeInfo {
    // Ignorer les mots-clés lingala
    const keywords = new Set([
      "tanga", "elobi", "ok", "te", "soki", "susa", "tantike",
      "mosala", "zonga", "kosala", "luka", "longola", "kokisa",
      "sukisa", "bongoliKombo", "botia", "kokomisa", "koyoka",
      "salisa", "kozinga", "mbula", "makomi", "klasi", "mbotaka",
      "banda", "bika", "essayer", "kanga", "misusu", "sangisa", "kokota"
    ]);

    if (keywords.has(node.name)) {
      // Retourner Any pour les mots-clés (sera géré par le code generator)
      return { type: DataType.Any };
    }

    const symbol = this.resolveSymbol(node.name);
    if (symbol) {
      return symbol.type;
    }

    // Si non déclaré, retourner Unknown au lieu de lancer une erreur
    // (permet une compilation plus permissive)
    return { type: DataType.Unknown };
  }

  // Inférer le type d'une expression binaire
  private inferBinaryExpressionType(node: ASTNode): TypeInfo {
    const leftType = this.inferType(node.left);
    const rightType = this.inferType(node.right);

    // Vérifier que les types sont compatibles
    if (!this.isTypeCompatible(leftType, rightType)) {
      // En mode permissif, ne pas lancer d'erreur
      return { type: DataType.Any };
    }

    // Le type du résultat dépend de l'opérateur
    if (["==", "!=", "<", ">", "<=", ">="].includes(node.operator)) {
      return { type: DataType.Boolean };
    }

    // Pour l'opérateur +, si un des opérandes est String, le résultat est String
    if (node.operator === "+") {
      if (leftType.type === DataType.String || rightType.type === DataType.String) {
        return { type: DataType.String };
      }
    }

    return leftType;
  }

  // Inférer le type d'un appel de fonction
  private inferCallExpressionType(node: ASTNode): TypeInfo {
    const symbol = this.resolveSymbol(node.callee?.name || "");
    if (symbol && symbol.returnType) {
      return symbol.returnType;
    }
    return { type: DataType.Unknown };
  }

  // Vérifier si deux types sont compatibles
  private isTypeCompatible(type1: TypeInfo, type2: TypeInfo): boolean {
    // Any est compatible avec tout
    if (type1.type === DataType.Any || type2.type === DataType.Any) {
      return true;
    }

    // Unknown est compatible avec tout (mode permissif)
    if (type1.type === DataType.Unknown || type2.type === DataType.Unknown) {
      return true;
    }

    // Types identiques
    if (type1.type === type2.type) {
      return true;
    }

    // Null est compatible avec les types nullable
    if (type1.type === DataType.Null && type2.isNullable) {
      return true;
    }
    if (type2.type === DataType.Null && type1.isNullable) {
      return true;
    }

    // Number et String sont compatibles pour la concaténation
    if ((type1.type === DataType.Number && type2.type === DataType.String) ||
        (type1.type === DataType.String && type2.type === DataType.Number)) {
      return true;
    }

    return false;
  }

  // Vérifier un nœud AST
  public check(node: ASTNode): void {
    switch (node.type) {
      case NodeType.Program:
        this.checkProgram(node);
        break;
      case NodeType.VariableDeclaration:
        this.checkVariableDeclaration(node);
        break;
      case NodeType.FunctionDeclaration:
        this.checkFunctionDeclaration(node);
        break;
      case NodeType.ClassDeclaration:
        this.checkClassDeclaration(node);
        break;
      case NodeType.IfStatement:
        this.checkIfStatement(node);
        break;
      case NodeType.WhileStatement:
        this.checkWhileStatement(node);
        break;
      case NodeType.ReturnStatement:
        this.checkReturnStatement(node);
        break;
      case NodeType.ExpressionStatement:
        this.checkExpressionStatement(node);
        break;
      default:
        break;
    }
  }

  // Vérifier un programme
  private checkProgram(node: ASTNode): void {
    const body = Array.isArray(node.body) ? node.body : [node.body];
    for (const statement of body) {
      this.check(statement);
    }
  }

  // Vérifier une déclaration de variable
  private checkVariableDeclaration(node: ASTNode): void {
    const valueType = this.inferType(node.value);
    
    // Si une annotation de type est présente, vérifier la compatibilité
    if (node.typeAnnotation) {
      const declaredType = this.parseTypeAnnotation(node.typeAnnotation.typeName);
      
      if (!this.isTypeCompatible(valueType, declaredType)) {
        this.errors.push(new TypeError(
          `Type mismatch: variable '${node.name}' is declared as ${declaredType.type} but assigned ${valueType.type}`,
          node
        ));
      }
      
      this.defineSymbol(node.name, declaredType, false);
    } else {
      this.defineSymbol(node.name, valueType, false);
    }
  }

  // Parser une annotation de type
  private parseTypeAnnotation(typeName: string): TypeInfo {
    const typeMap: Record<string, DataType> = {
      'Number': DataType.Number,
      'String': DataType.String,
      'Boolean': DataType.Boolean,
      'Array': DataType.Array,
      'Object': DataType.Object,
      'Any': DataType.Any,
      'Void': DataType.Void,
      'Null': DataType.Null
    };
    
    const dataType = typeMap[typeName] || DataType.Unknown;
    return { type: dataType };
  }

  // Vérifier une déclaration de fonction
  private checkFunctionDeclaration(node: ASTNode): void {
    this.enterScope();

    // Inférer le type de retour (par défaut Void)
    let returnType: TypeInfo = { type: DataType.Void };
    
    // Définir les paramètres avec leurs types
    const paramTypes = new Map<string, TypeInfo>();
    if (node.params) {
      for (const param of node.params) {
        const paramType = param.type 
          ? this.parseTypeAnnotation(param.type)
          : { type: DataType.Any };
        paramTypes.set(param.name, paramType);
        
        // Définir le paramètre dans le scope de la fonction
        this.defineSymbol(param.name, paramType, false);
      }
    }

    // Définir la fonction dans le scope parent
    this.currentScope.define(node.name, {
      name: node.name,
      type: { type: DataType.Any },
      isFunction: true,
      parameters: paramTypes,
      returnType,
    });

    // Vérifier le corps de la fonction
    const body = Array.isArray(node.body) ? node.body : [node.body];
    for (const statement of body) {
      this.check(statement);
    }

    this.exitScope();
  }

  // Vérifier une déclaration de classe
  private checkClassDeclaration(node: ASTNode): void {
    this.enterScope();

    // Définir la classe
    this.currentScope.define(node.name, {
      name: node.name,
      type: { type: DataType.Object },
    });

    // Vérifier le corps de la classe
    const body = Array.isArray(node.body) ? node.body : [node.body];
    for (const statement of body) {
      this.check(statement);
    }

    this.exitScope();
  }

  // Vérifier une instruction if
  private checkIfStatement(node: ASTNode): void {
    const conditionType = this.inferType(node.condition);

    // La condition doit être un booléen (mode permissif: accepte aussi Any et Unknown)
    if (conditionType.type !== DataType.Boolean &&
        conditionType.type !== DataType.Any &&
        conditionType.type !== DataType.Unknown) {
      // En mode permissif, ne pas lancer d'erreur
    }

    this.enterScope();
    const thenBranch = Array.isArray(node.thenBranch) ? node.thenBranch : [node.thenBranch];
    for (const statement of thenBranch) {
      this.check(statement);
    }
    this.exitScope();
  }

  // Vérifier une instruction while
  private checkWhileStatement(node: ASTNode): void {
    const conditionType = this.inferType(node.condition);

    // La condition doit être un booléen (mode permissif: accepte aussi Any et Unknown)
    if (conditionType.type !== DataType.Boolean &&
        conditionType.type !== DataType.Any &&
        conditionType.type !== DataType.Unknown) {
      // En mode permissif, ne pas lancer d'erreur
    }

    this.enterScope();
    const body = Array.isArray(node.body) ? node.body : [node.body];
    for (const statement of body) {
      this.check(statement);
    }
    this.exitScope();
  }

  // Vérifier une instruction return
  private checkReturnStatement(node: ASTNode): void {
    if (node.value) {
      const valueType = this.inferType(node.value);
      // En mode permissif, ne pas vérifier le type de retour
    }
  }

  // Vérifier une instruction expression
  private checkExpressionStatement(node: ASTNode): void {
    this.inferType(node.expression);
  }

  // Obtenir toutes les erreurs de type
  public getErrors(): TypeError[] {
    return this.errors;
  }
}
