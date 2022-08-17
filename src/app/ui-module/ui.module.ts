import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {PasswordModule} from 'primeng/password';
import {CheckboxModule} from 'primeng/checkbox';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';

import {CardModule} from 'primeng/card';
import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {CalendarModule} from 'primeng/calendar';
import {SliderModule} from 'primeng/slider';
import {MultiSelectModule} from 'primeng/multiselect';
import {ContextMenuModule} from 'primeng/contextmenu';
import {DialogModule} from 'primeng/dialog';
import {DropdownModule} from 'primeng/dropdown';
import {ProgressBarModule} from 'primeng/progressbar';
import {FileUploadModule} from 'primeng/fileupload';
import {ToolbarModule} from 'primeng/toolbar';
import {RatingModule} from 'primeng/rating';
import {RadioButtonModule} from 'primeng/radiobutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { InputTextareaModule } from 'primeng/inputtextarea';
import {InputNumberModule} from 'primeng/inputnumber';
import {PanelModule} from 'primeng/panel';
import {DividerModule} from 'primeng/divider';
import {TabViewModule} from 'primeng/tabview';
import {BadgeModule} from 'primeng/badge';

const prime_ng = [
  PanelModule,BadgeModule,
  DividerModule,
  TabViewModule,
  CardModule,
  TableModule,
  CalendarModule,
  SliderModule,
  DialogModule,
  MultiSelectModule,
  ContextMenuModule,
  DropdownModule,
  ButtonModule,
  ToastModule,
  InputTextModule,
  ProgressBarModule,
  FileUploadModule,
  ToolbarModule,
  RatingModule,
  RadioButtonModule,
  InputNumberModule,
  ConfirmDialogModule,
  InputTextareaModule,
  PasswordModule,
  CheckboxModule
]


@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [],
    exports:[...prime_ng]
})
export class UiModule { }
