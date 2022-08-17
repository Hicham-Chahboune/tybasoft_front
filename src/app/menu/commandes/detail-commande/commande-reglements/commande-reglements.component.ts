import { Component, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AjouterReglementDialogComponent } from 'src/app/menu/trajets/commandes-trajet/importer-commande/ajouter-reglement-dialog/ajouter-reglement-dialog.component';
import { ModalComponent } from 'src/app/modal/modal.component';
import { PaiementService } from 'src/app/services/paiement.service';
import getUniqueUUID from 'src/app/utils/uuid';

@Component({
  selector: 'app-commande-reglements',
  templateUrl: './commande-reglements.component.html',
  styleUrls: ['./commande-reglements.component.css']
})
export class CommandeReglementsComponent implements OnInit {

  commande: any;

  allowedTypes: string[] = [
                              'En espèce',
                              'Versement',
                              'Contre remboursement',
                              'Contre chèque',
                              'Contre effet'
                            ]

  reglements: any = [];
  reglementsBackup: any = [];
  search_warning: string = '';

  types: any = [];
  banques: any = [];
  etats: any = [];
  none: any = { id: 0, label: '', nom: '' };

  reglementsTotal: number = 0;

  constructor(private paimentService: PaiementService,
              public dialog: MatDialog,
              private router: Router,
              private route: ActivatedRoute ) {

              if(this.router.getCurrentNavigation()!!.extras!!.state!! == null)
              this.router.navigateByUrl(`/app/trajet/${this.route.snapshot.params.trajetId}/commande/${this.route.snapshot.params.commandeId}/details`);

              this.commande = this.router.getCurrentNavigation()!!.extras!!.state!!.commande;

}

  ngOnInit(): void {
    this.reglements = this.commande.reglements ? this.commande.reglements : [];
    this.reglements.forEach((reglement: any) => {
        this.reglementsTotal += reglement.montant;
    });
    this.loadData();
  }

  loadData(){

    //Types
    this.paimentService.getTypes().subscribe(
      (data) => {
        this.types = data.filter((item: any) => this.allowedTypes.includes(item.nom));
      });

    //Banques
    this.paimentService.getBanques().subscribe(
      (data) => {
        this.banques = data;
      }
    );
    //Etats
    this.paimentService.getEtats().subscribe(
      (data) => {
        this.etats = data;
      }
    );
  }

  addReglement(){
    const dialogConfig = new MatDialogConfig();

    dialogConfig.panelClass = "popup-suppression-style";
    dialogConfig.data = {
      banques: this.banques,
      types: this.types,
      etats: this.etats,
      reglementsTotal: this.reglementsTotal,
      commandeTotal: this.commande.total
    };

    const dialogRef = this.dialog.open(AjouterReglementDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        result.ref = getUniqueUUID();
        this.reglementsTotal += result.montant;
        this.commande.reglements.push(result)
      } else {
        console.log("noooooon");
      }
    });
  }

  editReglement(reglement:any){
    const dialogConfig = new MatDialogConfig();

    dialogConfig.panelClass = "popup-suppression-style";
    dialogConfig.data = {
      banques: this.banques,
      types: this.types,
      etats: this.etats,
      reglementsTotal: this.reglementsTotal,
      commandeTotal: this.commande.total,
      reglement: reglement,
    };

    const dialogRef = this.dialog.open(AjouterReglementDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {

      if (result) {

        for(let i = 0; i < this.commande.reglements.length; i++){
          (this.commande.reglements[i].ref === result.ref) && (this.commande.reglements[i] = result);
        }
        this.reglementsTotal += result.montant - reglement.montant;

      } else {
        console.log("noooooon");
      }
    });
  }

  deleteReglement(reglement:any){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.panelClass = "popup-suppression-style";
    dialogConfig.data = {
      title: 'Suppression',
      content: ''
    };
    const dialogRef = this.dialog.open(ModalComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        for(let i = 0; i < this.commande.reglements.length; i++){
          if(this.commande.reglements[i].ref === reglement.ref)
            this.commande.reglements.splice(i, 1);
        }
        this.reglementsTotal -= reglement.montant;
      }
    });
  }

  filterReglementClients(key: string, type: string){
    let result = [];
    switch(type){
      case "date":
        result = this.reglementsBackup.filter((paiement: any) => paiement.dateCreation?.toLowerCase().includes(key.toLowerCase()))
      break
      case "montant":
        result = this.reglementsBackup.filter((paiement: any) => paiement.montant?.toString().toLowerCase().includes(key.toLowerCase()))
      break
      case "echeance":
        result = this.reglementsBackup.filter((paiement: any) => paiement.echeance?.toLowerCase().includes(key.toLowerCase()))
      break
      case "type":
        result = this.reglementsBackup.filter((paiement: any) => key === '' || paiement.type.nom === key)
      break
      case "banque":
        result = this.reglementsBackup.filter((paiement: any) => key === '' || paiement.banque.label === key)
      break
      case "etat":
        result = this.reglementsBackup.filter((paiement: any) => key === '' || paiement.etat?.label === key)
      break
    }

    this.reglements =result;
    result.length === 0 ? this.search_warning = "Aucun réglement trouvé" : this.search_warning = '';
  }

  back(){
    this.router.navigateByUrl(`/app/trajet/${this.commande.trajet.id}/commande/${this.commande.id}/details`, { state: { commande: this.commande } })
  }


}
