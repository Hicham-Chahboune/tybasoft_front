import { Ville } from './ville';

export class Client {
  constructor(
    public id?: number,
    public externalRef?: string,
    public externalId?:number,
    public nomComplet?: string,
    public tel?: string,
    public adresseComplete?: string,
    public ice?: string,
  ) {}
}
