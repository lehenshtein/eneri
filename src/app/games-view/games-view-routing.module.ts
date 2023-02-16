import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamesWrapperComponent } from '@app/games-view/games-wrapper/games-wrapper.component';

const routes: Routes = [
  {path: '', component: GamesWrapperComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GamesViewRoutingModule { }
