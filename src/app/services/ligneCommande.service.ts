import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URLS } from '../config/api.url.config';
import { CommandeStatus } from '../config/commande-status';
import { Command } from '../shared/command';
import { LigneCommande } from '../shared/LigneCommande';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class LigneCommandeService extends DataService<LigneCommande,number>{

  constructor(http:HttpClient) {
    super(API_URLS.LIGNE_DE_COMMANDE_URL,http)
  }




}
