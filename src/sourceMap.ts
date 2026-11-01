import * as fs from "fs";
import * as path from "path";

/**
 * Information de mapping pour une ligne de code
 */
interface SourceMapping {
  lingalaFile: string;
  lingalaLine: number;
  lingalaColumn: number;
  jsFile: string;
  jsLine: number;
  jsColumn: number;
}

/**
 * Gestionnaire de mapping source-to-source
 * Mappe les lignes JavaScript vers les lignes Lingala
 */
export class SourceMapManager {
  private mappings: Map<string, SourceMapping[]> = new Map();

  /**
   * Génère un mapping pour un fichier compilé
   */
  generateMapping(lingalaFile: string, jsFile: string): void {
    const lingalaContent = fs.readFileSync(lingalaFile, "utf8");
    const jsContent = fs.readFileSync(jsFile, "utf8");

    const lingalaLines = lingalaContent.split("\n");
    const jsLines = jsContent.split("\n");

    const mappings: SourceMapping[] = [];

    // Mapping simple : ligne par ligne (pour le compilateur regex)
    // Pour le compilateur AST, nous aurions besoin d'un mapping plus sophistiqué
    let jsLineIndex = 0;
    for (let i = 0; i < lingalaLines.length && jsLineIndex < jsLines.length; i++) {
      const lingalaLine = lingalaLines[i].trim();
      
      // Ignorer les lignes vides et les commentaires
      if (lingalaLine === "" || lingalaLine.startsWith("//")) {
        continue;
      }

      // Trouver la ligne JavaScript correspondante
      while (jsLineIndex < jsLines.length) {
        const jsLine = jsLines[jsLineIndex].trim();
        
        // Ignorer les lignes vides et les commentaires
        if (jsLine === "" || jsLine.startsWith("//")) {
          jsLineIndex++;
          continue;
        }

        mappings.push({
          lingalaFile,
          lingalaLine: i + 1,
          lingalaColumn: 0,
          jsFile,
          jsLine: jsLineIndex + 1,
          jsColumn: 0
        });

        jsLineIndex++;
        break;
      }
    }

    this.mappings.set(lingalaFile, mappings);
  }

  /**
   * Mappe une ligne JavaScript vers une ligne Lingala
   */
  mapToLingala(jsFile: string, jsLine: number): SourceMapping | null {
    for (const mappings of this.mappings.values()) {
      for (const mapping of mappings) {
        if (mapping.jsFile === jsFile && mapping.jsLine === jsLine) {
          return mapping;
        }
      }
    }
    return null;
  }

  /**
   * Convertit une stack trace JavaScript en stack trace Lingala
   */
  convertStackTrace(stackTrace: string): string {
    const lines = stackTrace.split("\n");
    const convertedLines: string[] = [];

    for (const line of lines) {
      // Analyser la ligne de stack trace
      const match = line.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/);
      
      if (match) {
        const [, functionName, jsFile, jsLine, jsColumn] = match;
        const mapping = this.mapToLingala(jsFile, parseInt(jsLine));

        if (mapping) {
          convertedLines.push(
            `    at ${functionName} (${mapping.lingalaFile}:${mapping.lingalaLine}:${mapping.lingalaColumn})`
          );
        } else {
          convertedLines.push(line);
        }
      } else {
        convertedLines.push(line);
      }
    }

    return convertedLines.join("\n");
  }

  /**
   * Sauvegarde les mappings dans un fichier
   */
  saveMappings(outputFile: string): void {
    const data = Object.fromEntries(this.mappings);
    fs.writeFileSync(outputFile, JSON.stringify(data, null, 2), "utf8");
  }

  /**
   * Charge les mappings depuis un fichier
   */
  loadMappings(inputFile: string): void {
    if (!fs.existsSync(inputFile)) {
      return;
    }

    try {
      const content = fs.readFileSync(inputFile, "utf8");
      const data = JSON.parse(content);
      this.mappings = new Map(Object.entries(data));
    } catch {
      // Ignorer les erreurs de chargement
    }
  }
}
