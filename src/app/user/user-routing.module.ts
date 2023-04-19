import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { UserAsMasterComponent } from '@app/user/user-as-master/user-as-master.component';

const routes: Routes = [
  { path: '', component: UserComponent },
  { path: ':username', component: UserAsMasterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
