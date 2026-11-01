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

    console.log("Test Addition : " + (2 + 2));
    console.log("Test Soustraction : " + (5 - 3));
    console.log("Test Condition : " + true);
  } catch (error) {
    console.error('Erreur:', error);
  }
})();
