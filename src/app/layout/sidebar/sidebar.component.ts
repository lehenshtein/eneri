import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthModalService } from '@shared/services/auth-modal.service';
import { AuthHttpService } from '@shared/services/auth-http.service';
import { SignUpFormComponent } from '@shared/components/sign-up-form/sign-up-form.component';
import { SignInFormComponent } from '@shared/components/sign-in-form/sign-in-form.component';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Output() closeMenu: EventEmitter<any> = new EventEmitter<any>();
  user$ = this.authHttpService.user$;
  isShowSuspended = false;

  constructor (
    private authModalService: AuthModalService,
    private authHttpService: AuthHttpService,
    private sharedService: SharedService
  ) {
  }

  tryCloseMenu() {
    this.closeMenu.emit()
  }

  dialog (type: 'signup' | 'signin') {
    if (type === 'signup') {
      this.authModalService.openDialog(SignUpFormComponent);
      return;
    }
    this.authModalService.openDialog(SignInFormComponent)
  }

  logout () {
    this.authHttpService.logout();
  }

  showSuspended () {
    this.isShowSuspended = !this.isShowSuspended;
    this.sharedService.showSuspendedSet(this.isShowSuspended);
  }
}
