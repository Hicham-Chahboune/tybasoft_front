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

  @ViewChild('tva') tva : ElementRef;

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
    this.showDialog = true
  }

  hideDialog(){
    this.showDialog = false
  }
  saveFacture(){
    let tva = this.tva.nativeElement.value;
    let facture : Facture = {
      commande:this.commande,
      tva
    }
    this.factureService.create(facture).subscribe(e=>{
      this.commande.nbFactures++
    })
    this.showDialog=false
  }


}
