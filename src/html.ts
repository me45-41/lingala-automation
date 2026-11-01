/**
 * Module de génération HTML pour LingalaAutomation
 * Permet de créer des pages web dynamiquement
 */

// Élément HTML
export interface HtmlElement {
  tag: string;
  attributes: Record<string, string>;
  content: string;
  children: HtmlElement[];
}

/**
 * Créer un élément HTML
 * @param tag - Balise HTML (div, p, h1, etc.)
 * @param attributes - Attributs (id, class, style, etc.)
 * @param content - Contenu texte
 * @param children - Éléments enfants
 */
export function kokota(tag: string, attributes: Record<string, string> = {}, content: string = "", children: HtmlElement[] = []): HtmlElement {
  return {
    tag,
    attributes,
    content,
    children
  };
}

/**
 * Générer le HTML à partir d'un élément
 * @param element - Élément HTML
 */
export function kobomaHTML(element: HtmlElement): string {
  const attrs = Object.entries(element.attributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ');

  const attrString = attrs ? ` ${attrs}` : '';
  const childrenHTML = element.children.map(child => kobomaHTML(child)).join('\n');

  if (element.children.length > 0) {
    return `<${element.tag}${attrString}>${element.content}${childrenHTML}</${element.tag}>`;
  }

  return `<${element.tag}${attrString}>${element.content}</${element.tag}>`;
}

/**
 * Générer une page HTML complète
 * @param title - Titre de la page
 * @param body - Contenu du body
 * @param styles - Styles CSS
 * @param scripts - Scripts JavaScript
 */
export function kokotaPage(title: string, body: string, styles: string = "", scripts: string = ""): string {
  return `<!DOCTYPE html>
<html lang="lingala">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    ${styles}
  </style>
</head>
<body>
  ${body}
  <script>
    ${scripts}
  </script>
</body>
</html>`;
}

/**
 * Créer un lien (anchor)
 * @param text - Texte du lien
 * @param href - URL du lien
 * @param attributes - Attributs supplémentaires
 */
export function kotaLink(text: string, href: string, attributes: Record<string, string> = {}): HtmlElement {
  return kokota('a', { href, ...attributes }, text);
}

/**
 * Créer une image
 * @param src - Source de l'image
 * @param alt - Texte alternatif
 * @param attributes - Attributs supplémentaires
 */
export function kotaImage(src: string, alt: string = "", attributes: Record<string, string> = {}): HtmlElement {
  return kokota('img', { src, alt, ...attributes });
}

/**
 * Créer un formulaire
 * @param action - URL du formulaire
 * @param method - Méthode (GET, POST)
 * @param children - Éléments du formulaire
 */
export function kotaForm(action: string, method: string = "POST", children: HtmlElement[] = []): HtmlElement {
  return kokota('form', { action, method }, "", children);
}

/**
 * Créer un champ de formulaire
 * @param type - Type du champ (text, password, email, etc.)
 * @param name - Nom du champ
 * @param attributes - Attributs supplémentaires
 */
export function kotaInput(type: string, name: string, attributes: Record<string, string> = {}): HtmlElement {
  return kokota('input', { type, name, ...attributes });
}

/**
 * Créer un bouton
 * @param text - Texte du bouton
 * @param attributes - Attributs supplémentaires
 */
export function kotaButton(text: string, attributes: Record<string, string> = {}): HtmlElement {
  return kokota('button', attributes, text);
}

/**
 * Créer une table
 * @param headers - En-têtes de la table
 * @param rows - Lignes de données
 */
export function kotaTable(headers: string[], rows: string[][]): HtmlElement {
  const headerCells = headers.map(h => kokota('th', {}, h));
  const headerRow = kokota('tr', {}, "", headerCells);

  const bodyRows = rows.map(row => {
    const cells = row.map(cell => kokota('td', {}, cell));
    return kokota('tr', {}, "", cells);
  });

  return kokota('table', {}, "", [headerRow, ...bodyRows]);
}

/**
 * Créer une liste
 * @param items - Éléments de la liste
 * @param ordered - Si true, crée une liste ordonnée (ol)
 */
export function kotaList(items: string[], ordered: boolean = false): HtmlElement {
  const tag = ordered ? 'ol' : 'ul';
  const listItems = items.map(item => kokota('li', {}, item));
  return kokota(tag, {}, "", listItems);
}
