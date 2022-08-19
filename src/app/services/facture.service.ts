import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URLS } from '../config/api.url.config';
import { Article } from '../shared/article';
import { Facture } from '../shared/facture';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class FactureService extends DataService<Facture,number>{

  constructor(http:HttpClient) {
    super(API_URLS.FACTURES_URL,http)
  }

  imprimer(id:number){
    return this.http.get(API_URLS.FACTURES_URL+'/imprimer/'+id,{ responseType: 'blob'});

  }

}
