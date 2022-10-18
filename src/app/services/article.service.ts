import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URLS } from '../config/api.url.config';
import { Article } from '../shared/article';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class ArticleService extends DataService<Article,number>{

  constructor(http:HttpClient) {
    super(API_URLS.ARTICLES_URL,http)
  }


  uploadFile(file:File):Observable<any>{
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post(API_URLS.ARTICLES_URL+'/import', formData)
  }

  importArticles(articles: Article[]) : Observable<any> {
    return this.http.post(API_URLS.ARTICLES_URL + '/import', articles);
  }



}
