import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { SharedModule } from '@shared/shared.module';
import { UserAsMasterComponent } from './user-as-master/user-as-master.component';


@NgModule({
  declarations: [
    UserComponent,
    UserAsMasterComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule
  ]
})
export class UserModule { }
