import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GamesViewRoutingModule } from './games-view-routing.module';
import { GamesWrapperComponent } from './games-wrapper/games-wrapper.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    GamesWrapperComponent
  ],
  imports: [
    CommonModule,
    GamesViewRoutingModule,
    SharedModule
  ]
})
export class GamesViewModule { }
