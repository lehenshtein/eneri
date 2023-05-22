import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { SignInFormComponent } from './components/sign-in-form/sign-in-form.component';
import { SignUpFormComponent } from './components/sign-up-form/sign-up-form.component';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  NgxMatDatetimePickerModule,
  NgxMatNativeDateModule,
  NgxMatTimepickerModule
} from '@angular-material-components/datetime-picker';
import { GameCardComponent } from './components/game-card/game-card.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PhoneDirective } from './directives/phone.directive';
import { TextDialogComponent } from './components/text-dialog/text-dialog.component';
import { SearchComponent } from '@shared/components/search/search.component';
import { MatBadgeModule } from '@angular/material/badge';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { NotificationServiceComponent } from '@shared/components/notification-service/notification-service.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SafePipe } from '@shared/pipes/safe-pipe.pipe';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { PaginatorInternationalization } from '@shared/helpers/paginator-internationalization';
import { PartnersDialogComponent } from './components/partners-dialog/partners-dialog.component';
import { SymbolBlockDirective } from '@shared/directives/symbol-block.directive';
import { MatMenuModule } from '@angular/material/menu';
import { LazyImgDirective } from '@shared/directives/lazy-image.directive';
import { LoaderComponent } from './components/loader/loader.component';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';

const Material = [
  MatSlideToggleModule,
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatFormFieldModule,
  MatDialogModule,
  MatCardModule,
  MatInputModule,
  MatSelectModule,
  MatDatepickerModule,
  NgxMatDatetimePickerModule,
  NgxMatTimepickerModule,
  NgxMatNativeDateModule,
  MatSidenavModule,
  MatListModule,
  MatTooltipModule,
  MatBadgeModule,
  MatTableModule,
  MatSnackBarModule,
  MatChipsModule,
  MatPaginatorModule,
  NgxMatFileInputModule
];

@NgModule({
  declarations: [
    SignInFormComponent,
    SignUpFormComponent,
    GameCardComponent,
    PhoneDirective,
    SymbolBlockDirective,
    LazyImgDirective,
    TextDialogComponent,
    SearchComponent,
    NotificationServiceComponent,
    SafePipe,
    PartnersDialogComponent,
    LoaderComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...Material,
    FormsModule,
    RouterModule,
    MatMenuModule,
  ],
  exports: [
    ...Material,
    ReactiveFormsModule,
    GameCardComponent,
    SearchComponent,
    NotificationServiceComponent,
    PhoneDirective,
    SymbolBlockDirective,
    LazyImgDirective,
    SafePipe,
    LoaderComponent
  ],
  providers: [
    {provide: MatPaginatorIntl, useClass: PaginatorInternationalization}
  ]
})
export class SharedModule { }
