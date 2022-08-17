import {Ville} from "./ville";

export class Vendeur {

    constructor(public id?: number,
                public nomComplet?: string,
                public telProfess?: string,
                public mailProfess?: string,
                public externalRef?: string,
                public telUrgence?: string,
                ) {}
}
