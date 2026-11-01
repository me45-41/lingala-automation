// OpenRouter API Wrapper for LingalaAutomation
// This wrapper uses OpenRouter API to generate LingalaAutomation code

class LingalaAutomationGenerator {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = "https://openrouter.ai/api/v1";
    this.systemPrompt = this.getSystemPrompt();
  }

  getSystemPrompt() {
    return `You are an expert in LingalaAutomation, a programming language in Lingala (a Bantu language spoken in the DRC).

SYNTAX RULES:
- Use "tanga" for variable declarations (not let/const/var)
- Use "mosala" for function definitions (not function)
- Use "soki" for if statements (not if)
- Use "osi" for else statements (not else)
- Use "banda" to start blocks (after conditions/loops)
- Use "}" to close blocks (not suka - suka is for break only)
- Use "kanda" for for loops (not for)
- Use "tokisa" for while loops (not while)
- Use "elobi" for print/output (not console.log)
- Use "zonga" for return (not return)
- Use "klasi" for class (not class)
- Use "kokisa" for new/instantiate (not new)
- Use "essayer" for try (not try)
- Use "catch" for catch
- Use "telemaka" for finally

TYPE SAFETY:
- Use "mboka" for type annotations when possible
- Example: tanga nombre mboka Number = 42;

SECURITY LIBRARIES:
- crypto-armee: sangisa { CrypteurAES, CrypteurRSA } depuis "crypto-armee"
- auth-armee: sangisa { GestionnaireMFA, GestionnaireRBAC } depuis "auth-armee"
- intel-armee: sangisa { DetecteurAnomalies, AnalyseurMenaces } depuis "intel-armee"

EXAMPLE:
tanga nombre = 42;
mosala additionner(a, b) banda
  zonga a + b;
}
soki nombre > 10 banda
  elobi("Grand");
}

ALWAYS:
- Use proper LingalaAutomation syntax
- Include type annotations with mboka
- Use security libraries for sensitive operations
- Include error handling with essayer/catch
- Follow the hybrid syntax model (Lingala keywords + JavaScript operators)`;
  }

  async generateCode(prompt, model = "anthropic/claude-3-haiku") {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://github.com/me45-41/lingala-automation",
          "X-Title": "LingalaAutomation"
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: "system",
              content: this.systemPrompt
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message);
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error generating code:", error);
      throw error;
    }
  }

  async translateCode(sourceCode, sourceLanguage = "javascript", model = "anthropic/claude-3-haiku") {
    const prompt = `Translate this ${sourceLanguage} code to LingalaAutomation:

${sourceCode}

Use the correct syntax rules for LingalaAutomation. Include type annotations and error handling.`;

    return this.generateCode(prompt, model);
  }

  async explainCode(code, model = "anthropic/claude-3-haiku") {
    const prompt = `Explain this LingalaAutomation code in detail:

${code}

Include:
- What each keyword means in Lingala
- How the code works
- Any security features used
- Best practices demonstrated`;

    return this.generateCode(prompt, model);
  }

  async debugCode(code, model = "anthropic/claude-3-haiku") {
    const prompt = `Debug this LingalaAutomation code:

${code}

Identify:
- Syntax errors
- Logic errors
- Security issues
- Best practice violations

Provide corrected code with explanations.`;

    return this.generateCode(prompt, model);
  }

  async generateWithExamples(description, model = "anthropic/claude-3-haiku") {
    const prompt = `Generate LingalaAutomation code for: ${description}

Provide:
1. The complete code
2. Explanation of the code
3. Usage examples

Use proper syntax, type annotations, and error handling.`;

    return this.generateCode(prompt, model);
  }
}

// Example usage
async function main() {
  const generator = new LingalaAutomationGenerator("YOUR_OPENROUTER_API_KEY");

  try {
    // Generate code
    const code = await generator.generateCode("Create a function that calculates the factorial of a number");
    console.log("Generated Code:");
    console.log(code);

    // Translate code
    const translated = await generator.translateCode("function add(a, b) { return a + b; }", "javascript");
    console.log("\nTranslated Code:");
    console.log(translated);

    // Explain code
    const explained = await generator.explainCode("tanga x = 42; elobi(x);");
    console.log("\nExplained Code:");
    console.log(explained);

  } catch (error) {
    console.error("Error:", error);
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LingalaAutomationGenerator;
}
