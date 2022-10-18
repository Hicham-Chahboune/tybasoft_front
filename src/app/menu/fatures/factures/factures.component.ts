import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FactureService } from 'src/app/services/facture.service';
import { Facture } from 'src/app/shared/facture';

@Component({
  selector: 'app-factures',
  templateUrl: './factures.component.html',
})
export class FacturesComponent implements OnInit {

  factures: Facture[];

  constructor(
    private factureService: FactureService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
      this.factureService.getAllFactures().subscribe((data) => {
        console.log(data)
        this.factures = data;
      });
  }
  getEventValue($event: any): string {
    return $event.target.value;
  }

}
