import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from './guard/authentication.guard';
import { AppLayoutComponent } from './layout/app.layout.component';
import { LoginComponent } from './login/login.component';
import { ArticlesComponent } from './menu/articles/articles.component';
import { ClientsComponent } from './menu/clients/clients.component';
import { AddCommandeComponent } from './menu/commandes/add-commande/add-commande.component';
import { CommandesComponent } from './menu/commandes/commandes/commandes.component';
import { DetailCommandeComponent } from './menu/commandes/detail-commande/detail-commande.component';
import { LigneCommandeAddComponent } from './menu/commandes/ligne-commande-add/ligne-commande-add.component';
import { FactureDetailComponent } from './menu/fatures/facture-detail/facture-detail.component';
import { FacturesComponent } from './menu/fatures/factures/factures.component';
import { VendeursComponent } from './menu/vendeurs/vendeurs/vendeurs.component';


const routes: Routes = [
  { path: '', redirectTo: '/app', pathMatch: 'full' },
  { path: "login", component: LoginComponent },
  { path: 'app', redirectTo: '/app', pathMatch: 'full' },
  {
    path: 'app', component: AppLayoutComponent,
    children: [
      // { path: 'clients', component: ClientsComponent },
      // { path: 'ajouter-client', component: AjouterClientComponent },
      // { path: 'modifier-client/:id', component: ModifierClientComponent },
      // { path: 'reglement-client/:id', component: ReglementClientComponent },
      // { path: 'ajouter-reglement-client/:id', component: AddReglementClientComponent },
      // { path: 'modifier-reglement-client/:id', component: EditReglementClientComponent },
      // { path: 'fournisseurs', component: FournisseursComponent },
      // { path: 'ajouter-fournisseur', component: AddFournisseurComponent },
      // { path: 'modifier-fournisseur/:id', component: ModifierFournisseurComponent },
      // { path: 'utilisateurs', component: UtilisateursComponent },
      // { path: 'ajouter-user', component: AddUtilisateurComponent },
      // { path: 'modifier-utilisateur/:id', component: ModifierUtilisateurComponent },
      // { path: 'reglement-client/:id', component: ReglementClientComponent },
      // { path: 'reglement-fornisseur/:id', component: ReglementFornisseurComponent },
      // { path: 'administration', component: AdminstrationSettingsComponent },
      // { path: 'reglements', component: GestionReglementComponent },
      // { path: 'ajouter-reglement', component: AddReglementComponent },
      // { path: 'modifier-reglement/:id', component: EditReglementComponent },
      // { path: 'etats', component: EtatsComponent },
      // { path: 'roles', component: RolesComponent },
      // { path: 'parametrage', component: ParametrageComponent },
      // { path: 'vendeurs', component: VendeursComponent },
      // { path: 'ajouter-vendeur', component: AddVendeurComponent },
      // { path: 'modifier-vendeur/:id', component: ModifierVendeurComponent },
      // { path: 'reglements/:id/historiques', component: HistoriqueReglementComponent },
      // { path: 'impaye-reglements/:id', component: ImpayeReglementComponent },
      // { path: 'ajouter-reglement-fornisseur/:id', component: AddReglementFornisseurComponent },
      // { path: 'modifier-reglement-fornisseur/:id', component: EditReglementFornisseurComponent },
      // { path: 'alerts', component: AlertsComponent },
      // { path: 'statistiques', component: StatistiquesComponent },
      // { path: 'reglement-vendeur/:id', component: ReglementVendeurComponent },
      { path: 'articles', component: ArticlesComponent},
      // { path: 'ajouter-article', component: AddArticleComponent},
      // { path: 'modifier-article/:id', component: EditArticleComponent},
      // { path: 'trajets', component: TrajetsComponent},
      // { path: 'ajouter-trajet', component: AddTrajetComponent},
      // { path: 'modifier-trajet/:id', component: EditTrajetComponent},

      // { path: 'trajet/:id/commandes', component: CommandesTrajetComponent},
      // { path: 'trajet/:trajetId/ajouter-commande', component: AddCommandeComponent},
      // { path: 'trajet/:trajetId/modifier-commande/:id/details', component: EditCommandeComponent},
      // { path: 'trajet/:trajetId/commande/:commandeId/details', component: DetailCommandeComponent},
      // { path: 'trajet/:trajetId/commande/:commandeId/lignes-des-commandes', component: LignesDesCommandesComponent},
      // { path: 'trajet/:trajetId/commande/:commandeId/reglements', component: CommandeReglementsComponent},
      // { path: 'trajet/:trajetId/commandes/importer', component: ImporterCommandeComponent},
      // { path: 'trajet/:trajetId/commande/:commandeId/ajouter-ligne-de-commande', component: AjouterLigneCommandeComponent},
      // { path: 'trajet/:trajetId/commande/:commandeId/modifier-ligne-de-commande', component: ModifierLigneCommandeComponent},
      // { path: 'trajet/:trajetId/versements-commande', component: VersementCommandeComponent},

      { path: 'commandes', component: CommandesComponent},
      { path: 'commandes/add', component: AddCommandeComponent},
      { path: 'commandes/:id', component: DetailCommandeComponent},
      { path: 'commandes/:id/lignes-des-commandes', component: LigneCommandeAddComponent},

      { path: 'clients', component: ClientsComponent},
      { path: 'vendeurs', component: VendeursComponent},

      { path: 'factures', component: FacturesComponent},
      { path: 'factures/:id', component: FactureDetailComponent},

      // { path: 'ajouter-commande', component: AddCommandeComponent},
      // { path: 'modifier-commande/:id/details', component: EditCommandeComponent},
      // { path: 'commandes/:commandeId/details', component: DetailCommandeComponent},
      // { path: 'commandes/:commandeId/reglements', component: CommandeReglementsComponent},
      // { path: 'commandes/importer', component: ImporterCommandeComponent},
      // { path: 'commandes/:commandeId/ajouter-ligne-de-commande', component: AjouterLigneCommandeComponent},
      // { path: 'commandes/:commandeId/modifier-ligne-de-commande', component: ModifierLigneCommandeComponent},
      // { path: 'versements-commande', component: VersementCommandeComponent},

      // { path: 'statistiques-trajet', component: StatistiquesTrajetComponent},
      // { path: 'commandes-trajet/:id', component: CommandesTrajetComponent},
      // { path: 'transports', component: TransportsComponent },
      // { path: 'add-transport', component: AddTransportComponent },
      // { path: 'modifier-transport/:id', component: EditTransportComponent },
      // { path: 'info-transport/:id', component: InfoTransportComponent },
      // { path: 'type-reglement', component: TypeReglementComponent},
      // { path: 'versements', component: VersementComponent},
      // { path: 'statistiques-vendeur', component: StatistiqueVendeurComponent},
      // { path: 'reglement-client/:id/statistiques', component: StatistiqueClientComponent},
      // { path: 'articles/statistiques', component: StatistiqueArticleComponent},
      // { path: 'reglements/statistiques', component: StatistiqueReglementComponent},
      // { path: 'trajetsSubs', component: TrajetSubsComponent},
      // { path: 'stats-trajet-villes', component: StatsVendeurCityComponent},
      // { path: 'stats-trajet-clients', component: StatsVendeurClientComponent},
    ],

    canActivate: [AuthenticationGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
