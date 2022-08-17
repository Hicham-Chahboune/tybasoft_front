import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { NotificationType } from 'src/app/config/notification-type.enum';
// import { ModalComponent } from 'src/app/modal/modal.component';
import { ArticleService } from 'src/app/services/article.service';
import { Article } from 'src/app/shared/article';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FileUpload } from 'primeng/fileupload';
import { Client } from 'src/app/shared/client';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
})
export class ClientsComponent implements OnInit {

  articleDialog: boolean =false;

  clients: Client[] = [] ;

  importedClients:Client[]=[];

  client!: Client;

  selectedClient!: Article[];

  submitted!: boolean;

  @ViewChild('fileUpload')
  importInput!: FileUpload;

  dialogEdit=false



  constructor(private formBuilder:FormBuilder,private clientService: ClientService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.clientService.getAll().subscribe(clients=>{
        this.clients = clients
        console.log(clients)
    })

  }

  closeEditArticle(e:any){
    this.dialogEdit=false
  }
  closeAddArticle(e:any){
    this.articleDialog = false
  }

  getEventValue($event:any) :string {
    return $event.target.value;
  }

  exportExcel() {
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(this.clients);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, "clients");
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

//import

onFileSelected(event: any) {
  console.log(this.importInput)
  this.readExcelFile(event.currentFiles[0]);
  this.importInput.clear()
}

readExcelFile (file: any){

  let arrayBuffer: any;
  let resultedArraylist: any;

  let fileReader = new FileReader();
  fileReader.onload = (e) => {
      arrayBuffer = fileReader.result;
      let data = new Uint8Array(arrayBuffer);
      let arr = new Array();
      for(let i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      let bstr = arr.join("");
      let workbook = XLSX.read(bstr, {type:"binary", cellDates: true});
      let first_sheet_name = workbook.SheetNames[0];
      let worksheet = workbook.Sheets[first_sheet_name];

      resultedArraylist = XLSX.utils.sheet_to_json(worksheet,{raw:true});
      this.onExcelFileRead(resultedArraylist)
  }

  fileReader.readAsArrayBuffer(file);
}
onExcelFileRead(table: ClientHeaders[]){


  for (let client of table) {
      let c : Client = {
        externalRef : client.ID,
        tel:client.Téléphone,
        nomComplet:client['Afficher Nom'],
        rue:client.rue,
        ville:{
          label:client.Ville
        }
      }
      this.importedClients.push(c);
  }
  this.clientService.importClient(this.importedClients).subscribe(e=>{
    console.log(e)
    this.importedClients=[]
  },err=>{
    this.messageService.add({severity:'error', summary: 'Error', detail: err.error.message, life: 2000});
  })
}


}
interface ClientHeaders {
  'Afficher Nom': string;
  Téléphone: string;
  Ville: string;
  ID: string;
  Rue: number;
  rue:string
}



