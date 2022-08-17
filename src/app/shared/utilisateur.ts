import {Role} from "./role";

export class Utilisateur {

  constructor(public id?: number,
              public nom?: string,
              public prenom?: string,
              public username?: string,
              public password?: string,
              public active?: boolean,
              public role?:Role,) {}
}
