import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppLayoutModule } from './layout/app.layout.module';
import { LoginComponent } from './login/login.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AppLayoutComponent } from './layout/app.layout.component';
import { UiModule } from './ui-module/ui.module';
import { PasswordModule } from 'primeng/password';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthenticationGuard } from './guard/authentication.guard';
import { AuthenticationService } from './services/authentication.service';
import { AddArticleComponent } from './menu/articles/add-article/add-article.component';
import { EditArticleComponent } from './menu/articles/edit-article/edit-article.component';
import { ArticlesComponent } from './menu/articles/articles.component';
import { CommandesComponent } from './menu/commandes/commandes/commandes.component';
import { DetailCommandeComponent } from './menu/commandes/detail-commande/detail-commande.component';
import { LigneCommandeAddComponent } from './menu/commandes/ligne-commande-add/ligne-commande-add.component';
import { AddCommandeComponent } from './menu/commandes/add-commande/add-commande.component';
import { FacturesComponent } from './menu/fatures/factures/factures.component';
import { FactureDetailComponent } from './menu/fatures/facture-detail/facture-detail.component';
import { ClientsComponent } from './menu/clients/clients.component';
import { VendeursComponent } from './menu/vendeurs/vendeurs/vendeurs.component';



@NgModule({
  declarations: [
    AppComponent,LoginComponent,ArticlesComponent,EditArticleComponent,AddArticleComponent,
    DetailCommandeComponent,
    CommandesComponent,
    LigneCommandeAddComponent,
    AddCommandeComponent,
    FacturesComponent,
    FactureDetailComponent,ClientsComponent, VendeursComponent
  ],
  imports: [
    BrowserModule,
    AppLayoutModule,
    UiModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule
    ],
  providers: [
    MessageService,
    ConfirmationService,
    AuthenticationService,
    AuthenticationGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
],
  bootstrap: [AppComponent]
})
export class AppModule { }
