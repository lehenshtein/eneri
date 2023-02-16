import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameFormComponent } from './game-form.component';
import { GameFormRoutingModule } from '@app/game-form/game-form-routing.module';
import { SharedModule } from '@shared/shared.module';



@NgModule({
  declarations: [
    GameFormComponent
  ],
  imports: [
    CommonModule,
    GameFormRoutingModule,
    SharedModule
  ]
})
export class GameFormModule { }
