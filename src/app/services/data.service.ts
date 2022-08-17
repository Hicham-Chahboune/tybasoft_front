import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export class DataService<T,U> {


  constructor(private url:string,protected http: HttpClient) {}
  

  getAll():Observable<T[]> {
    return this.http.get<T[]>(this.url);
  }
  getById(id: U):Observable<T> {
    return this.http.get<T>(this.url+ `/${id}`);
  }
  create(resource:T):Observable<T> {
    return this.http.post<T>(this.url, resource);
  }
  update(resource:T):Observable<T> {
    return this.http.put<T>(this.url, resource);
  }
  delete(id:U):Observable<any> {
    return this.http.delete(this.url+'/remove' +`/${id}`);
  }
  deleteAll(ids:U[]):Observable<any> {
    return this.http.post(this.url+'/remove',ids);
  }

}
