import { Component } from '@angular/core';
import { AuthModalService } from '@shared/services/auth-modal.service';
import { SignUpFormComponent } from '@shared/components/sign-up-form/sign-up-form.component';
import { SignInFormComponent } from '@shared/components/sign-in-form/sign-in-form.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  constructor (private authModalService: AuthModalService) {
  }

  dialog (type: 'signup' | 'signin') {
    if (type === 'signup') {
      this.authModalService.openDialog(SignUpFormComponent);
      return;
    }
    this.authModalService.openDialog(SignInFormComponent)
  }
}
