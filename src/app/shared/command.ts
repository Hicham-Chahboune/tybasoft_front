import { CommandeStatus } from "../config/commande-status";
import { Client } from "./client";
import { LigneCommande } from "./LigneCommande";
import { Vendeur } from "./vendeur";

export class Command {

  constructor(
              public reference?: string,
              // public prisPar?: string,
              public status?: CommandeStatus,

              // public total?: number,
              public date?: Date,
              // public clientId?: number,
              public ligneCommandes?: LigneCommande[],
              public client?: Client,
              public vendeur?: Vendeur,
              public id?: number,
              public commandeType?:string,
              public nbAlerts?:number,
              public nbFactures?:number,
            ) {
            }
}