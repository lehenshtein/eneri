import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthModalService } from '@shared/services/auth-modal.service';
import { SignUpFormComponent } from '@shared/components/sign-up-form/sign-up-form.component';
import { SignInFormComponent } from '@shared/components/sign-in-form/sign-in-form.component';
import { AuthHttpService } from '@shared/services/auth-http.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() showNavbar: boolean = true;
  @Output() toggleMenu: EventEmitter<any> = new EventEmitter<any>();
  user$ = this.authHttpService.user$;
  constructor (private authModalService: AuthModalService, private authHttpService: AuthHttpService) {
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
}
