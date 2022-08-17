import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MessageService } from 'primeng/api';
import { Observable, Subscription, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { API_URLS } from '../config/api.url.config';
import { NotificationType } from '../config/notification-type.enum';
import { Utilisateur } from '../shared/utilisateur';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private token:any;
  private jwtHelper = new JwtHelperService();
  private tokenSubscription = new Subscription()
  private timeout:any;
  constructor(private http: HttpClient, private router: Router, private messageService: MessageService) { }

  login(utilisateur: Utilisateur): Observable<HttpResponse<Utilisateur>> {
    return this.http.post<Utilisateur>(API_URLS.LOGIN_URL, utilisateur, {observe : 'response'});
  }

  addTokenToLocalStorge(token:string):void {
    this.timeout = this.jwtHelper.getTokenExpirationDate(token)!.valueOf() - new Date().valueOf();
    this.token = token;
    localStorage.setItem('token', token);
    this.expirationCounter(this.timeout);
  }

  expirationCounter(timeout:any) {
    this.tokenSubscription.unsubscribe();
    this.tokenSubscription = of(null).pipe(delay(timeout)).subscribe((expired:any) => {
      console.log('EXPIRED!!');
      this.logout();
      this.messageService.add({severity:'warn', summary: 'Le temps a expiré, veuillez vous connecter'});
      this.router.navigate(["/login"]);
    });
  }

  addUserToLocalStorage(user : Utilisateur): void {
    localStorage.setItem('authUser', JSON.stringify(user));
  }

  loadUserFromLocalStrogae(): Utilisateur {
    return JSON.parse(localStorage['authUser']);
  }

  loadTokenFromLocalStorge() : void {
    this.token = localStorage.getItem('token');
  }

  getToken():string {
    return this.token;
  }

  isLoggedIn(): boolean | any{
    this.loadTokenFromLocalStorge();
    if(this.token != null && this.token !==''){
      if(this.jwtHelper.decodeToken(this.token).sub != null || ''){
        if(!this.jwtHelper.isTokenExpired(this.token)){
          return true;
        }
      }
    }else{
      this.logout();
      return false;
    }
  }

  logout(): void {
    this.token = null;
    this.tokenSubscription.unsubscribe();
    localStorage.clear();
  }
}
