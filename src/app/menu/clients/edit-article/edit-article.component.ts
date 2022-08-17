import { Component, Input, OnInit, Output , EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { NotificationType } from 'src/app/config/notification-type.enum';
import { ArticleService } from 'src/app/services/article.service';
import { Article } from 'src/app/shared/article';

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.css']
})
export class EditArticleComponent implements OnInit {


  titleAlert: string = 'Ce champs est obligatoire !';


  @Input() article:Article;
  @Input() articles:Article[]
  @Output('destroyEdit') destroyEdit = new EventEmitter();

  show:boolean= true;

  ArticleForm: FormGroup= this.fb.group({
    reference: ['', Validators.required],
    nom: ['', Validators.required],
    prixAchat: [0, Validators.required],
    prixVenteSurPlace: [0, Validators.required],
    prixVenteParCommande: [0, Validators.required],
    description:['']
  });

  constructor(private fb: FormBuilder, private articleService:ArticleService,private messageService: MessageService) {
   }


  ngOnInit(): void {
    this.ArticleForm.setValue(this.article)
  }

  hideDialog() {
      this.show = false;
      this.destroyEdit.emit("Destroyed");
  }
  saveArticle() {

    this.article = this.ArticleForm.value
    this.updateArticle(this.article)
    this.hideDialog()
  }
  updateArticle(article:Article){
    this.articleService.update(article).subscribe(
      res => {
        if(res.reference){
          let index = this.findIndexById(res.reference);
          this.articles[index] = res
        }
        this.messageService.add({severity:'success', summary: 'Successful', detail: 'L\'article a été bien Edité', life: 2000});
      },
      error => {
        this.messageService.add({severity:'error', summary: 'Error', detail: "une erreur s'est produite veuillez réessayer plus tard", life: 2000});
      }
    );
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


}
