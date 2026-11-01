import * as automation from "./automation.js";
import { Libuka, Diktionere, Tupple, Ensemble } from "./types.js";
import * as http from "./http.js";
import * as html from "./html.js";
import * as server from "./server.js";
import * as css from "./css.js";
import * as database from "./database.js";
import * as templates from "./templates.js";
import * as testing from "./testing.js";
import * as standards from "./standards.js";
import { LingalaRuntime } from "./runtime.js";
import { sangisa } from "./errors.js";

(async () => {
  try {

    let nombre = 42;
    let texte = "Bonjour";
    let vrai = true;
    let resultat = nombre + 10;
    console.log("Nombre est supérieur à 20");
  } catch (error) {
    console.error('Erreur:', error);
  }
})();
