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

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  providers: [MessageService,ConfirmationService],

})
export class ArticlesComponent implements OnInit {

  articleDialog: boolean =false;

  articles: Article[] = [] ;

  article!: Article;

  selectedArticles!: Article[];

  submitted!: boolean;

  @ViewChild('fileUpload')
  importInput!: FileUpload;

  dialogEdit=false


  ArticleForm: FormGroup= this.formBuilder.group({
    reference: ['', Validators.required],
    nom: ['', Validators.required],
    prixAchat: [0, Validators.required],
    prixVenteSurPlace: [0, Validators.required],
    prixVenteParCommande: [0, Validators.required],
  });

  constructor(private formBuilder:FormBuilder,private articleService: ArticleService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.articleService.getAll().subscribe(articles=>{
        this.articles = articles
    },err=>this.messageService.add({severity:'error', summary: 'Error', detail: "une erreur s'est produite veuillez réessayer plus tard", life: 2000})
    )

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

  openNew() {
       this.ArticleForm.reset()
       this.submitted = false;
       this.articleDialog = true;
  }

  deleteSelectedArticles() {
  //  const ids = this.selectedArticles.map(e=>e.reference);
  //     this.confirmationService.confirm({
  //         message: 'Are you sure you want to delete the selected products?',
  //         header: 'Confirm',
  //         icon: 'pi pi-exclamation-triangle',
  //         accept: () => {
  //           if(ids){
  //               this.articleService.deleteAll(ids as string[]).subscribe(e=>{
  //                 this.articles = this.articles.filter(val => !this.selectedArticles.includes(val));
  //                 this.selectedArticles = [];
  //                 this.messageService.add({severity:'success', summary: 'Successful', detail: "Les articles ont été bien supprimé", life: 3000});
  //               },
  //               error => {
  //                 console.log(error)
  //                 this.messageService.add({severity:'error', summary: 'Error', detail: "une erreur s'est produite veuillez réessayer plus tard", life: 2000});
  //               })

  //           }
  //         }
  //     });
  }

  editArticle(article: Article) {
      if(!article.id)article.id=0
      this.article = article
      this.dialogEdit=true
  }

  deleteArticle(article: Article) {
      this.confirmationService.confirm({
          message: 'Are you sure you want to delete ' + article.nom + '?',
          header: 'Confirm',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {

            this.articleService.delete(article.externalId!!).subscribe(res=>{
              this.articles = this.articles.filter(val => val.externalId !== article.externalId);
              this.messageService.add({severity:'success', summary: 'Successful', detail: "L'article a été bien supprimé", life: 3000});
            },
            error => {
              this.messageService.add({severity:'error', summary: 'Error', detail: "une erreur s'est produite veuillez réessayer plus tard", life: 2000});
            })
          }
      });
  }

  hideDialog() {
       this.articleDialog = false;
  }



  findIndexById(id: string): number {
       let index = -1;
       for (let i = 0; i < this.articles.length; i++) {
          if (this.articles[i].reference === id) {
              index = i;
              break;
          }
      }
      return index;
  }
  exportExcel() {
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(this.articles.map(e=>{
          return {
            "Référence interne":e.reference,
            "Nom":e.nom,
            "Prix de vente":e.prixVente,
            "Article/ID":e.externalId
          }
        }));
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


onExcelFileRead(table: ArticleHeaders[]){

  let importedArticles :Article[] = []
  for (let article of table) {
    let a : Article = {
      externalId:article['Article/ID'],
      reference:article['Référence interne'],
      prixVente:article['Prix de vente'],
      nom:article.Nom
    }
    importedArticles.push(a);
}
this.articleService.importArticles(importedArticles).subscribe(e=>{
  this.messageService.add({severity:'success', summary: 'Success', detail: "Imported"});
  this.articles.push(...importedArticles)
  importedArticles=[]
},err=>{
  this.messageService.add({severity:'error', summary: 'Error', detail: err.error.message});
}
)}

}

interface ArticleHeaders {
  //
  "Référence interne": string;
  "Article/ID":number;
  "Prix de vente":number;
  "Nom": string;
  //
  "Description": string;
  "PrixAchat": number;
  "PrixSurPlace": number;
  "PrixCommande": number;
  "PrixCasa": number;
  "PrixComptoire": number;
}





