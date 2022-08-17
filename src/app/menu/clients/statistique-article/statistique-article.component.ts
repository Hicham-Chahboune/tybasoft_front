import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ArticleService } from 'src/app/services/article.service';
import { TrajetService } from 'src/app/services/trajet.service';
import { Vendeur } from 'src/app/shared/vendeur';
import { SubSink } from 'subsink';
import { VendeurService } from '../../vendeurs/vendeur.service';

@Component({
  selector: 'app-statistique-article',
  templateUrl: './statistique-article.component.html',
  styleUrls: ['./statistique-article.component.css']
})
export class StatistiqueArticleComponent implements OnInit, OnDestroy {

  private subs = new SubSink();

  dateForm: FormGroup = this.formBuilder.group({
    vendeur: [null, Validators.required],
    trajet: [null,],
    firstDate: ['',],
    secondDate: ['',],
  });

  titleAlert: string = 'Ce champs est obligatoire !';
  vendeurs: Vendeur[] = [];
  trajets: any[] = [];
  vendeurTrajets: any[] = [];

  constructor(private articleService: ArticleService, private formBuilder: FormBuilder, private vendeurService: VendeurService, private trajetService: TrajetService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.subs.add(
      this.vendeurService.getVendeurs().subscribe(
        (data) => {
          data.forEach((item: any) => {
            this.vendeurs.push(item);
          });
        }
      ),
      this.trajetService.getAllTrajets().subscribe(
        (data) => {
          data.forEach((item: any) => {
            this.trajets.push(item);
          });
        }
      )
    );
  }

  getTrajetForVendeur(vendeur: Vendeur) {
    this.vendeurTrajets = [];
    this.subs.add(
      this.trajetService.getAllTrajetForVendeur(vendeur?.id!).subscribe(
        (data) => {
          data.forEach((item:any) => {
            this.vendeurTrajets.push(item);
          });
        }
      )
    )
  }

  downloadPDF(): void {
    let doc = new jsPDF('p', 'pt', 'a4');
    let img = new Image();
    img.src = "assets/images/logo.png";

    if (this.dateForm.value?.vendeur === null) {
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.text('Statistiques des article', 40, 140);
      doc.setLineWidth(1);
      doc.rect(40, 145, 140, 0);
    } else {
      if (this.dateForm.value?.firstDate !== '' || this.dateForm.value?.secondDate !=='') {
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text('A partir de: ' + this.dateForm.get('firstDate')?.value, 150, 140);
        doc.text("Jusqu'à: " + this.dateForm.get('secondDate')?.value, doc.internal.pageSize.width - 250, 140);
        if (this.dateForm.value?.trajet !== null) {
          doc.setTextColor(0, 0, 0);
          doc.text('Trajet: ', 40, 160);
          doc.setTextColor(123, 31, 162);
          doc.text(this.dateForm.get('trajet')?.value?.nom, 110, 160);
          // vendeur
          doc.setTextColor(0, 0, 0);
          doc.text('Vendeur: ', 40, 180);
          doc.setTextColor(123, 31, 162);
          doc.text(this.dateForm.get('vendeur')?.value?.nom + " " + this.dateForm.get('vendeur')?.value?.prenom, 110, 180);
        } else {
          doc.setTextColor(0, 0, 0);
          doc.text('Vendeur: ', 40, 160);
          doc.setTextColor(123, 31, 162);
          doc.text(this.dateForm.get('vendeur')?.value?.nom + " " + this.dateForm.get('vendeur')?.value?.prenom, 110, 160);
        }
      } else {
        if (this.dateForm.value?.trajet !== null) {
          doc.setTextColor(0, 0, 0);
          doc.text('Trajet: ', 40, 140);
          doc.setTextColor(123, 31, 162);
          doc.text(this.dateForm.get('trajet')?.value?.nom, 110, 140);
          // vendeur
          doc.setTextColor(0, 0, 0);
          doc.text('Vendeur: ', 40, 160);
          doc.setTextColor(123, 31, 162);
          doc.text(this.dateForm.get('vendeur')?.value?.nom + " " + this.dateForm.get('vendeur')?.value?.prenom, 110, 160);
        } else {
          doc.setTextColor(0, 0, 0);
          doc.text('Vendeur: ', 40, 140);
          doc.setTextColor(123, 31, 162);
          doc.text(this.dateForm.get('vendeur')?.value?.nom + " " + this.dateForm.get('vendeur')?.value?.prenom, 110, 140);
        }
      }

    }

    this.drawTables(doc);

    let nbpage = doc.internal.pages.length - 1;
    for (let i = nbpage; i > 0; i--) {
      doc.setPage(i);
      //set border for each page
      doc.rect(20, 20, doc.internal.pageSize.width - 40, doc.internal.pageSize.height - 40, 'S');

      // set the header for each page
      doc.addImage(img, 'png', 40, 40, 50, 50);
      doc.setTextColor(1, 172, 149);
      doc.text("Company name", 110, 70);
      doc.text(new Date().toISOString().slice(0, -14), doc.internal.pageSize.width - 120, 70);
      doc.setLineWidth(1);
      doc.rect(40, 95, doc.internal.pageSize.width - 80, 0);

      // set the footer for each page
      doc.setFontSize(7);

      doc.setLineWidth(2);
      doc.rect(40, 800, doc.internal.pageSize.width - 80, 0);
      doc.setTextColor(123, 31, 162);
      doc.text('S.A. au capital de 300 000.00 DH          Patente : 257648987', 40, 810);
      doc.text('ICE : 000047860000014                         CNSS : 77429000', 40, 820);
      doc.text('28, Rue Jbel Oukaimden          Tél : +212 (0)537 888 843', 370, 810);
      doc.text('10000 Ampha, Casa - Maroc    Fax : +212 (0)537 888 844', 370, 820);
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.text('Page: ' + i, doc.internal.pageSize.width - 50, doc.internal.pageSize.height - 10);
      doc.setFontSize(16);
    }
    doc.output('dataurlnewwindow');
  }

  private drawTables(doc: any) {
    autoTable(doc, { html: '#tab', margin: { top: 210 } });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
