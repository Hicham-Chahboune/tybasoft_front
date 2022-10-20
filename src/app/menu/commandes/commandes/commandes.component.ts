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

  commandes: Command[]=[];
  importedCommandes: Command[]=[];

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
      this.messageService.add({severity:'success', summary: 'Successful', detail: "La commande a été bien supprimé", life: 3000});
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

  getLastIndexOfCommand(commandIndex:number[],nbItems:number){
    if(commandIndex.length>1)return commandIndex[1]-1
    else
      return nbItems-1;
  }

  getCommandLines(commandeLiness: CommandeHeaders[]){
    let commandeLignes:LigneCommande[] = [];

    for(let item of commandeLiness){
      if(item['Lignes de la commande/Article/ID']){
        let article:Article = {externalId:parseInt(item['Lignes de la commande/Article/ID'])};
        commandeLignes.push({
          article,
          qnt: item['Lignes de la commande/Quantité'],
          sousTotal: item['Lignes de la commande/Total'],
          prixVentReel: item['Lignes de la commande/Prix unitaire'],
        })
      }
    }
    return commandeLignes
  }

  isCommandeImportedExist(reference:string){
    if(this.commandes.length!=0 && this.commandes.filter(e=>e.reference==reference).length!=0)return true;
    else if(this.importedCommandes.length!=0 && this.importedCommandes.filter(e=>e.reference==reference).length!=0)return true;
    return false
  }


  onExcelFileRead(table: CommandeHeaders[]) {
    let commandIndex:number[]=[];

    table.forEach((e,index)=>{ if(e['Référence commande'])commandIndex.push(index)})

    while(commandIndex.length>0){
      let i = commandIndex[0]
      let j = this.getLastIndexOfCommand(commandIndex,table.length);


      let item = table[i]

      if(this.isCommandeImportedExist(item['Référence commande'])){
        commandIndex.shift()
        continue;
      }

      let ligneCommandes:LigneCommande[]= this.getCommandLines(table.slice(i,j));

      let command:Command ={
        reference:item['Référence commande'],
        vendeur:{
          nomComplet:item['Vendeur/Nom'],
          mailProfess:item['Vendeur/Identifiant']
        },
        date:item['Date de la commande'],
        client:{
          externalId: parseInt(item['Client/ID'])
        },
        ligneCommandes
      }
      this.importedCommandes.push(command);
      commandIndex.shift()
    }

    if(this.importedCommandes.length!=0){
      this.commandeService.importCommandes(this.importedCommandes).subscribe(e=>{
        this.commandes = [...this.commandes,...e];
        this.messageService.add({severity:'success', summary: 'Success', detail: "Imported successfully"});
        this.importedCommandes = []
      },err=>{
        this.messageService.add({severity:'error', summary: 'Error', detail: "Something Wrong!"});
      })
    }else{
      this.messageService.add({severity:'warn', summary: '', detail: "Nothing to import"});
    }

  }

  exportExcel() {}

}

interface CommandeHeaders {
  "Référence commande": string;
  "Date de la commande": Date;
  "Client/ID": string;
  "Vendeur/Nom": string;
  "Lignes de la commande/Article/ID": string;
  "Lignes de la commande/Quantité": number;
  "Lignes de la commande/Total": number;
  "Lignes de la commande/Prix unitaire":number;
  "Vendeur/Identifiant":string;
}


