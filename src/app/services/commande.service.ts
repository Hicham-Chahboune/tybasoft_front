import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URLS } from '../config/api.url.config';
import { CommandeStatus } from '../config/commande-status';
import { Command } from '../shared/command';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class CommandeService extends DataService<Command,number>{

  constructor(http:HttpClient) {
    super(API_URLS.COMMANDES_URL,http)
  }

   getcommandeTypes():Observable<any> {
     return this.http.get(API_URLS.COMMANDES_URL + '/types');
   }

  importCommandes(commandes: Command[]):Observable<Command[]>{
    return this.http.post<Command[]>(API_URLS.COMMANDES_URL + '/import', commandes)
  }

  getStatus(status:string):CommandeStatus{
    let commandStatus;
    switch (status) {
      case "EN_ATTENT_DE_PAIEMENT":
        console.log("EN_ATTENT_DE_PAIEMENT")
        commandStatus = CommandeStatus.EN_ATTENT_DE_PAIEMENT
        break;
      case "EN_ATTENT_DE_TRANSPORT":
          console.log("EN_ATTENT_DE_TRANSPORT")
          commandStatus = CommandeStatus.EN_ATTENT_DE_TRANSPORT
          break;
      default:
        commandStatus = CommandeStatus.VALIDE
        break;
    }
    return commandStatus
  }


}
