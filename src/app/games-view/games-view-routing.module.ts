import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GamesWrapperComponent } from '@app/games-view/games-wrapper/games-wrapper.component';

const routes: Routes = [
  {path: '', component: GamesWrapperComponent, data: {page: 'game'}},
  {path: 'my-created', component: GamesWrapperComponent},
  {path: 'my-games', component: GamesWrapperComponent},
  { path: 'game-requests', component: GamesWrapperComponent, data: {page: 'game-request'} },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GamesViewRoutingModule { }
