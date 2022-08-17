import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { API_URLS } from '../config/api.url.config';

@Injectable()
export class AuthInterceptor implements HttpInterceptor { 

  constructor(private authentificationService: AuthenticationService) {}

  intercept(request: HttpRequest<unknown>, handler: HttpHandler): Observable<HttpEvent<any>> {
    if(request.url.includes(API_URLS.LOGIN_URL)){
      return handler.handle(request);
    }
    this.authentificationService.loadTokenFromLocalStorge();
    const token = this.authentificationService.getToken();
    const clonedRequest = request.clone({setHeaders:{Authorization: `Bearer ${token}`}});
    return handler.handle(clonedRequest); 
  }
}
