import {Ville} from "./ville";

export class Fournisseur {

    constructor(public id?: number,
                public nom?: string,
                public prenom?: string,
                public tel?: string,
                public ville?: Ville,) {}
}
