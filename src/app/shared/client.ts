import { Ville } from './ville';

export class Client {
  constructor(
    public id?: number,
    public externalRef?: string,
    public nomComplet?: string,
    // public prenom?: string,
    public tel?: string,
    public plafond?: number,
    public credit?: number,
    public ville?: Ville,
    public car?: number,
    public caa?: number,
    public incident?: number,
    public nbCommands?: number,
    public rue?:string
  ) {}
}
