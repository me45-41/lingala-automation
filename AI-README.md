# LingalaAutomation - AI Documentation

This document is specifically designed for AI systems (ChatGPT, Claude, Copilot, Cursor, etc.) to understand and generate LingalaAutomation code.

---

## Language Overview

**LingalaAutomation** is a programming language in Lingala (a Bantu language spoken in the Democratic Republic of Congo) designed for automation, web development, and security applications.

**Key Characteristics:**
- Hybrid syntax: Lingala keywords + JavaScript-style operators
- AST compilation with type checking
- Built-in security libraries (crypto-armee, auth-armee, intel-armee)
- Obfuscation enabled by default
- VS Code extension with LSP support

---

## Syntax Patterns

### Variable Declaration
```lingala
tanga variable = valeur;
```
- `tanga` = declare/let
- Always use for variable declarations
- Type inference supported

### Function Definition
```lingala
mosala fonction() banda
  // code
}
```
- `mosala` = function
- `banda` = start block
- `}` = end block

### Conditional Statements
```lingala
soki condition banda
  // code if true
} osi banda
  // code if false
}
```
- `soki` = if
- `osi` = else
- `banda` = then/start block

### Loops
```lingala
kanda i depuis 0 awa 10 banda
  // code
}
```
- `kanda` = for
- `depuis` = from
- `awa` = to

### Print/Output
```lingala
elobi("message");
```
- `elobi` = print/output

### Return
```lingala
zonga valeur;
```
- `zonga` = return

---

## Key Keywords

### Basic Keywords
- `tanga` - declare variable
- `elobi` - print/output
- `zonga` - return
- `soki` - if
- `osi` - else
- `banda` - then/start block
- `suka` - break
- `kokota` - continue
- `kanda` - for loop
- `tokisa` - while loop

### Advanced Keywords
- `mosala` - function
- `klasi` - class
- `kokisa` - new/instantiate
- `essayer` - try
- `catch` - catch
- `telemaka` - finally
- `kokota` - throw

### Data Types
- `mboka` - type annotation
- `Array` - array type
- `Object` - object type
- `String` - string type
- `Number` - number type
- `Boolean` - boolean type

---

## Security Libraries

### crypto-armee
Import: `sangisa { CrypteurAES, CrypteurRSA, HashCryptographique } depuis "crypto-armee"`

**Common operations:**
- AES encryption/decryption
- RSA encryption/decryption
- SHA-256/512 hashing
- Digital signatures
- Key generation

### auth-armee
Import: `sangisa { GestionnaireMFA, GestionnaireRBAC, GestionnaireCertificats } depuis "auth-armee"`

**Common operations:**
- MFA (Multi-Factor Authentication)
- RBAC (Role-Based Access Control)
- X.509 certificates
- Key management (vault)

### intel-armee
Import: `sangisa { GestionnaireLogsSecurises, DetecteurAnomalies, AnalyseurMenaces } depuis "intel-armee"`

**Common operations:**
- Secure logging
- Anomaly detection
- Threat analysis
- System monitoring

---

## Code Structure

### File Extension
- Use `.lingala` extension for LingalaAutomation files

### Comments
```lingala
// Single line comment

/* Multi-line
   comment */
```

### Block Closure
- AST compilation uses `}` for block closure
- Do NOT use `suka` for block closure (suka is for break only)

---

## Best Practices for AI

### When Generating Code
1. Always use `tanga` for variable declarations
2. Always use `mosala` for function definitions
3. Always use `banda` to start blocks
4. Always use `}` to close blocks
5. Use type annotations with `mboka` when possible
6. Use security libraries for sensitive operations
7. Include error handling with `essayer/catch`

### When Translating Code
1. `let/const/var` → `tanga`
2. `function` → `mosala`
3. `if` → `soki`
4. `else` → `osi`
5. `for` → `kanda`
6. `while` → `tokisa`
7. `return` → `zonga`
8. `console.log` → `elobi`
9. `class` → `klasi`
10. `new` → `kokisa`

### When Explaining Code
1. Reference the Lingala meaning of keywords
2. Explain the hybrid syntax model
3. Highlight security features when applicable
4. Mention obfuscation is enabled by default

---

## Example Patterns

### Hello World
```lingala
elobi("Mbote, mokili!");
```

### Function with Parameters
```lingala
mosala additionner(a, b) banda
  zonga a + b;
}
```

### Class Definition
```lingala
klasi Personne {
  mosala Personne(nom) banda
    oyo.nom = nom;
  }

  mosala saluer() banda
    elobi("Mbote, " + oyo.nom);
  }
}
```

### Error Handling
```lingala
essayer banda
  // code
} catch erreur bande
  elobi("Erreur: " + erreur);
}
```

### Using crypto-armee
```lingala
sangisa { CrypteurAES } depuis "crypto-armee";

tanga crypteur = nouveau CrypteurAES("cle-secrete");
tanga chiffre = crypteur.crypter("message");
```

---

## Repository Structure

- `src/` - Source code (TypeScript)
- `examples/` - Code examples (LingalaAutomation)
- `tests/` - Unit tests
- `vscode-extension/` - VS Code extension
- `docs/` - Documentation

---

## Compilation

### AST Compilation (Recommended)
```bash
node dist/cli-fast.js fichier.lingala --ast
```

### Regex Compilation (Legacy)
```bash
node dist/cli.js fichier.lingala
```

### With Obfuscation (Default)
```bash
node dist/cli-fast.js fichier.lingala --ast
# Obfuscation is enabled by default (level: moyen)
```

### Without Obfuscation (Development)
```bash
node dist/cli-fast.js fichier.lingala --ast --no-obfuscate
```

---

## Additional Resources

- GitHub: https://github.com/me45-41/lingala-automation
- Extension: https://github.com/me45-41/lingala-automation/tree/main/vscode-extension
- Specification: SPECIFICATION.md
- Author: MUSABA MUNGWARI Victor (Ingénieur en Informatique de Gestion, RDC)

---

## AI Integration Notes

This language is designed for:
- Automation tasks
- Web development
- Security applications
- Defense and civilian use in the DRC

The hybrid syntax (Lingala keywords + JavaScript operators) makes it:
- Accessible to Lingala speakers
- Easy to learn for JavaScript developers
- Unique in the programming language landscape

When generating LingalaAutomation code, always prioritize:
1. Correct use of Lingala keywords
2. Type safety with `mboka`
3. Security best practices
4. Error handling
5. Code clarity and maintainability
