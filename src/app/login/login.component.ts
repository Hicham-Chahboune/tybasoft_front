import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { NotificationType } from '../config/notification-type.enum';
import { AuthenticationService } from '../services/authentication.service';
import { Utilisateur } from '../shared/utilisateur';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {

  showLoading: boolean = false;
  private subiscriptions: Subscription[] = [];

  constructor(private router: Router, private authenticationService: AuthenticationService, private messageService: MessageService) { }

  ngOnInit(): void {
    if (this.authenticationService.isLoggedIn()) {
      this.router.navigateByUrl('/app/reglements');
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  login(user: Utilisateur) {
    this.showLoading = true;
    this.subiscriptions.push(
      this.authenticationService.login(user).subscribe(
        (response: any) => {
          const token = response.headers.get('Jwt-Token');
          this.authenticationService.addTokenToLocalStorge(token);
          this.authenticationService.addUserToLocalStorage(response.body);
          this.router.navigateByUrl('/app');
          this.showLoading = false;
        },
        (errorResponse: any) => {
          if (errorResponse.error.message) {
            this.messageService.add({severity:'error', summary: errorResponse.error.message});
          } else {
            this.messageService.add({severity:'error', summary: "Une erreur s'est produite, veuillez réessaye"});
          }
          this.showLoading = false;
        }
      )
    );
  }
  ngOnDestroy(): void {
    this.subiscriptions.forEach(sub => sub.unsubscribe());
  }
}
