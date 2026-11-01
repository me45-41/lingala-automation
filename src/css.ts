/**
 * Module CSS pour LingalaAutomation
 * Permet de créer des styles CSS dynamiquement, comme styled-components en TypeScript
 */

// Règle CSS
export interface CssRule {
  selector: string;
  properties: Record<string, string>;
}

// Feuille de styles
export class StyleSheet {
  private rules: CssRule[] = [];

  // Ajouter une règle CSS
  kota(selector: string, properties: Record<string, string>): void {
    this.rules.push({ selector, properties });
  }

  // Couleur du texte
  langi(selector: string, color: string): void {
    this.kota(selector, { color });
  }

  // Couleur de fond
  nsima(selector: string, color: string): void {
    this.kota(selector, { 'background-color': color });
  }

  // Taille du texte
  bonene(selector: string, size: string): void {
    this.kota(selector, { 'font-size': size });
  }

  // Bordure
  ndelo(selector: string, border: string): void {
    this.kota(selector, { border });
  }

  // Coins arrondis
  zinga(selector: string, radius: string): void {
    this.kota(selector, { 'border-radius': radius });
  }

  // Marge extérieure
  mbole(selector: string, margin: string): void {
    this.kota(selector, { margin });
  }

  // Espacement intérieur
  katikati(selector: string, padding: string): void {
    this.kota(selector, { padding });
  }

  // Largeur
  kobimisa(selector: string, width: string): void {
    this.kota(selector, { width });
  }

  // Hauteur
  botuka(selector: string, height: string): void {
    this.kota(selector, { height });
  }

  // Affichage
  kobanda(selector: string, display: string): void {
    this.kota(selector, { display });
  }

  // Flexbox - direction
  molongo(selector: string, direction: 'row' | 'column' = 'row'): void {
    this.kota(selector, { display: 'flex', 'flex-direction': direction });
  }

  // Flexbox - alignement horizontal
  katikatiHorizontal(selector: string, align: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' = 'center'): void {
    this.kota(selector, { display: 'flex', 'justify-content': align });
  }

  // Flexbox - alignement vertical
  katikatiVertical(selector: string, align: 'flex-start' | 'flex-end' | 'center' | 'stretch' = 'center'): void {
    this.kota(selector, { display: 'flex', 'align-items': align });
  }

  // Flexbox - gap
  kobola(selector: string, gap: string): void {
    this.kota(selector, { display: 'flex', gap });
  }

  // Position
  kima(selector: string, position: 'static' | 'relative' | 'absolute' | 'fixed' = 'static'): void {
    this.kota(selector, { position });
  }

  // Position - top
  seko(selector: string, top: string): void {
    this.kota(selector, { top });
  }

  // Position - bottom
  sekoNaMolongo(selector: string, bottom: string): void {
    this.kota(selector, { bottom });
  }

  // Position - left
  sekoNaLiboso(selector: string, left: string): void {
    this.kota(selector, { left });
  }

  // Position - right
  sekoNaMbote(selector: string, right: string): void {
    this.kota(selector, { right });
  }

  // Z-index
  kotisa(selector: string, zIndex: string): void {
    this.kota(selector, { 'z-index': zIndex });
  }

  // Opacité
  boselu(selector: string, opacity: string): void {
    this.kota(selector, { opacity });
  }

  // Visibilité
  koyoka(selector: string, visibility: 'visible' | 'hidden' = 'visible'): void {
    this.kota(selector, { visibility });
  }

  // Curseur
  kotaMouse(selector: string, cursor: 'pointer' | 'default' | 'text' | 'move' = 'default'): void {
    this.kota(selector, { cursor });
  }

  // Text decoration
  kobomaText(selector: string, decoration: 'none' | 'underline' | 'line-through' = 'none'): void {
    this.kota(selector, { 'text-decoration': decoration });
  }

  // Text transform
  kobandaText(selector: string, transform: 'uppercase' | 'lowercase' | 'capitalize' = 'lowercase'): void {
    this.kota(selector, { 'text-transform': transform });
  }

  // Font weight
  mbata(selector: string, weight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' = 'normal'): void {
    this.kota(selector, { 'font-weight': weight });
  }

  // Font family
  kokoma(selector: string, family: string): void {
    this.kota(selector, { 'font-family': family });
  }

  // Text align
  kobimaText(selector: string, align: 'left' | 'right' | 'center' | 'justify' = 'left'): void {
    this.kota(selector, { 'text-align': align });
  }

  // Overflow
  kobimaOverflow(selector: string, overflow: 'visible' | 'hidden' | 'scroll' | 'auto' = 'visible'): void {
    this.kota(selector, { overflow });
  }

  // Shadow
  kimaShadow(selector: string, shadow: string): void {
    this.kota(selector, { 'box-shadow': shadow });
  }

  // Transitions
  kobimisaTransition(selector: string, property: string, duration: string = '0.3s'): void {
    this.kota(selector, { transition: `${property} ${duration}` });
  }

  // Transformations
  kobongola(selector: string, transform: string): void {
    this.kota(selector, { transform });
  }

  // Générer le CSS
  kobomaCSS(): string {
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
  silisa(): void {
    this.rules = [];
  }
}

/**
 * Créer une classe CSS personnalisée
 * @param className - Nom de la classe
 * @param properties - Propriétés CSS
 */
export function kelasi(className: string, properties: Record<string, string>): string {
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
export function responsive(minWidth: string, css: string): string {
  return `@media (min-width: ${minWidth}) {\n  ${css}\n}`;
}

/**
 * Animation keyframes
 * @param animationName - Nom de l'animation
 * @param keyframes - Keyframes CSS
 */
export function kobimaAnimation(animationName: string, keyframes: Record<string, Record<string, string>>): string {
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
export function langi(selector: string, color: string): void {
  globalStyleSheet.langi(selector, color);
}

export function nsima(selector: string, color: string): void {
  globalStyleSheet.nsima(selector, color);
}

export function bonene(selector: string, size: string): void {
  globalStyleSheet.bonene(selector, size);
}

export function ndelo(selector: string, border: string): void {
  globalStyleSheet.ndelo(selector, border);
}

export function zinga(selector: string, radius: string): void {
  globalStyleSheet.zinga(selector, radius);
}

export function mbole(selector: string, margin: string): void {
  globalStyleSheet.mbole(selector, margin);
}

export function katikati(selector: string, padding: string): void {
  globalStyleSheet.katikati(selector, padding);
}

export function kobimisa(selector: string, width: string): void {
  globalStyleSheet.kobimisa(selector, width);
}

export function botuka(selector: string, height: string): void {
  globalStyleSheet.botuka(selector, height);
}

export function kobanda(selector: string, display: string): void {
  globalStyleSheet.kobanda(selector, display);
}

export function molongo(selector: string, direction: 'row' | 'column' = 'row'): void {
  globalStyleSheet.molongo(selector, direction);
}

export function katikatiHorizontal(selector: string, align: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' = 'center'): void {
  globalStyleSheet.katikatiHorizontal(selector, align);
}

export function katikatiVertical(selector: string, align: 'flex-start' | 'flex-end' | 'center' | 'stretch' = 'center'): void {
  globalStyleSheet.katikatiVertical(selector, align);
}

export function kobola(selector: string, gap: string): void {
  globalStyleSheet.kobola(selector, gap);
}

export function kima(selector: string, position: 'static' | 'relative' | 'absolute' | 'fixed' = 'static'): void {
  globalStyleSheet.kima(selector, position);
}

export function seko(selector: string, top: string): void {
  globalStyleSheet.seko(selector, top);
}

export function sekoNaMolongo(selector: string, bottom: string): void {
  globalStyleSheet.sekoNaMolongo(selector, bottom);
}

export function sekoNaLiboso(selector: string, left: string): void {
  globalStyleSheet.sekoNaLiboso(selector, left);
}

export function sekoNaMbote(selector: string, right: string): void {
  globalStyleSheet.sekoNaMbote(selector, right);
}

export function kotisa(selector: string, zIndex: string): void {
  globalStyleSheet.kotisa(selector, zIndex);
}

export function boselu(selector: string, opacity: string): void {
  globalStyleSheet.boselu(selector, opacity);
}

export function koyokaCSS(selector: string, visibility: 'visible' | 'hidden' = 'visible'): void {
  globalStyleSheet.koyoka(selector, visibility);
}

export function kotaMouse(selector: string, cursor: 'pointer' | 'default' | 'text' | 'move' = 'default'): void {
  globalStyleSheet.kotaMouse(selector, cursor);
}

export function kobomaText(selector: string, decoration: 'none' | 'underline' | 'line-through' = 'none'): void {
  globalStyleSheet.kobomaText(selector, decoration);
}

export function kobandaText(selector: string, transform: 'uppercase' | 'lowercase' | 'capitalize' = 'lowercase'): void {
  globalStyleSheet.kobandaText(selector, transform);
}

export function mbata(selector: string, weight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' = 'normal'): void {
  globalStyleSheet.mbata(selector, weight);
}

export function kokoma(selector: string, family: string): void {
  globalStyleSheet.kokoma(selector, family);
}

export function kobimaText(selector: string, align: 'left' | 'right' | 'center' | 'justify' = 'left'): void {
  globalStyleSheet.kobimaText(selector, align);
}

export function kobimaOverflow(selector: string, overflow: 'visible' | 'hidden' | 'scroll' | 'auto' = 'visible'): void {
  globalStyleSheet.kobimaOverflow(selector, overflow);
}

export function kimaShadow(selector: string, shadow: string): void {
  globalStyleSheet.kimaShadow(selector, shadow);
}

export function kobimisaTransition(selector: string, property: string, duration: string = '0.3s'): void {
  globalStyleSheet.kobimisaTransition(selector, property, duration);
}

export function kobongolaCSS(selector: string, transform: string): void {
  globalStyleSheet.kobongola(selector, transform);
}

export function kobomaCSS(): string {
  return globalStyleSheet.kobomaCSS();
}

export function silisaCSS(): void {
  globalStyleSheet.silisa();
}
