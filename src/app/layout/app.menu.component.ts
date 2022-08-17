import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: '',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] ,class:"mt-4"},
                    { label: 'Fournisseurs', icon: 'pi pi-users', routerLink: ['/fournisseurs'] },
                    { label: 'Alerts', icon: 'pi pi-fw pi-bell', routerLink: ['/alerts'] },
                ]
            },
            {
                label: 'Commandes',
                items: [
                    { label: 'Articles', icon: 'pi pi-fw pi-id-card', routerLink: ['articles'] },
                    { label: 'Type réglements', icon: 'pi pi-fw pi-tablet', routerLink: ['/type-reglement'] },
                    { label: 'Versements', icon: 'pi pi-fw pi-dollar', routerLink: ['/versements'] },
                    { label: 'Transport', icon: 'pi pi-fw pi-car', routerLink: ['/transports'] },
                    { label: 'Commandes', icon: 'pi pi-fw pi-check-square', routerLink: ['commandes']},
                    { label: 'Facture', icon: 'pi pi-fw pi-file', routerLink: ['factures']},
                ]
            },
            {

                label: 'Administration',
                items: [
                  { label: 'Vendeurs', icon: 'pi pi-users', routerLink: ['vendeurs'] },
                  { label: 'Fournisseurs', icon: 'pi pi-users', routerLink: ['/fournisseurs'] },
                  { label: 'Clients', icon: 'pi pi-users', routerLink: ['clients'] },
                  {
                    label: 'Paramétres',
                    icon: 'pi pi-fw pi-ellipsis-h',
                    items: [
                        {
                            label: 'Etat',
                            icon: 'pi pi-fw pi-spinner',
                            routerLink: ['/auth/login']
                        },
                        {
                            label: 'Roles',
                            icon: 'pi pi-fw pi-lock',
                            routerLink: ['/auth/error']
                        },
                        {
                            label: 'Paramétrages',
                            icon: 'pi pi-fw pi-table',
                            routerLink: ['/auth/access']
                        }
                    ]
                },
                ]
            },
        ];
    }
}
