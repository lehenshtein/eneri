import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'create-game', loadChildren: () => import('./game-form/game-form.module').then(m => m.GameFormModule) },
  { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
  { path: '', loadChildren: () => import('./games-view/games-view.module').then(m => m.GamesViewModule) },
  { path: '**', redirectTo: '' }
  // { path: 'post/:id', loadChildren: () => import('./post-page/post-page.module').then(m => m.PostPageModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
