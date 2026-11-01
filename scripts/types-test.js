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

    console.log("=== Test des Listes (Libuka) ===");
    let liste = new Libuka([1, 2, 3, 4, 5]);
    console.log("Liste créée : " + liste);
    liste.kota(6);
    console.log("Après ajout : " + liste);
    console.log("Longueur : " + liste.bokoni());
    console.log("Premier élément : " + liste.kozwa(0));
    console.log("\n=== Test des Dictionnaires (Diktionere) ===");
    let personne = new Diktionere([["kombo", "Jean"], ["mbula", 25], ["mboka", "Kinshasa"]]);
    console.log("Dictionnaire créé : " + personne);
    console.log("Nom : " + personne.kozwa("kombo"));
    console.log("La clé 'kombo' existe ? " + personne.koyoka("kombo"));
    console.log("\n=== Test des Tuples (Tupple) ===");
    let coordonnees = new Tupple([10, 20, 30]);
    console.log("Tuple créé : " + coordonnees);
    console.log("Longueur : " + coordonnees.bokoni());
    console.log("Première valeur : " + coordonnees.kozwa(0));
    console.log("\n=== Test des Ensembles (Ensemble) ===");
    let unique = new Ensemble([1, 2, 3, 2, 1]);
    console.log("Ensemble créé : " + unique);
    console.log("Longueur : " + unique.bokoni());
    console.log("Contient 2 ? " + unique.koyoka(2));
  } catch (error) {
    console.error('Erreur:', error);
  }
})();
