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

    try {
      console.log("Début du bloc essayer");
      let x = 10;
      let y = 0;
      if ((y == 0)) {
        await sangisa("Division par zéro impossible !");
      }
      console.log("Ce message ne s'affichera pas");
      } catch (erreur) {
      console.log("Erreur attrapée : " + erreur.message);
      } finally {
      console.log("Bloc finally toujours exécuté");
      console.log("Programme continué après l'exception");
    }
  } catch (error) {
    console.error('Erreur:', error);
  }
})();
