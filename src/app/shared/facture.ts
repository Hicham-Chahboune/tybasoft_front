import { Command } from "./command";

export class Facture {

  constructor(
              public id?: number,
              public commande?: Command,
              public tva?: number,
              public paymentType?: number,
              public date?:Date,
              public numero?:number
            ) {
            }
}
