export class Article {

    constructor(
                public id?:number,
                public externalId?:number,
                public prixVente?:number,
                public reference?: string,
                public description?:string,
                public nom?: string,
                public prixAchat?: number,
                public prixVenteSurPlace?: number,
                public prixVenteParCommande?: number,
                public prixVenteCasa?: number,
                public prixVenteComptoire?: number,
                ) {}
}
