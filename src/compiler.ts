import { LingalaAutomationError, sangisa } from "./errors.js";
import { Libuka, Diktionere, Tupple, Ensemble } from "./types.js";
import { klasi, typeMwa } from "./classes.js";
import * as http from "./http.js";
import * as html from "./html.js";
import * as server from "./server.js";
import * as css from "./css.js";
import * as database from "./database.js";
import * as templates from "./templates.js";
import * as testing from "./testing.js";
import * as standards from "./standards.js";
import { LingalaRuntime } from "./runtime.js";
import { Lexer } from "./lexer.js";
import { Parser } from "./parser.js";
import { CodeGenerator } from "./codeGenerator.js";
import { TypeChecker } from "./typeChecker.js";

function replaceOutsideStrings(
  text: string,
  pattern: RegExp,
  replacement: string
): string {
  const parts = text.split(
    /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/g
  );

  return parts
    .map((part, index) => {
      if (index % 2 === 1) return part;
      return part.replace(pattern, replacement);
    })
    .join("");
}

function translateExpression(expression: string, parameterNames: string[] = []): string {
  let result = expression;
  result = replaceOutsideStrings(result, /\bok\b/g, "true");
  result = replaceOutsideStrings(result, /\bte\b/g, "false");

  // Préfixer les fonctions d'automatisation dans les expressions
  // Mais PAS après un point (méthodes d'objet) et PAS pour les paramètres
  const automationFunctions = ["kosala", "luka", "longola", "kokisa", "sukisa", "bongoliKombo", "botia", "kokomisa", "koyoka", "salisa", "kozinga", "mbula", "makomi"];
  const cssFunctions = ["kobomaCSS", "silisaCSS"];
  const jsKeywords = ["super", "this", "new", "typeof", "instanceof", "in", "of"];

  // Protéger les appels de méthodes (objet.methode)
  const protectedParts = result.split(/([A-Za-z_$][\w$]*\.[A-Za-z_$][\w$]*)/g);

  result = protectedParts.map((part, index) => {
    if (index % 2 === 1) {
      // C'est un appel de méthode - ne pas remplacer
      return part;
    }

    // Remplacer les fonctions d'automatisation, sauf si c'est un paramètre
    let partResult = part;
    for (const func of automationFunctions) {
      // Ne pas remplacer si c'est un paramètre
      if (parameterNames.includes(func)) {
        continue;
      }
      const regex = new RegExp(`\\b${func}\\b`, "g");
      partResult = replaceOutsideStrings(partResult, regex, `automation.${func}`);
    }
    // Remplacer les fonctions CSS
    for (const func of cssFunctions) {
      const regex = new RegExp(`\\b${func}\\b`, "g");
      partResult = replaceOutsideStrings(partResult, regex, `css.${func}`);
    }
    // Ne pas remplacer les mots-clés JavaScript
    for (const keyword of jsKeywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, "g");
      // On ne fait rien, juste pour éviter le remplacement accidentel
    }
    return partResult;
  }).join("");

  return result;
}

// Liste des noms de classes déclarées (à suivre dans le compilateur)
const declaredClasses = new Set<string>();
const classParents = new Map<string, string>(); // Map className -> parentName

function addClassDeclaration(className: string, parentName?: string): void {
  declaredClasses.add(className);
  if (parentName) {
    classParents.set(className, parentName);
  }
}

function isClassName(name: string): boolean {
  return declaredClasses.has(name);
}

function hasParent(className: string): boolean {
  return classParents.has(className);
}

// Ajouter `this.` aux références de propriétés dans les méthodes de classe
function addThisToProperties(expression: string): string {
  // Liste des mots-clés JavaScript à ne pas préfixer
  const jsKeywords = new Set([
    "true", "false", "null", "undefined", "NaN", "Infinity",
    "if", "else", "for", "while", "return", "function", "class",
    "const", "let", "var", "new", "this", "super", "extends",
    "import", "export", "from", "default", "async", "await",
    "try", "catch", "finally", "throw", "typeof", "instanceof",
    "in", "of", "delete", "void"
  ]);

  // Liste des fonctions d'automatisation
  const automationFunctions = new Set([
    "kosala", "luka", "longola", "kokisa", "sukisa", "bongoliKombo",
    "botia", "kokomisa", "koyoka", "salisa", "kozinga", "mbula", "makomi"
  ]);

  // Liste des fonctions globales
  const globalFunctions = new Set([
    "console", "Math", "Date", "JSON", "Array", "Object", "String",
    "Number", "Boolean", "Map", "Set", "Promise", "RegExp"
  ]);

  // Fonction pour vérifier si un token doit être préfixé
  function shouldPrefix(token: string): boolean {
    if (!token || token.length === 0) return false;
    
    // Ignorer les opérateurs, parenthèses, nombres
    if (/^[+\-*/%=<>!&|^~?:,;()\[\]{}]|^\d+$/.test(token)) return false;
    
    // Ignorer les chaînes
    if (/^["']/.test(token)) return false;
    
    // Ignorer les mots-clés JavaScript
    if (jsKeywords.has(token)) return false;
    
    // Ignorer les fonctions d'automatisation
    if (automationFunctions.has(token)) return false;
    
    // Ignorer les fonctions globales
    if (globalFunctions.has(token)) return false;
    
    // Ignorer si c'est déjà this ou automation
    if (token.startsWith("this.") || token.startsWith("automation.")) return false;
    
    // Si c'est un identifiant valide, préfixer
    if (/^[A-Za-z_$][\w$]*$/.test(token)) return true;
    
    return false;
  }

  // Séparer par opérateurs mais garder les chaînes intactes
  const parts = expression.split(/("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/g);

  return parts.map((part, index) => {
    if (index % 2 === 1) return part; // Chaînes de caractères

    // Séparer par les opérateurs et parenthèses
    const tokens = part.split(/([+\-*/%=<>!&|^~?:,;()\[\]{}])/g);

    return tokens.map(token => {
      if (shouldPrefix(token)) {
        return `this.${token}`;
      }
      return token;
    }).join("");
  }).join("");
}

function convertDataStructures(expression: string): string {
  let result = expression;

  // Convertir les listes : libuka[1, 2, 3] -> new Libuka([1, 2, 3])
  result = result.replace(/libuka\[([^\]]*)\]/g, (match, content) => {
    return `new Libuka([${content}])`;
  });

  // Convertir les dictionnaires : diktionere{cle: "valeur", cle2: valeur2}
  result = result.replace(/diktionere\{([^}]+)\}/g, (match, content) => {
    const pairs = [];
    let current = "";
    let inString = false;
    let stringChar = "";

    for (let i = 0; i < content.length; i++) {
      const char = content[i];

      if ((char === '"' || char === "'") && !inString) {
        inString = true;
        stringChar = char;
        current += char;
      } else if (char === stringChar && inString) {
        inString = false;
        current += char;
      } else if (char === ',' && !inString) {
        if (current.trim()) {
          pairs.push(current.trim());
        }
        current = "";
      } else {
        current += char;
      }
    }

    if (current.trim()) {
      pairs.push(current.trim());
    }

    const convertedPairs = pairs.map(pair => {
      const colonIndex = pair.indexOf(":");
      const key = pair.slice(0, colonIndex).trim();
      const value = pair.slice(colonIndex + 1).trim();
      // Nettoyer les guillemets autour de la clé
      const cleanKey = key.replace(/^["']|["']$/g, "");
      return `["${cleanKey}", ${value}]`;
    });

    return `new Diktionere([${convertedPairs.join(", ")}])`;
  });

  // Convertir les tuples : tupple(1, 2, 3) -> new Tupple([1, 2, 3])
  result = result.replace(/tupple\(([^)]+)\)/g, (match, content) => {
    return `new Tupple([${content}])`;
  });

  // Convertir les sets : ensemble{1, 2, 3} -> new Ensemble([1, 2, 3])
  result = result.replace(/ensemble\{([^}]+)\}/g, (match, content) => {
    return `new Ensemble([${content}])`;
  });

  return result;
}

function convertMethodCalls(expression: string): string {
  let result = expression;

  // Convertir les appels de méthodes : objet.methode(args) -> objet.methode(args)
  // (déjà en syntaxe JavaScript, pas besoin de conversion spéciale)
  return result;
}

type Block = {
  type: "if" | "else" | "while" | "foreach" | "function" | "class" | "try" | "catch" | "finally";
  variableScope: Set<string>;
  parameters?: string[]; // Stocker les paramètres de la fonction/méthode
};

export function compile(source: string, useAST: boolean = false, useTypeChecking: boolean = false): string {
  // Option pour utiliser le nouveau compilateur AST
  if (useAST) {
    try {
      const lexer = new Lexer(source);
      const tokens = lexer.tokenize();
      const parser = new Parser(tokens);
      const ast = parser.parse();

      // Type checking si activé
      if (useTypeChecking) {
        const typeChecker = new TypeChecker();
        typeChecker.check(ast);
        const errors = typeChecker.getErrors();
        if (errors.length > 0) {
          throw new LingalaAutomationError(
            `Erreurs de type: ${errors.map(e => e.message).join(", ")}`
          );
        }
      }

      const generator = new CodeGenerator();
      return generator.generate(ast);
    } catch (error) {
      console.warn("AST compilation failed, falling back to regex compiler:", error);
      // Fallback au compilateur regex si AST échoue
    }
  }

  // Compilateur regex original (par défaut)

  // Compilateur regex original (fallback)
  const output: string[] = [];
  const imports: string[] = []; // Collecter les imports
  const globalVariables = new Set<string>();
  const scopeStack: Set<string>[] = [globalVariables];
  const blockStack: Block[] = [];
  const exports = new Set<string>(); // Ensemble des noms à exporter
  let hasImports = false; // Flag pour détecter s'il y a des imports
  const lines = source.split(/\r?\n/);

  // D'abord, scanner le code pour détecter les exports et imports
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("salisa")) {
      const exportMatch = trimmed.match(/^salisa\s+(mosala|tanga|klasi)\s+([A-Za-z_$][\w$]*)/);
      if (exportMatch) {
        exports.add(exportMatch[2]);
      }
    }
    if (trimmed.startsWith("kokota")) {
      hasImports = true;
    }
  }

  // Import des fonctions d'automatisation et types (seulement si pas module)
  if (exports.size === 0 && !hasImports) {
    output.push('import * as automation from "./automation.js";');
    output.push('import { Libuka, Diktionere, Tupple, Ensemble } from "./types.js";');
    output.push('import * as http from "./http.js";');
    output.push('import * as html from "./html.js";');
    output.push('import * as server from "./server.js";');
    output.push('import * as css from "./css.js";');
    output.push('import * as database from "./database.js";');
    output.push('import * as templates from "./templates.js";');
    output.push('import * as testing from "./testing.js";');
    output.push('import * as standards from "./standards.js";');
    output.push('import { LingalaRuntime } from "./runtime.js";');
    output.push('import { sangisa } from "./errors.js";');
    output.push("\n(async () => {");
    output.push("  try {");
    output.push("");
  }

  function currentScope(): Set<string> {
    return scopeStack[scopeStack.length - 1];
  }

  function isInsideFunction(): boolean {
    return blockStack.some((block) => block.type === "function");
  }

  function getIndent(): string {
    return "  ".repeat(blockStack.length + 2);
  }

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();
    const lineNumber = i + 1;

    if (line === "" || line.startsWith("//")) continue;

    // Traiter les exports en premier (avant les autres patterns)
    const exportFunction = line.match(/^salisa\s+mosala\s+([A-Za-z_$][\w$]*)/);
    if (exportFunction) {
      const funcName = exportFunction[1];
      exports.add(funcName);
      line = line.replace(/^salisa\s+/, "");
    }

    const exportVariable = line.match(/^salisa\s+tanga\s+([A-Za-z_$][\w$]*)/);
    if (exportVariable) {
      const varName = exportVariable[1];
      exports.add(varName);
      line = line.replace(/^salisa\s+/, "");
    }

    const exportClass = line.match(/^salisa\s+klasi\s+([A-Za-z_$][\w$]*)/);
    if (exportClass) {
      const className = exportClass[1];
      exports.add(className);
      line = line.replace(/^salisa\s+/, "");
    }

    // Fermeture d'un bloc
    if (line === "susa") {
      if (blockStack.length === 0) {
        throw new LingalaAutomationError("susa sans bloc ouvert.", lineNumber);
      }

      const block = blockStack.pop()!;
      output.push(getIndent() + "}");

      if (block.type === "function") {
        scopeStack.pop();
      }

      // Si on vient de fermer un bloc de type "function" mais qu'il y a encore un bloc "class" dans le stack,
      // c'est qu'on était dans une méthode ou constructeur de classe - ne pas fermer la classe
      if (block.type === "function" && blockStack.length > 0 && blockStack[blockStack.length - 1].type === "class") {
        // Remettre le bloc de classe (il était déjà là, on l'a juste utilisé pour vérifier)
        // Rien à faire - le bloc de classe est toujours dans le stack
      }

      continue;
    }

    // Si c'est un module (avec exports), les fonctions se ferment automatiquement
    if (exports.size > 0 && blockStack.length > 0 && blockStack[blockStack.length - 1].type === "function") {
      // Vérifier si la ligne suivante est une nouvelle déclaration (function, class, export)
      const nextLineIndex = i + 1;
      if (nextLineIndex < lines.length) {
        const nextLine = lines[nextLineIndex].trim();
        if (nextLine.startsWith("salisa") || nextLine.startsWith("klasi") || nextLine.startsWith("mosala")) {
          // Fermer automatiquement la fonction précédente
          const block = blockStack.pop()!;
          output.push(getIndent() + "}");
          scopeStack.pop();
        }
      }
    }

    // Déclaration d'une classe (syntaxe simplifiée)
    const classDeclaration = line.match(/^klasi\s+([A-Za-z_$][\w$]*)\s+banda$/);

    if (classDeclaration) {
      const className = classDeclaration[1];
      const isExported = exports.has(className);
      const exportKeyword = isExported ? "export " : "";
      output.push(getIndent() + `${exportKeyword}class ${className} {`);
      addClassDeclaration(className);

      const classScope = new Set<string>();
      scopeStack.push(classScope);
      blockStack.push({
        type: "class",
        variableScope: classScope
      });
      continue;
    }

    // Déclaration d'une classe avec héritage
    const classWithExtends = line.match(/^klasi\s+([A-Za-z_$][\w$]*)\s+bika\s+([A-Za-z_$][\w$]*)\s+banda$/);

    if (classWithExtends) {
      const className = classWithExtends[1];
      const parentClass = classWithExtends[2];
      const isExported = exports.has(className);
      const exportKeyword = isExported ? "export " : "";
      output.push(getIndent() + `${exportKeyword}class ${className} extends ${parentClass} {`);
      addClassDeclaration(className, parentClass);

      const classScope = new Set<string>();
      scopeStack.push(classScope);
      blockStack.push({
        type: "class",
        variableScope: classScope
      });
      continue;
    }

    // Constructeur de classe (syntaxe: mbotaka param1, param2 banda)
    const constructorDeclaration = line.match(/^mbotaka\s+([A-Za-z_$][\w$]*(\s*,\s*[A-Za-z_$][\w$]*)*)\s+banda$/);

    if (constructorDeclaration && blockStack[blockStack.length - 1]?.type === "class") {
      const parameters = constructorDeclaration[1].trim();

      if (
        parameters !== "" &&
        !/^[A-Za-z_$][\w$]*(\s*,\s*[A-Za-z_$][\w$]*)*$/.test(parameters)
      ) {
        throw new LingalaAutomationError(
          "Liste de paramètres invalide.",
          lineNumber
        );
      }

      const parameterNames = parameters
        ? parameters.split(",").map((parameter) => parameter.trim())
        : [];

      // Vérifier si la classe a un parent
      const currentClass = blockStack.find(b => b.type === "class");
      const className = Array.from(declaredClasses).find(c => {
        // Trouver le nom de la classe courante (pas simple sans le stocker)
        return true; // Simplification
      });

      // Pour l'instant, on ne peut pas facilement détecter la classe courante
      // On va générer super() si les paramètres correspondent
      output.push(getIndent() + `  constructor(${parameters}) {`);

      const constructorScope = new Set(parameterNames);
      scopeStack.push(constructorScope);
      blockStack.push({
        type: "function",
        variableScope: constructorScope
      });
      continue;
    }

    // Déclaration d'une fonction ou méthode
    const functionDeclaration = line.match(
      /^mosala\s+([A-Za-z_$][\w$]*)\s*\(([^)]*)\)\s+banda$/
    );

    if (functionDeclaration) {
      const name = functionDeclaration[1];
      const parameters = functionDeclaration[2].trim();

      // Vérifier si on est dans une classe (n'importe où dans la stack)
      const inClass = blockStack.some(block => block.type === "class");

      if (
        parameters !== "" &&
        !/^[A-Za-z_$][\w$]*(\s*,\s*[A-Za-z_$][\w$]*)*$/.test(parameters)
      ) {
        throw new LingalaAutomationError(
          "Liste de paramètres invalide.",
          lineNumber
        );
      }

      const parameterNames = parameters
        ? parameters.split(",").map((parameter) => parameter.trim())
        : [];

      if (new Set(parameterNames).size !== parameterNames.length) {
        throw new LingalaAutomationError(
          "Un paramètre ne peut pas être déclaré deux fois.",
          lineNumber
        );
      }

      // Si on est dans une classe, c'est une méthode
      if (inClass) {
        output.push(getIndent() + `  async ${name}(${parameters}) {`);
        const methodScope = new Set(parameterNames);
        scopeStack.push(methodScope);
        blockStack.push({
          type: "function",
          variableScope: methodScope
        });
      } else {
        // Sinon, c'est une fonction
        const isExported = exports.has(name);
        const exportKeyword = isExported ? "export " : "";
        output.push(getIndent() + `${exportKeyword}async function ${name}(${parameters}) {`);
        const functionScope = new Set(parameterNames);
        scopeStack.push(functionScope);
        blockStack.push({
          type: "function",
          variableScope: functionScope
        });
      }
      continue;
    }

    // Sinon
    if (/^soki\s+te\s+banda$/.test(line)) {
      if (blockStack[blockStack.length - 1]?.type !== "if") {
        throw new LingalaAutomationError(
          "'soki te banda' doit suivre un bloc 'soki'.",
          lineNumber
        );
      }

      output.push(getIndent() + "} else {");
      blockStack.pop();
      blockStack.push({
        type: "else",
        variableScope: currentScope()
      });
      continue;
    }

    // Condition
    const condition = line.match(/^soki\s+(.+)\s+banda$/);

    if (condition) {
      output.push(getIndent() + `if (${translateExpression(condition[1])}) {`);
      blockStack.push({
        type: "if",
        variableScope: currentScope()
      });
      continue;
    }

    // Boucle tantike (while)
    const whileLoop = line.match(/^tantike\s+(.+)\s+banda$/);

    if (whileLoop) {
      output.push(getIndent() + `while (${translateExpression(whileLoop[1])}) {`);
      blockStack.push({
        type: "while",
        variableScope: currentScope()
      });
      continue;
    }

    // Boucle pour chaque (foreach)
    const foreachLoop = line.match(/^mpo na moko na moko\s+\(([^)]+)\)\s+banda$/);

    if (foreachLoop) {
      const arrayPattern = foreachLoop[1].trim();
      output.push(getIndent() + `for (const item of ${translateExpression(arrayPattern)}) {`);
      blockStack.push({
        type: "foreach",
        variableScope: currentScope()
      });
      continue;
    }

    // Try/Catch/Finally
    const tryBlock = line.match(/^essayer\s+banda$/);

    if (tryBlock) {
      output.push(getIndent() + "try {");
      blockStack.push({
        type: "try",
        variableScope: currentScope()
      });
      continue;
    }

    const catchBlock = line.match(/^kanga\s+([A-Za-z_$][\w$]*)\s+banda$/);

    if (catchBlock) {
      if (blockStack[blockStack.length - 1]?.type !== "try") {
        throw new LingalaAutomationError(
          "'kanga' doit suivre un bloc 'essayer'.",
          lineNumber
        );
      }

      const errorVar = catchBlock[1];
      output.push(getIndent() + `} catch (${errorVar}) {`);
      blockStack.pop(); // Fermer le bloc try
      blockStack.push({
        type: "catch",
        variableScope: currentScope()
      });
      continue;
    }

    const finallyBlock = line.match(/^misusu\s+banda$/);

    if (finallyBlock) {
      const lastBlock = blockStack[blockStack.length - 1];
      if (lastBlock?.type !== "try" && lastBlock?.type !== "catch") {
        throw new LingalaAutomationError(
          "'misusu' doit suivre un bloc 'essayer' ou 'kanga'.",
          lineNumber
        );
      }

      output.push(getIndent() + "} finally {");
      blockStack.pop(); // Fermer le bloc try ou catch
      // Note: finally ne nécessite pas de susa, il sera fermé automatiquement à la fin
      // On ajoute un marqueur spécial pour savoir qu'on est dans finally
      blockStack.push({
        type: "finally",
        variableScope: currentScope()
      });
      continue;
    }

    // Throw exception
    const throwStatement = line.match(/^sangisa\s+(.+)$/);

    if (throwStatement) {
      const expr = translateExpression(throwStatement[1]);
      output.push(getIndent() + `sangisa(${expr});`);
      continue;
    }

    // Import simple: kokota nom na "./module.lingala"
    const importSimple = line.match(/^kokota\s+([A-Za-z_$][\w$]*)\s+na\s+"([^"]+)"$/);

    if (importSimple) {
      const name = importSimple[1];
      const module = importSimple[2];
      // Convertir .lingala en .js
      const jsModule = module.replace(/\.lingala$/, ".js");
      imports.push(`import ${name} from "${jsModule}";`);
      continue;
    }

    // Import nommé: kokota {n1, n2} na "./module.lingala"
    const importNamed = line.match(/^kokota\s+\{([^}]+)\}\s+na\s+"([^"]+)"$/);

    if (importNamed) {
      const names = importNamed[1].split(",").map(n => n.trim());
      const module = importNamed[2];
      const jsModule = module.replace(/\.lingala$/, ".js");
      imports.push(`import { ${names.join(", ")} } from "${jsModule}";`);
      continue;
    }

    // Import avec alias: kokota nom kombo alias na "./module.lingala"
    const importAlias = line.match(/^kokota\s+([A-Za-z_$][\w$]*)\s+kombo\s+([A-Za-z_$][\w$]*)\s+na\s+"([^"]+)"$/);

    if (importAlias) {
      const original = importAlias[1];
      const alias = importAlias[2];
      const module = importAlias[3];
      const jsModule = module.replace(/\.lingala$/, ".js");
      imports.push(`import { ${original} as ${alias} } from "${jsModule}";`);
      continue;
    }



    // Retour d'une valeur
    const returnMatch = line.match(/^zonga(?:\s+(.+))?$/);

    if (returnMatch) {
      // Pour les modules, on autorise zonga même si isInsideFunction() retourne false
      // car les fonctions exportées sont détectées différemment
      if (!isInsideFunction() && exports.size === 0) {
        throw new LingalaAutomationError(
          "'zonga' doit être utilisé dans une fonction.",
          lineNumber
        );
      }

      const value = returnMatch[1];

      output.push(
        getIndent() + (value === undefined
          ? "return;"
          : `return ${translateExpression(value)};`)
      );
      continue;
    }

    // Déclaration ou modification d'une variable
    const variable = line.match(
      /^tanga\s+([A-Za-z_$][\w$]*)\s*=\s*(.+)$/
    );

    if (variable) {
      const name = variable[1];
      let value = variable[2];
      const scope = currentScope();
      const currentBlock = blockStack[blockStack.length - 1];

      // D'abord convertir les structures de données
      value = convertDataStructures(value);

      // Ensuite traduire les expressions (remplacer ok/te, automation.*)
      value = translateExpression(value);

      // Si on est dans une classe et le nom est dans le scope du constructeur
      if (currentBlock?.type === "function" && scope.has(name)) {
        // C'est probablement une propriété, utiliser this
        output.push(getIndent() + `this.${name} = ${value};`);
        continue;
      }

      // Vérifier si c'est un appel de classe (instanciation)
      const classCallMatch = value.match(/^([A-Za-z_$][\w$]*)\s*\((.*)\)$/);
      if (classCallMatch && isClassName(classCallMatch[1])) {
        const className = classCallMatch[1];
        const args = classCallMatch[2];
        value = `new ${className}(${args})`;
      }

      // Vérifier si c'est un appel de fonction d'automatisation
      const isAutomationCall = /^(automation\.)?(kosala|luka|longola|kokisa|sukisa|bongoliKombo|botia|kokomisa|koyoka|salisa|kozinga|mbula|makomi)/.test(value);

      if (scope.has(name)) {
        output.push(getIndent() + `${name} = ${isAutomationCall ? `await ${value}` : value};`);
      } else {
        output.push(getIndent() + `let ${name} = ${isAutomationCall ? `await ${value}` : value};`);
        scope.add(name);
      }

      continue;
    }

    // Assignation directe (sans tanga) dans les constructeurs/méthodes
    const directAssignment = line.match(
      /^([A-Za-z_$][\w$]*)\s*=\s*(.+)$/
    );

    if (directAssignment) {
      const name = directAssignment[1];
      let value = directAssignment[2];
      const scope = currentScope();
      const currentBlock = blockStack[blockStack.length - 1];

      // D'abord convertir les structures de données
      value = convertDataStructures(value);

      // Ensuite traduire les expressions
      value = translateExpression(value);

      // Si on est dans une classe (constructeur ou méthode)
      const inClass = blockStack.some(block => block.type === "class");

      if (inClass) {
        // Dans une classe, toutes les variables sans "tanga" deviennent this.variable
        // Si le nom est dans le scope (c'est un paramètre du constructeur), l'assignation devient this.name = value
        // Si le nom n'est pas dans le scope (méthode), on assume que c'est une propriété
        if (scope.has(name)) {
          // Constructeur: this.name = valeur (ne pas ajouter this. à la valeur si c'est le paramètre)
          output.push(getIndent() + `this.${name} = ${value};`);
        } else {
          // Méthode: this.name = valeur (ajouter this. aux références dans la valeur)
          value = addThisToProperties(value);
          output.push(getIndent() + `this.${name} = ${value};`);
        }
        continue;
      }

      // Sinon, c'est une erreur en dehors des classes
      throw new LingalaAutomationError(
        "Utilisation de 'tanga' requise pour déclarer une variable",
        lineNumber
      );
    }

    // Assignation directe (sans tanga) dans les classes/constructeurs
    const simpleAssignment = line.match(
      /^([A-Za-z_$][\w$]*)\s*=\s*(.+)$/
    );

    if (simpleAssignment) {
      const name = simpleAssignment[1];
      let value = simpleAssignment[2];
      const scope = currentScope();
      const currentBlock = blockStack[blockStack.length - 1];

      // D'abord convertir les structures de données
      value = convertDataStructures(value);

      // Ensuite traduire les expressions
      value = translateExpression(value);

      // Si on est dans une classe et le nom est dans le scope (paramètre de constructeur)
      if (currentBlock?.type === "function" && scope.has(name)) {
        output.push(getIndent() + `this.${name} = ${value};`);
        continue;
      }

      // Sinon, c'est une erreur en dehors des classes
      throw new LingalaAutomationError(
        "Utilisation de 'tanga' requise pour déclarer une variable",
        lineNumber
      );
    }

    // Affichage avec parenthèses
    const displayWithParens = line.match(/^elobi\s*\((.*)\)$/);

    if (displayWithParens) {
      const inClass = blockStack.some(block => block.type === "class");
      let expr = translateExpression(displayWithParens[1]);

      // Si on est dans une classe, préfixer les variables qui sont des propriétés
      if (inClass) {
        expr = addThisToProperties(expr);
      }

      output.push(getIndent() + `console.log(${expr});`);
      continue;
    }

    // Affichage sans parenthèses
    const display = line.match(/^elobi\s+(.+)$/);

    if (display) {
      const inClass = blockStack.some(block => block.type === "class");
      let expr = translateExpression(display[1]);

      // Si on est dans une classe, préfixer les variables qui sont des propriétés
      if (inClass) {
        expr = addThisToProperties(expr);
      }

      output.push(getIndent() + `console.log(${expr});`);
      continue;
    }

    // Fonctions d'automatisation spéciales (syntaxe: fonction arg1 arg2)
    const automationCall = line.match(
      /^(kosala|luka|longola|kokisa|sukisa|bongoliKombo|botia|kokomisa|koyoka|salisa|kozinga|mbula|makomi|koyoka|kokisa|koboma|longola|kobongola)\s+(.+)$/
    );

    if (automationCall) {
      const funcName = automationCall[1];
      const argsStr = automationCall[2].trim();

      // Parser les arguments en tenant compte des chaînes de caractères
      const args: string[] = [];
      let current = "";
      let inString = false;
      let stringChar = "";

      for (let i = 0; i < argsStr.length; i++) {
        const char = argsStr[i];

        if ((char === '"' || char === "'") && !inString) {
          inString = true;
          stringChar = char;
          current += char;
        } else if (char === stringChar && inString) {
          inString = false;
          current += char;
        } else if (char === ' ' && !inString) {
          if (current) {
            args.push(translateExpression(current));
            current = "";
          }
        } else {
          current += char;
        }
      }

      if (current) {
        args.push(translateExpression(current));
      }

      // Séparer les fonctions d'automatisation et les fonctions web
      const automationFuncs = ["kosala", "luka", "longola", "kokisa", "sukisa", "bongoliKombo", "botia", "kokomisa", "koyoka", "salisa", "kozinga", "mbula", "makomi"];
      const httpFuncs = ["koyoka", "kokisa", "koboma", "longola", "kobongola"];
      const htmlFuncs = ["kokota", "kobomaHTML", "kokotaPage", "kotaLink", "kotaImage", "kotaForm", "kotaInput", "kotaButton", "kotaTable", "kotaList"];
      const serverFuncs = ["kobotaServer", "kobandaJSON", "kobandaHTML", "kobandaText", "kobandaBody", "kobandaJSONBody", "kobandaQuery", "kobandaParams"];
      const cssFuncs = ["langi", "nsima", "bonene", "ndelo", "zinga", "mbole", "katikati", "kobimisa", "botuka", "kobanda", "molongo", "katikatiHorizontal", "katikatiVertical", "kobola", "kima", "seko", "sekoNaMolongo", "sekoNaLiboso", "sekoNaMbote", "kotisa", "boselu", "koyokaCSS", "kotaMouse", "kobomaText", "kobandaText", "mbata", "kokoma", "kobimaText", "kobimaOverflow", "kimaShadow", "kobimisaTransition", "kobongolaCSS", "kelasi", "responsive", "kobimaAnimation", "kobomaCSS", "silisaCSS"];

      let prefix = "automation.";
      if (httpFuncs.includes(funcName)) prefix = "http.";
      if (htmlFuncs.includes(funcName)) prefix = "html.";
      if (serverFuncs.includes(funcName)) prefix = "server.";
      if (cssFuncs.includes(funcName)) prefix = "css.";

      output.push(getIndent() + `await ${prefix}${funcName}(${args.join(", ")});`);
      continue;
    }

    // Appel de super
    const superCall = line.match(/^super\s*\((.*)\)$/);

    if (superCall) {
      const args = translateExpression(superCall[1]);
      output.push(getIndent() + `super(${args});`);
      continue;
    }

    // Fonctions d'automatisation avec parenthèses
    const automationCallWithParens = line.match(
      /^(kosala|luka|longola|kokisa|sukisa|bongoliKombo|botia|kokomisa|koyoka|salisa|kozinga|mbula|makomi|koyoka|kokisa|koboma|longola|kobongola|kokota|kobomaHTML|kokotaPage|kotaLink|kotaImage|kotaForm|kotaInput|kotaButton|kotaTable|kotaList|kobotaServer|kobandaJSON|kobandaHTML|kobandaText|kobandaBody|kobandaJSONBody|kobandaQuery|kobandaParams|langi|nsima|bonene|ndelo|zinga|mbole|katikati|kobimisa|botuka|kobanda|molongo|katikatiHorizontal|katikatiVertical|kobola|kima|seko|sekoNaMolongo|sekoNaLiboso|sekoNaMbote|kotisa|boselu|koyokaCSS|kotaMouse|kobomaText|kobandaText|mbata|kokoma|kobimaText|kobimaOverflow|kimaShadow|kobimisaTransition|kobongolaCSS|kelasi|responsive|kobimaAnimation|kobomaCSS|silisaCSS)\s*\((.*)\)$/
    );

    if (automationCallWithParens) {
      const funcName = automationCallWithParens[1];
      const args = translateExpression(automationCallWithParens[2]);

      const automationFuncs = ["kosala", "luka", "longola", "kokisa", "sukisa", "bongoliKombo", "botia", "kokomisa", "koyoka", "salisa", "kozinga", "mbula", "makomi"];
      const httpFuncs = ["koyoka", "kokisa", "koboma", "longola", "kobongola"];
      const htmlFuncs = ["kokota", "kobomaHTML", "kokotaPage", "kotaLink", "kotaImage", "kotaForm", "kotaInput", "kotaButton", "kotaTable", "kotaList"];
      const serverFuncs = ["kobotaServer", "kobandaJSON", "kobandaHTML", "kobandaText", "kobandaBody", "kobandaJSONBody", "kobandaQuery", "kobandaParams"];
      const cssFuncs = ["langi", "nsima", "bonene", "ndelo", "zinga", "mbole", "katikati", "kobimisa", "botuka", "kobanda", "molongo", "katikatiHorizontal", "katikatiVertical", "kobola", "kima", "seko", "sekoNaMolongo", "sekoNaLiboso", "sekoNaMbote", "kotisa", "boselu", "koyokaCSS", "kotaMouse", "kobomaText", "kobandaText", "mbata", "kokoma", "kobimaText", "kobimaOverflow", "kimaShadow", "kobimisaTransition", "kobongolaCSS", "kelasi", "responsive", "kobimaAnimation", "kobomaCSS", "silisaCSS"];

      let prefix = "automation.";
      if (httpFuncs.includes(funcName)) prefix = "http.";
      if (htmlFuncs.includes(funcName)) prefix = "html.";
      if (serverFuncs.includes(funcName)) prefix = "server.";
      if (cssFuncs.includes(funcName)) prefix = "css.";

      output.push(getIndent() + `await ${prefix}${funcName}(${args});`);
      continue;
    }

    // Appel de fonction comme instruction
    const call = line.match(/^([A-Za-z_$][\w$]*)\s*\((.*)\)$/);

    if (call) {
      const funcName = call[1];
      const args = translateExpression(call[2]);
      output.push(getIndent() + `await ${funcName}(${args});`);
      continue;
    }

    // Appel de méthode sur objet : objet.methode(args)
    const methodCall = line.match(/^([A-Za-z_$][\w$]*)\.([A-Za-z_$][\w$]*)\s*\((.*)\)$/);

    if (methodCall) {
      const obj = methodCall[1];
      const method = methodCall[2];
      const args = translateExpression(methodCall[3]);
      const currentBlock = blockStack[blockStack.length - 1];

      // Si on est dans une classe et l'objet est "tanga", utiliser this
      if (currentBlock?.type === "class" && obj === "tanga") {
        output.push(getIndent() + `this.${method}(${args});`);
      } else {
        output.push(getIndent() + `${obj}.${method}(${args});`);
      }
      continue;
    }

    throw new LingalaAutomationError(
      `Instruction inconnue : ${line}`,
      lineNumber
    );
  }

  if (blockStack.length > 0) {
    // Fermer automatiquement les blocs finally restants
    while (blockStack.length > 0) {
      const block = blockStack.pop()!;
      if (block.type === "finally") {
        output.push(getIndent() + "}");
      } else {
        throw new LingalaAutomationError(
          "Un bloc n'a pas été fermé. Ajoute 'susa'."
        );
      }
    }
  }

  // Ajouter le wrapper async final (seulement si ce n'est pas un module)
  const isModule = exports.size > 0 || imports.length > 0;

  if (!isModule) {
    output.push("  } catch (error) {");
    output.push("    console.error('Erreur:', error);");
    output.push("  }");
    output.push("})();");
  } else {
    // Pour les modules, fermer tous les blocs ouverts
    while (blockStack.length > 0) {
      const block = blockStack.pop()!;
      output.push(getIndent() + "}");
      if (block.type === "function") {
        scopeStack.pop();
      }
    }
  }

  // Construire le output final
  const finalOutput = [];

  if (isModule) {
    // Pour les modules, on met seulement les imports utilisateur
    finalOutput.push(...imports);
    finalOutput.push(...output);
  } else {
    // Pour les scripts normaux, on garde tous les imports standards
    finalOutput.push(...output);
  }

  return finalOutput.join("\n") + "\n";
}
