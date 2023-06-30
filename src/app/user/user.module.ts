import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { SharedModule } from '@shared/shared.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { GamesViewModule } from '@app/games-view/games-view.module';


@NgModule({
  declarations: [
    UserComponent,
    UserProfileComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    GamesViewModule
  ]
})
export class UserModule { }
