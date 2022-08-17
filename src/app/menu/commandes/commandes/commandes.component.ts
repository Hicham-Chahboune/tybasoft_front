import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { NotificationType } from 'src/app/config/notification-type.enum';
import { ArticleService } from 'src/app/services/article.service';
import { Article } from 'src/app/shared/article';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FileUpload } from 'primeng/fileupload';
import { Command } from 'src/app/shared/command';
import { CommandeService } from 'src/app/services/commande.service';
import { CommandeStatus } from 'src/app/config/commande-status';
import { LigneCommande } from 'src/app/shared/LigneCommande';
// import { LigneDeCommandeService } from 'src/app/services/ligne-de-commande.service';
import { first, tap } from 'rxjs/operators';

@Component({
  selector: 'app-commandes',
  templateUrl: './commandes.component.html',
  styleUrls: ['./commandes.component.css'],
  providers: [MessageService,ConfirmationService],
})
export class CommandesComponent implements OnInit {
  commandes: Command[];
  selectedCommandes: Command[];
  @ViewChild('fileUpload') importInput: FileUpload;

  constructor(
    private commandeService: CommandeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit() {
    this.commandeService.getAll().subscribe((data) => {
      this.commandes = data;
    });
  }
  getEventValue($event: any): string {
    return $event.target.value;
  }

  onFileSelected(event: any) {
    this.readExcelFile(event.currentFiles[0]);
    this.importInput.clear();
  }
  deleteCommand(id:number){

    this.commandeService.delete(id).subscribe(res=>{
      this.commandes = this.commandes.filter(val => val.id !== id);
      this.messageService.add({severity:'success', summary: 'Successful', detail: "L'article a été bien supprimé", life: 3000});
    })
  }
  readExcelFile(file: any) {
    let arrayBuffer: any;
    let resultedArraylist: any;

    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      arrayBuffer = fileReader.result;
      let data = new Uint8Array(arrayBuffer);
      let arr = new Array();
      for (let i = 0; i != data.length; ++i)
        arr[i] = String.fromCharCode(data[i]);
      let bstr = arr.join('');
      let workbook = XLSX.read(bstr, { type: 'binary', cellDates: true });
      let first_sheet_name = workbook.SheetNames[0];
      let worksheet = workbook.Sheets[first_sheet_name];

      resultedArraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      this.onExcelFileRead(resultedArraylist);
    };
    fileReader.readAsArrayBuffer(file);
  }

  onExcelFileRead(table: CommandeHeaders[]) {

    let commandes: Command[] = [];
    let article = new Article();

    for (let item of table) {

      if (item['Référence commande']) {

        let command:Command ={
          reference:item['Référence commande'],
          vendeur:{
            externalRef:item['Vendeur/ID']
          },
          status:this.commandeService.getStatus(status),
          date:item['Date de la commande'],
          client:{
            externalRef:item['Client/ID']
          },
          ligneCommandes:[]
        }
        commandes.push(command);
      }
      if (item['Lignes de la commande/Article/ID']){

        article.reference=item['Lignes de la commande/Article/ID']
        commandes[commandes.length -1].ligneCommandes?.push({
          article,
          qnt: item['Lignes de la commande/Quantité'],
          sousTotal: item['Lignes de la commande/Total'],
          prixVentReel: item['Lignes de la commande/Prix unitaire'],
        });
      }
    }
    this.commandeService.importCommandes(commandes).subscribe(e=>{
      console.log(e)
    },e=>console.log(e))
  }

}

interface CommandeHeaders {
  "Référence commande": string;
  "Date de la commande": Date;
  "Client/ID": string;
  "Vendeur/ID": string;
  "Lignes de la commande/Article/ID": string;
  "Lignes de la commande/Quantité": number;
  "Lignes de la commande/Total": number;
  "Lignes de la commande/Prix unitaire":number
}


// interface excelType {
//   articleReference: string;
//   commandeReference: string;
//   date: Date;
//   prisPar: string;
//   prixVentReel: number;
//   qnt: number;
//   sousTotal: number;
//   status: string;
//   total: number;
//   externalRef: string;
// }

