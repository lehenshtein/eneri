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
import { TelegramDirective } from '@shared/directives/telegram.directive';
import { NotificationServiceComponent } from '@shared/components/notification-service/notification-service.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SafePipe } from '@shared/pipes/safe-pipe.pipe';

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
];

@NgModule({
  declarations: [
    SignInFormComponent,
    SignUpFormComponent,
    GameCardComponent,
    PhoneDirective,
    TelegramDirective,
    TextDialogComponent,
    SearchComponent,
    NotificationServiceComponent,
    SafePipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...Material,
    FormsModule,
    RouterModule,
  ],
  exports: [
    ...Material,
    ReactiveFormsModule,
    GameCardComponent,
    SearchComponent,
    NotificationServiceComponent,
    PhoneDirective,
    TelegramDirective,
    SafePipe
  ]
})
export class SharedModule { }
