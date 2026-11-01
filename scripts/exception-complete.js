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
      console.log("Test des exceptions personnalisées");
      let fichierExiste = false;
      if ((fichierExiste == false)) {
        await sangisa("Fichier introuvable", "FILE_NOT_FOUND");
      }
      console.log("Ce message ne s'affichera pas");
      } catch (erreur) {
      console.log("Type d'erreur : " + erreur.name);
      console.log("Message : " + erreur.message);
      if ((erreur.code != undefined)) {
        console.log("Code d'erreur : " + erreur.code);
      }
      } finally {
      console.log("Nettoyage des ressources...");
      console.log("Test terminé avec succès");
    }
  } catch (error) {
    console.error('Erreur:', error);
  }
})();
