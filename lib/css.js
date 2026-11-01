/**
 * Module CSS pour LingalaAutomation
 * Permet de créer des styles CSS dynamiquement, comme styled-components en TypeScript
 */
// Feuille de styles
export class StyleSheet {
    rules = [];
    // Ajouter une règle CSS
    kota(selector, properties) {
        this.rules.push({ selector, properties });
    }
    // Couleur du texte
    langi(selector, color) {
        this.kota(selector, { color });
    }
    // Couleur de fond
    nsima(selector, color) {
        this.kota(selector, { 'background-color': color });
    }
    // Taille du texte
    bonene(selector, size) {
        this.kota(selector, { 'font-size': size });
    }
    // Bordure
    ndelo(selector, border) {
        this.kota(selector, { border });
    }
    // Coins arrondis
    zinga(selector, radius) {
        this.kota(selector, { 'border-radius': radius });
    }
    // Marge extérieure
    mbole(selector, margin) {
        this.kota(selector, { margin });
    }
    // Espacement intérieur
    katikati(selector, padding) {
        this.kota(selector, { padding });
    }
    // Largeur
    kobimisa(selector, width) {
        this.kota(selector, { width });
    }
    // Hauteur
    botuka(selector, height) {
        this.kota(selector, { height });
    }
    // Affichage
    kobanda(selector, display) {
        this.kota(selector, { display });
    }
    // Flexbox - direction
    molongo(selector, direction = 'row') {
        this.kota(selector, { display: 'flex', 'flex-direction': direction });
    }
    // Flexbox - alignement horizontal
    katikatiHorizontal(selector, align = 'center') {
        this.kota(selector, { display: 'flex', 'justify-content': align });
    }
    // Flexbox - alignement vertical
    katikatiVertical(selector, align = 'center') {
        this.kota(selector, { display: 'flex', 'align-items': align });
    }
    // Flexbox - gap
    kobola(selector, gap) {
        this.kota(selector, { display: 'flex', gap });
    }
    // Position
    kima(selector, position = 'static') {
        this.kota(selector, { position });
    }
    // Position - top
    seko(selector, top) {
        this.kota(selector, { top });
    }
    // Position - bottom
    sekoNaMolongo(selector, bottom) {
        this.kota(selector, { bottom });
    }
    // Position - left
    sekoNaLiboso(selector, left) {
        this.kota(selector, { left });
    }
    // Position - right
    sekoNaMbote(selector, right) {
        this.kota(selector, { right });
    }
    // Z-index
    kotisa(selector, zIndex) {
        this.kota(selector, { 'z-index': zIndex });
    }
    // Opacité
    boselu(selector, opacity) {
        this.kota(selector, { opacity });
    }
    // Visibilité
    koyoka(selector, visibility = 'visible') {
        this.kota(selector, { visibility });
    }
    // Curseur
    kotaMouse(selector, cursor = 'default') {
        this.kota(selector, { cursor });
    }
    // Text decoration
    kobomaText(selector, decoration = 'none') {
        this.kota(selector, { 'text-decoration': decoration });
    }
    // Text transform
    kobandaText(selector, transform = 'lowercase') {
        this.kota(selector, { 'text-transform': transform });
    }
    // Font weight
    mbata(selector, weight = 'normal') {
        this.kota(selector, { 'font-weight': weight });
    }
    // Font family
    kokoma(selector, family) {
        this.kota(selector, { 'font-family': family });
    }
    // Text align
    kobimaText(selector, align = 'left') {
        this.kota(selector, { 'text-align': align });
    }
    // Overflow
    kobimaOverflow(selector, overflow = 'visible') {
        this.kota(selector, { overflow });
    }
    // Shadow
    kimaShadow(selector, shadow) {
        this.kota(selector, { 'box-shadow': shadow });
    }
    // Transitions
    kobimisaTransition(selector, property, duration = '0.3s') {
        this.kota(selector, { transition: `${property} ${duration}` });
    }
    // Transformations
    kobongola(selector, transform) {
        this.kota(selector, { transform });
    }
    // Générer le CSS
    kobomaCSS() {
        return this.rules
            .map(rule => {
            const props = Object.entries(rule.properties)
                .map(([key, value]) => `  ${key}: ${value};`)
                .join('\n');
            return `${rule.selector} {\n${props}\n}`;
        })
            .join('\n\n');
    }
    // Effacer tous les styles
    silisa() {
        this.rules = [];
    }
}
/**
 * Créer une classe CSS personnalisée
 * @param className - Nom de la classe
 * @param properties - Propriétés CSS
 */
export function kelasi(className, properties) {
    const props = Object.entries(properties)
        .map(([key, value]) => `  ${key}: ${value};`)
        .join('\n');
    return `.${className} {\n${props}\n}`;
}
/**
 * Média queries responsive
 * @param minWidth - Largeur minimale
 * @param css - CSS à appliquer
 */
export function responsive(minWidth, css) {
    return `@media (min-width: ${minWidth}) {\n  ${css}\n}`;
}
/**
 * Animation keyframes
 * @param animationName - Nom de l'animation
 * @param keyframes - Keyframes CSS
 */
export function kobimaAnimation(animationName, keyframes) {
    const frames = Object.entries(keyframes)
        .map(([percent, props]) => {
        const properties = Object.entries(props)
            .map(([key, value]) => `    ${key}: ${value};`)
            .join('\n');
        return `  ${percent} {\n${properties}\n  }`;
    })
        .join('\n');
    return `@keyframes ${animationName} {\n${frames}\n}`;
}
// Instance globale de StyleSheet pour simplifier l'utilisation
const globalStyleSheet = new StyleSheet();
// Fonctions globales wrapper pour simplifier l'utilisation
export function langi(selector, color) {
    globalStyleSheet.langi(selector, color);
}
export function nsima(selector, color) {
    globalStyleSheet.nsima(selector, color);
}
export function bonene(selector, size) {
    globalStyleSheet.bonene(selector, size);
}
export function ndelo(selector, border) {
    globalStyleSheet.ndelo(selector, border);
}
export function zinga(selector, radius) {
    globalStyleSheet.zinga(selector, radius);
}
export function mbole(selector, margin) {
    globalStyleSheet.mbole(selector, margin);
}
export function katikati(selector, padding) {
    globalStyleSheet.katikati(selector, padding);
}
export function kobimisa(selector, width) {
    globalStyleSheet.kobimisa(selector, width);
}
export function botuka(selector, height) {
    globalStyleSheet.botuka(selector, height);
}
export function kobanda(selector, display) {
    globalStyleSheet.kobanda(selector, display);
}
export function molongo(selector, direction = 'row') {
    globalStyleSheet.molongo(selector, direction);
}
export function katikatiHorizontal(selector, align = 'center') {
    globalStyleSheet.katikatiHorizontal(selector, align);
}
export function katikatiVertical(selector, align = 'center') {
    globalStyleSheet.katikatiVertical(selector, align);
}
export function kobola(selector, gap) {
    globalStyleSheet.kobola(selector, gap);
}
export function kima(selector, position = 'static') {
    globalStyleSheet.kima(selector, position);
}
export function seko(selector, top) {
    globalStyleSheet.seko(selector, top);
}
export function sekoNaMolongo(selector, bottom) {
    globalStyleSheet.sekoNaMolongo(selector, bottom);
}
export function sekoNaLiboso(selector, left) {
    globalStyleSheet.sekoNaLiboso(selector, left);
}
export function sekoNaMbote(selector, right) {
    globalStyleSheet.sekoNaMbote(selector, right);
}
export function kotisa(selector, zIndex) {
    globalStyleSheet.kotisa(selector, zIndex);
}
export function boselu(selector, opacity) {
    globalStyleSheet.boselu(selector, opacity);
}
export function koyokaCSS(selector, visibility = 'visible') {
    globalStyleSheet.koyoka(selector, visibility);
}
export function kotaMouse(selector, cursor = 'default') {
    globalStyleSheet.kotaMouse(selector, cursor);
}
export function kobomaText(selector, decoration = 'none') {
    globalStyleSheet.kobomaText(selector, decoration);
}
export function kobandaText(selector, transform = 'lowercase') {
    globalStyleSheet.kobandaText(selector, transform);
}
export function mbata(selector, weight = 'normal') {
    globalStyleSheet.mbata(selector, weight);
}
export function kokoma(selector, family) {
    globalStyleSheet.kokoma(selector, family);
}
export function kobimaText(selector, align = 'left') {
    globalStyleSheet.kobimaText(selector, align);
}
export function kobimaOverflow(selector, overflow = 'visible') {
    globalStyleSheet.kobimaOverflow(selector, overflow);
}
export function kimaShadow(selector, shadow) {
    globalStyleSheet.kimaShadow(selector, shadow);
}
export function kobimisaTransition(selector, property, duration = '0.3s') {
    globalStyleSheet.kobimisaTransition(selector, property, duration);
}
export function kobongolaCSS(selector, transform) {
    globalStyleSheet.kobongola(selector, transform);
}
export function kobomaCSS() {
    return globalStyleSheet.kobomaCSS();
}
export function silisaCSS() {
    globalStyleSheet.silisa();
}
