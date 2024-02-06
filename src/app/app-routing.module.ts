import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from '@app/about/about.component';
import { AdminPanelComponent } from '@app/admin-panel/admin-panel.component';
import { RoleGuard } from '@shared/guards/role.guard';
import { VerificationComponent } from '@app/verification/verification.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  { path: 'about', title: 'ЕНЕРІ | Про нас', component: AboutComponent },
  { path: 'admin', component: AdminPanelComponent, canActivate: [RoleGuard] },
  {
    path: 'verification',
    title: 'ЕНЕРІ | Верифікація',
    component: VerificationComponent,
  },
  {
    path: 'verification/:code',
    title: 'ЕНЕРІ | Верифікація',
    component: VerificationComponent,
  },
  {
    path: 'create-game-request',
    title: 'ЕНЕРІ | Створити запит гри',
    loadChildren: () =>
      import('./game-form/game-form.module').then((m) => m.GameFormModule),
    data: { page: 'game-request' },
  },
  {
    path: 'create-game',
    title: 'ЕНЕРІ | Створити гру',
    loadChildren: () =>
      import('./game-form/game-form.module').then((m) => m.GameFormModule),
    data: { page: 'game' },
  },
  {
    path: 'edit-game/:master/:id',
    title: 'ЕНЕРІ | Редагувати гру',
    loadChildren: () =>
      import('./game-form/game-form.module').then((m) => m.GameFormModule),
    data: { page: 'game' },
  },
  {
    path: 'edit-game-request/:creator/:id',
    title: 'ЕНЕРІ | Редагувати гру',
    loadChildren: () =>
      import('./game-form/game-form.module').then((m) => m.GameFormModule),
    data: { page: 'game-request' },
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'games/game-request/:creator/:id',
    loadChildren: () =>
      import('./game-details/game-details.module').then(
        (m) => m.GameDetailsModule
      ),
    data: { page: 'game-request' },
  },
  {
    path: 'games',
    loadChildren: () =>
      import('./games-view/games-view.module').then((m) => m.GamesViewModule),
  },
  {
    path: 'games/:master/:id',
    loadChildren: () =>
      import('./game-details/game-details.module').then(
        (m) => m.GameDetailsModule
      ),
    data: { page: 'game' },
  },
  { path: '**', redirectTo: '' },
  // { path: 'post/:id', loadChildren: () => import('./post-page/post-page.module').then(m => m.PostPageModule) }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
