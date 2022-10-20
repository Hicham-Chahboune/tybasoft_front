import { MessageService } from 'primeng/api';
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

  showDialogOfNumeroFacture = false;

  numero:number


  constructor( private commandeService:CommandeService,
               private router:Router,
               private route: ActivatedRoute,
               private factureService:FactureService,
               private messageService:MessageService
             ) {

   }

  ngOnInit(): void {
     this.loadCurrentCommande();

  }

  loadCurrentCommande() {
    let id = this.route.snapshot.params["id"];
    this.commandeService.getByReference(id).subscribe(
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
  onFacturesClick(){
    this.factureService.getFactureByCommandId(this.commande.id).subscribe(facture=>{
      this.router.navigate(['/app/factures',facture.id]);
    })
  }
  hideDialog(){
    //this.showDialog = false
  }
  saveFacture(){
    if(!this.commande.client.ice)
      this.router.navigateByUrl("/app/clients/"+this.commande.client.externalId+"?return="+this.router.url)
    else
       this.showDialogOfNumeroFacture = true;

  }
  facturer(){
    console.log(this.numero)
    if(this.numero){
      this.showDialogOfNumeroFacture=false
      let facture : Facture = {
        commande:this.commande,
        tva:20,
        numero:this.numero
      }
      this.factureService.create(facture).subscribe(facture=>{
        this.router.navigateByUrl(`/app/factures/${facture.id}`)
      })
    }else{
      this.messageService.add({severity:'error', summary: 'Error', detail: "N° de facture ne peut pas être null", life: 2000});
    }

  }
}
