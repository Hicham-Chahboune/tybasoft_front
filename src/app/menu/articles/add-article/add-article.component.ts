import { Component, Input, OnInit, Output , EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { NotificationType } from 'src/app/config/notification-type.enum';
import { ArticleService } from 'src/app/services/article.service';
import { Article } from 'src/app/shared/article';

@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.css']
})
export class AddArticleComponent implements OnInit {


  titleAlert: string = 'Ce champs est obligatoire !';


  @Input() articles:Article[]
  @Output('destroyAdd') destroyEdit = new EventEmitter();

  show:boolean= true;

  ArticleForm: FormGroup= this.fb.group({
    reference: ['', Validators.required],
    nom: ['', Validators.required],
    description: ['', Validators.required],
    prixAchat: [0, Validators.required],
    prixVenteSurPlace: [0, Validators.required],
    prixVenteParCommande: [0, Validators.required],
    prixVenteCasa: [0, Validators.required],
    prixVenteComptoire: [0, Validators.required],

  });

  constructor(private fb: FormBuilder, private articleService:ArticleService,private messageService: MessageService) {
   }


  ngOnInit(): void {
  }

  hideDialog() {
      this.show = false;
      this.destroyEdit.emit("Destroyed");
  }
  saveArticle() {

    this._saveArticle(this.ArticleForm.value)
  }
  _saveArticle(article:Article){
    this.articleService.create(article).subscribe(
      res => {
        this.articles.push(res);
        this.messageService.add({severity:'success', summary: 'Successful', detail: 'L\'article a été bien ajouté', life: 2000});
        this.hideDialog()
      },
      error => {
        this.messageService.add({severity:'error', summary: 'Error', detail: error.error.message, life: 2000});
      }
    );
  }
}
