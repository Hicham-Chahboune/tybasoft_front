import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import { FactureService } from 'src/app/services/facture.service';
import { Facture } from 'src/app/shared/facture';

@Component({
  selector: 'app-facture-detail',
  templateUrl: './facture-detail.component.html',
})
export class FactureDetailComponent implements OnInit {

  facture: Facture | any;

//   totalReglements: number = 0;

//   showDialog = false;


  constructor( private factureService:FactureService,
               private router:Router,
               private route: ActivatedRoute,
             ) {
   }

  ngOnInit(): void {
    this.loadCurrentCommande();

  }

  loadCurrentCommande() {
    let id = this.route.paramMap.subscribe(params=>{
      let id:number = +params.get("id")!! | 0

      this.factureService.getById(id).subscribe(
        res => {
          this.facture = res;
        }
      )
    });
  }

  imprimer(){
      this.factureService.imprimer(this.facture.id).subscribe(result=>{
        let blob:Blob = result.body as Blob
        let a = document.createElement("a");
        a.download = "facture_"+this.facture.commande.reference+".pdf"
        a.href = window.URL.createObjectURL(blob);
        a.click()
      });
  }

//   modifierLignesDeCommande(){
//     this.router.navigateByUrl(`/app/commandes/${this.commande.id}/lignes-des-commandes`, { state: { commande: this.commande } })
//   }

//   onFacturerClick(){
//     this.showDialog = true
//   }

//   hideDialog(){
//     this.showDialog = false
//   }
//   saveFacture(){
//     let tva = this.tva.nativeElement.value;
//     let facture : Facture = {
//       commande:this.commande,
//       tva
//     }
//     this.factureService.create(facture).subscribe(e=>{
//       this.commande.nbFactures++
//     })
//     this.showDialog=false
//   }


}
