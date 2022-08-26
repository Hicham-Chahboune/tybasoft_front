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
    },err=>{
      this.messageService.add({severity:'error', summary: 'Error', detail: "Une erreur s'est produite veuillez réessayer plus tard"});
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
    console.log(table);

    let commandes: Command[] = [];
    let article = new Article();

    for (let item of table) {
      console.log(item['Lignes de la commande/Prix unitaire'])
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
      if(item['Lignes de la commande/Article/ID']){
        if(commandes.length==0){
          this.messageService.add({severity:'Error', summary: 'error', detail: "No command for this command line"});
          return;
        }
        article.reference=item['Lignes de la commande/Article/ID']
        commandes[commandes.length -1].ligneCommandes?.push({
          article,
          qnt: item['Lignes de la commande/Quantité'],
          sousTotal: item['Lignes de la commande/Total'],
          prixVentReel: item['Lignes de la commande/Prix unitaire'],
        });
      }else{
        this.messageService.add({severity:'error', summary: 'Error', detail: "Some error occured in the schema of your excel file, please export to visualize the correct schema"});
        return;
      }
    }
    this.commandeService.importCommandes(commandes).subscribe(e=>{
      this.commandes.push(...e);
      this.messageService.add({severity:'success', summary: 'Success', detail: "Imported successfully"});
    },err=>{
      console.log(err)
      this.messageService.add({severity:'error', summary: 'Error', detail: err.error.message});
    })
  }

  exportExcel() {
    import("xlsx").then(xlsx => {

        let expotedCommand:any= []
        if(this.commandes.length==0)
          expotedCommand.push({
            "Référence commande": "",
            "Date de la commande": '',
            "Client/ID": '',
            "Vendeur/ID": '',
            "Lignes de la commande/Article/ID": '',
            "Lignes de la commande/Quantité": '',
            "Lignes de la commande/Total": '',
            "Lignes de la commande/Prix unitaire":''
          })
        else
        this.commandes.forEach(command => {
          expotedCommand.push({
            "Référence commande": command.reference,
            "Date de la commande": command.date,
            "Client/ID": command.client?.externalRef,
            "Vendeur/ID": command.vendeur?.externalRef,
            "Lignes de la commande/Article/ID": command.ligneCommandes!![0].article?.id,
            "Lignes de la commande/Quantité": command.ligneCommandes!![0].qnt,
            "Lignes de la commande/Total": command.ligneCommandes!![0].sousTotal,
            "Lignes de la commande/Prix unitaire":command.ligneCommandes!![0].prixVentReel
          })
          for (let i = 1; i < command.ligneCommandes!!.length; i++) {
            expotedCommand.push({
              "Lignes de la commande/Article/ID": command.ligneCommandes!![i].article?.id,
              "Lignes de la commande/Quantité": command.ligneCommandes!![i].qnt,
              "Lignes de la commande/Total": command.ligneCommandes!![i].sousTotal,
              "Lignes de la commande/Prix unitaire":command.ligneCommandes!![i].prixVentReel

            })
          }
        });
        const worksheet = xlsx.utils.json_to_sheet(expotedCommand);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, "articles");
    });
}
saveAsExcelFile(buffer: any, fileName: string): void {
  let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  let EXCEL_EXTENSION = '.xlsx';
  const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
  });
  saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
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

