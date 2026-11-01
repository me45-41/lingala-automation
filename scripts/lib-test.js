import { kofuta, kokotaMbote, kobongolaKombo, koyombaMonene, kokotaSe } from "../lib/lib-mongo.js";
    let texte = "  Mbote na LingalaAutomation  ";
    console.log("Longueur : " + kofuta(texte));
    console.log("Contient 'Lingala' : " + kokotaMbote(texte, "Lingala"));
    console.log("Remplacer 'Mbote' par 'Bonsoir' : " + kobongolaKombo(texte, "Mbote", "Bonsoir"));
    console.log("Majuscules : " + koyombaMonene(texte));
    console.log("Sans espaces : " + kokotaSe(texte));
