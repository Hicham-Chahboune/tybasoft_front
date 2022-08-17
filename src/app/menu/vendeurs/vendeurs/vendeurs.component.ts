import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { VendeurService } from 'src/app/services/vendeur.service';
import { Vendeur } from 'src/app/shared/vendeur';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-vendeurs',
  templateUrl: './vendeurs.component.html',
})
export class VendeursComponent implements OnInit {

  articleDialog: boolean =false;

  vendeurs: Vendeur[] = [] ;

  importedClients:Vendeur[]=[];


  submitted!: boolean;

  @ViewChild('fileUpload')
  importInput!: FileUpload;

  dialogEdit=false



  constructor(private vendeurService: VendeurService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.vendeurService.getAll().subscribe(vendeurs=>{
        this.vendeurs = vendeurs
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
        const worksheet = xlsx.utils.json_to_sheet(this.vendeurs);
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
onExcelFileRead(table: VendeurHeaders[]){


  for (let client of table) {
      let c : Vendeur = {
        externalRef:client.ID,
        mailProfess:client['Adresse électronique professionnelle'],
        nomComplet:client['Nom de l\'employé'],
        telUrgence:client['Téléphone d\'urgence'],
        telProfess:client['Téléphone professionnel']
      }
      this.importedClients.push(c);
  }
  this.vendeurService.importClient(this.importedClients).subscribe(e=>{
    console.log(e)
    this.importedClients=[]
  })
}


}
interface VendeurHeaders {
  "Nom de l'employé": string;
  'Téléphone professionnel': string;
  'Adresse électronique professionnelle': string;
  ID: string;
  "Téléphone d'urgence": string;
}

