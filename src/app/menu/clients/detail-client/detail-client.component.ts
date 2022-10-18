import { MessageService } from 'primeng/api';
import { ClientService } from './../../../services/client.service';
import { Client } from './../../../shared/client';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detail-client',
  templateUrl: './detail-client.component.html',
})
export class DetailClientComponent implements OnInit {

  display: boolean = false;

  client:Client = {}
  ice:string=""

  returnPath:string = ""



  constructor(private activatedRouter:ActivatedRoute,private clientService:ClientService,private messageService:MessageService,private router:Router) { }

  ngOnInit(): void {
    this.activatedRouter.queryParamMap.subscribe(e=>{
      if(e.get("return")){
        this.returnPath = e.get("return") || "";
        this.display = true;
      }
    })
    this.activatedRouter.params.subscribe(e=>{
      this.clientService.getByExternalId(e["id"]).subscribe(client=>{
        this.client = client;
        this.ice= client.ice || ""
      })
    })
  }

  showEditDialog(){
    this.display=true
  }

  updateICE(){
    if(this.client.ice!="" && this.ice!=this.client?.ice){
      this.clientService.update(this.client).subscribe(e=>{
        this.messageService.add({severity:'success', summary: 'Successful', detail: 'ICE updated', life: 2000});
        this.ice = this.client.ice || ""
        if(this.returnPath){
          this.router.navigate([this.returnPath]);
        }
      })
    }else{
      this.messageService.add({severity:'error', summary: 'Error', detail: "une erreur s'est produite -empty ICE or no new value-", life: 2000});
      this.client.ice = this.ice
    }
    this.display=false
  }

}
