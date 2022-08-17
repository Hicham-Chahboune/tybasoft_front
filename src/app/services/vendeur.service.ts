import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URLS } from '../config/api.url.config';
import { Client } from '../shared/client';
import { Vendeur } from '../shared/vendeur';
import { DataService } from './data.service';

@Injectable({providedIn: 'root'})
export class VendeurService extends DataService<Vendeur,number>{
  constructor(http: HttpClient) {
    super(API_URLS.VENDEURS_URL,http)
   }

   importClient(vendeurs: Vendeur[]) : Observable<any> {
    return this.http.post(API_URLS.VENDEURS_URL + '/import', vendeurs);
  }


}
