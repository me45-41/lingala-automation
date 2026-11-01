/**
 * Formateur Basique pour LingalaAutomation
 * Formate le code pour améliorer la lisibilité
 */

export class LingalaFormatter {
  format(source: string): string {
    let formatted = source;
    
    // Normaliser les espaces autour des opérateurs
    formatted = formatted.replace(/\s*([=+\-*/<>!&|^])\s*/g, " $1 ");
    
    // Normaliser les points-virgules
    formatted = formatted.replace(/;\s*/g, ";\n");
    
    // Indenter les blocs
    let indentLevel = 0;
    const lines = formatted.split("\n");
    const indentedLines: string[] = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      
      if (trimmed.includes("}")) {
        indentLevel = Math.max(0, indentLevel - 1);
      }
      
      indentedLines.push("  ".repeat(indentLevel) + trimmed);
      
      if (trimmed.includes("{") || trimmed.includes("banda")) {
        indentLevel++;
      }
    }
    
    return indentedLines.join("\n");
  }
}
