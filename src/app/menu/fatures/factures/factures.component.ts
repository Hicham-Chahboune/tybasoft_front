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
  ) {}

  ngOnInit() {
    this.factureService.getAll().subscribe((data) => {
      this.factures = data;
      console.log(data)
    });
  }
  getEventValue($event: any): string {
    return $event.target.value;
  }

}
