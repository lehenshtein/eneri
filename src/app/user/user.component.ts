import { Component, OnInit } from '@angular/core';
import { AuthHttpService } from '@shared/services/auth-http.service';
import { IUser } from '@shared/models/user.interface';
import { UnsubscribeAbstract } from '@shared/helpers/unsubscribe.abstract';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { texts } from '@shared/helpers/texts';

@Component({
  selector: 'app-user.content',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent extends UnsubscribeAbstract implements OnInit {
  form!: FormGroup;
  user: IUser | undefined;
  texts = texts;

  constructor (private authHttpService: AuthHttpService, private fb: FormBuilder,) {
    super();
  }

  ngOnInit () {
    this.authHttpService.user$.subscribe((user: IUser | undefined) => {
      this.user = user;
      this.initForm();
    })
  }

  private initForm() {
    if (!this.user) {
      return;
    }
    this.form = this.fb.group({
      name: [this.user.name, [Validators.maxLength(30)]],
      contactData: this.contactDataGroup
    });

    this.form.disable();
  }

  get contactDataGroup (): FormGroup {
    return this.fb.group({
      phone: [ this.user?.contactData?.phone || '', [Validators.minLength(10)]],
      telegram: [ this.user?.contactData?.telegram || '', [ Validators.minLength(3), Validators.maxLength(30) ] ]
    });
  }

  get formName(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get formContactDataGroup(): FormGroup {
    return this.form.get('contactData') as FormGroup;
  }

  get formPhone(): FormControl {
    return this.formContactDataGroup.get('phone') as FormControl;
  }
  get formTelegram(): FormControl {
    return this.formContactDataGroup.get('telegram') as FormControl;
  }

  toggleForm () {
    if (this.form.disabled) {
      this.form.enable();
      return;
    }
    this.form.disable();
  }

  submit () {

  }
}
