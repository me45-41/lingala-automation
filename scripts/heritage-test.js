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

    class Muntu {
        constructor(kombo) {
        this.kombo = kombo;
      }
        async saluer() {
        console.log("Mbote, je suis " + this.kombo);
      }
    }
    class Etudiant extends Muntu {
        constructor(kombo, filiere) {
        super(kombo);
        this.filiere = filiere;
      }
        async etudier() {
        console.log(this.kombo + " étudie " + this.filiere);
      }
    }
    let jean = new Muntu("Jean");
    jean.saluer();
    let marie = new Etudiant("Marie", "Informatique");
    marie.saluer();
    marie.etudier();
  } catch (error) {
    console.error('Erreur:', error);
  }
})();
