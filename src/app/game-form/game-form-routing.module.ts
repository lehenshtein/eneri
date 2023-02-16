import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameFormComponent } from '@app/game-form/game-form.component';

const routes: Routes = [{ path: '', component: GameFormComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameFormRoutingModule { }
