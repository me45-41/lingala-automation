/**
 * Bibliothèques Standards pour LingalaAutomation
 * CSV, XML, Date/Time, Cryptographie
 */
// CSV Parsing
export function kotaCSV(data) {
    // Garde : éviter de traiter des données vides
    if (!data || data.trim() === '') {
        return [];
    }
    const lines = data.split('\n');
    const result = [];
    for (const line of lines) {
        // Ignorer les lignes vides
        const trimmedLine = line.trim();
        if (trimmedLine === '') {
            continue;
        }
        // Parser la ligne avec gestion des guillemets
        const row = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];
            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    // Guillemets échappés ("")
                    current += '"';
                    i++; // Sauter le prochain guillemet
                }
                else {
                    // Basculer le mode guillemets
                    inQuotes = !inQuotes;
                }
            }
            else if (char === ',' && !inQuotes) {
                // Séparateur de champ hors des guillemets
                row.push(current.trim());
                current = '';
            }
            else {
                current += char;
            }
        }
        // Ajouter le dernier champ
        row.push(current.trim());
        result.push(row);
    }
    return result;
}
export function kobimaCSV(data) {
    return data.map(row => row.join(',')).join('\n');
}
// XML Simple Parsing
export function kotaXML(xml) {
    const result = {};
    const regex = /<(\w+)>(.*?)<\/\1>/g;
    let match;
    while ((match = regex.exec(xml)) !== null) {
        result[match[1]] = match[2];
    }
    return result;
}
// Date/Time Avancé
export function mbulaSika() {
    return new Date();
}
export function kobimaMbalu(date, format) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return format
        .replace('YYYY', String(year))
        .replace('MM', month)
        .replace('DD', day);
}
export function kobimisaMpamba(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
// Cryptographie simple (hash)
export function salaHash(text) {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        const char = text.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
}
export function kobimisa(text) {
    return btoa(text);
}
export function kokata(encoded) {
    return atob(encoded);
}
