/**
 * Bibliothèques Standards pour LingalaAutomation
 * CSV, XML, Date/Time, Cryptographie
 */
// CSV Parsing
export function kotaCSV(data) {
    return data.split('\n').map(line => line.split(','));
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
