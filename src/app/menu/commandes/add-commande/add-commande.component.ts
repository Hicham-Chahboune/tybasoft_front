import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ClientService } from 'src/app/services/client.service';
import { CommandeService } from 'src/app/services/commande.service';
import { Client } from 'src/app/shared/client';
import { Command } from 'src/app/shared/command';

@Component({
  selector: 'app-add-commande',
  templateUrl: './add-commande.component.html',
})
export class AddCommandeComponent implements OnInit {
  clients: Client[];
  selectedClient:Client;
  types:any[];
  selectedType:any

  ligneCommandeForm:FormGroup=this.fb.group({
    reference:[,Validators.required],
    date:[,Validators.required],
    type:[,Validators.required],
  })


  constructor(private router:Router,private messageService:MessageService,private activatedRoute:ActivatedRoute,private commandeService: CommandeService,private fb:FormBuilder,private clientService:ClientService) { }

  ngOnInit() {
    this.init_data();
  }

  init_data(){
        this.clientService.getAll().subscribe(data=>{
          this.clients = data;
      })
      this.commandeService.getcommandeTypes().subscribe(data=>{
        this.types = data;
      })
  }
  getEventValue($event:any){
    return $event.target.value;
  }
  private getValueOfControl(key:string){
    return this.ligneCommandeForm.controls[key].value;
  }
  ajouterCommande(){
    let command = new Command();
    command.client = {id:this.selectedClient.id}
    command.date=this.getValueOfControl("date")
    command.reference=this.getValueOfControl("reference")
    command.commandeType=this.getValueOfControl("type")

    this.commandeService.create(command).subscribe(e=>{
      this.router.navigateByUrl('/app/commandes')
    })

    // const {qnt,prixVentReel}=this.ligneCommandeForm.value


    // this.commande.ligneCommandes.push({
    //   article:this.selectedArticle,
    //   qnt,
    //   prixVentReel,
    //   sousTotal:qnt*prixVentReel
    // })

    // let commande = this.commandeService.update(this.commande).subscribe(e=>{
    //   this.messageService.add({severity:'success', summary: 'Successful', detail: "Les articles ont été bien supprimé", life: 3000});
    //   this.router.navigateByUrl(`/app/commandes/${this.commande.id}`)
    // });

  }
}
