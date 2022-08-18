import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationType } from 'src/app/config/notification-type.enum';
import { CommandeService } from 'src/app/services/commande.service';
import { FactureService } from 'src/app/services/facture.service';
import { Command } from 'src/app/shared/command';
import { Facture } from 'src/app/shared/facture';

@Component({
  selector: 'app-detail-commande',
  templateUrl: './detail-commande.component.html',
})
export class DetailCommandeComponent implements OnInit {

  commande: Command | any;

  totalReglements: number = 0;

  showDialog = false;


  constructor( private commandeService:CommandeService,
               private router:Router,
               private route: ActivatedRoute,
               private factureService:FactureService
             ) {

   }

  ngOnInit(): void {
     this.loadCurrentCommande();

  }

  loadCurrentCommande() {
    let id = this.route.snapshot.params["id"];
    this.commandeService.getById(id).subscribe(
      res => {
        this.commande = res;
      }
    )
  }

  modifierLignesDeCommande(){
    this.router.navigateByUrl(`/app/commandes/${this.commande.id}/lignes-des-commandes`, { state: { commande: this.commande } })
  }

  onFacturerClick(){
    this.saveFacture()
  }

  hideDialog(){
    this.showDialog = false
  }
  saveFacture(){
    let facture : Facture = {
      commande:this.commande,
      tva:20
    }
    this.factureService.create(facture).subscribe(facture=>{
      this.commande.nbFactures++
      this.router.navigateByUrl(`/app/factures/${facture.id}`)
    })
    this.showDialog=false
  }
}
