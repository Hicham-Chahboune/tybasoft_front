import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationType } from 'src/app/config/notification-type.enum';
import { CommandeService } from 'src/app/services/commande.service';
import { ArticleService } from 'src/app/services/article.service';
import { Location } from '@angular/common';
import { Article } from 'src/app/shared/article';
import { LigneCommande } from 'src/app/shared/LigneCommande';
import { MessageService } from 'primeng/api';
import { LigneCommandeService } from 'src/app/services/ligneCommande.service';
import { Command } from 'src/app/shared/command';

@Component({
  selector: 'app-ajouter-ligne-commande',
  templateUrl: './ligne-commande-add.component.html',

})
export class LigneCommandeAddComponent implements OnInit {

  articles: Article[];
  selectedArticle:Article;
  commandeId: number;

  ligneCommandeForm:FormGroup=this.fb.group({
    qnt:[,Validators.required],
    prixVentReel:[,Validators.required]
  })


  constructor(private commandeService:CommandeService,private router:Router,private messageService:MessageService,private activatedRoute:ActivatedRoute,private ligneCommandeService: LigneCommandeService,private articleService: ArticleService,private fb:FormBuilder) { }

  ngOnInit() {
    this.init_data();
  }

  init_data(){
        this.articleService.getAll().subscribe(data=>{
          this.articles = data;
      })
      this.activatedRoute.params.subscribe(e=>{
        this.commandeId = e['id']
      })
  }
  getEventValue($event:any){
    return $event.target.value;
  }
  ajouterLigneCommande(){
    const {qnt,prixVentReel}=this.ligneCommandeForm.value

    let ligneCommande= {
      article:this.selectedArticle,
      qnt,
      prixVentReel,
      commande:{
        id:this.commandeId
      },
      sousTotal:qnt*prixVentReel
    }
    this.ligneCommandeService.create(ligneCommande).subscribe(data=>{
      this.messageService.add({severity:'success', summary: 'Successful', detail: "Les articles ont été bien supprimé", life: 3000});
      this.router.navigateByUrl(`/app/commandes/${this.commandeId}`)

    })




  }





  // loadData() {

  //   this.trajet = this.commande.trajet;

  //   this.addLigneCommandeForm.get('commande')?.setValue(this.commande);

  //   // load articles
  //   this.subs.add(
  //   this.articleService.getAllArticles().subscribe(res => {
  //       this.articles = res;
  //       this.articlesBackup = res;
  //   },
  //   error => {
  //     this.notificationService.notify(NotificationType.ERROR, "une erreur s'est produite veuillez réessayer plus tard")
  //   }));
  // }

  // setArticle(article: any){
  //   if(this.selectedArticle !== null){
  //     this.selectedArticle = null;
  //     this.addLigneCommandeForm.get('article')?.setValue(null);
  //     this.articles = this.articlesBackup;
  //   }else {
  //     this.selectedArticle = article;
  //     this.addLigneCommandeForm.get('article')?.setValue(article);
  //     this.articles = [article];
  //   }
  //   this.cdr.detectChanges();

  // }

  // addLigneCommande(){

  //   this.commande.ligneCommandes.push({
  //     qnt : this.addLigneCommandeForm.get('qnt')?.value,
  //     prixVentReel : this.addLigneCommandeForm.get('prixVentReel')?.value,
  //     commandeId : this.commande?.id || 0,
  //     article : this.selectedArticle
  //   });
  //   this.router.navigateByUrl(`/app/trajet/${this.commande.trajet.id}/commande/${this.commande.id}/lignes-des-commandes`, { state: { commande: this.commande } })
  // }

  // searchArticle(key: string){
  //   this.articles = this.articlesBackup.filter(article => key == '' || article.articleReference?.toLowerCase().includes(key) || article.nom?.toLowerCase().includes(key))
  // }

  // ngOnDestroy() {
  //   this.subs.unsubscribe();
  // }

}
