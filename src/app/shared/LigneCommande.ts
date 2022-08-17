import { Article } from "./article";
import { Command } from "./command";

export class LigneCommande {

  constructor(
              public articleReference?:string,
              public qnt?: number,
              public sousTotal?: number,
              public prixVentReel?: number,
              public id?: number,
              public article?: Article,
              public commandeId?: number,
              public commande?:Command
              ) {}
}
