import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { UserProfileComponent } from '@app/user/user-profile/user-profile.component';

const routes: Routes = [
  { path: '', component: UserComponent },
  { path: ':username', component: UserProfileComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
