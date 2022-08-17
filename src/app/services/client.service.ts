import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URLS } from '../config/api.url.config';
import { Client } from '../shared/client';
import { DataService } from './data.service';

@Injectable({providedIn: 'root'})
export class ClientService extends DataService<Client,number>{
  constructor(http: HttpClient) {
    super(API_URLS.CLIENTS_URL,http)
   }

   importClient(clients: Client[]) : Observable<any> {
    return this.http.post(API_URLS.CLIENTS_URL + '/import', clients);
  }


}
