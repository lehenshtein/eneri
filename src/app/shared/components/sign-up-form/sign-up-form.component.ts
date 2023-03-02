import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { compareValidator } from '@shared/validators/compare.validator';
import { IUserRegister } from '@shared/models/user.interface';
import { passPattern } from '@app/shared/helpers/regex-patterns';
import { AuthModalService } from '@shared/services/auth-modal.service';
import { AuthHttpService } from '@shared/services/auth-http.service';
import { takeUntil } from 'rxjs';
import { UnsubscribeAbstract } from '@shared/helpers/unsubscribe.abstract';
import { texts } from '@app/shared/helpers/texts';

@Component({
  selector: 'app-sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.scss']
})
export class SignUpFormComponent extends UnsubscribeAbstract implements OnInit {
  form!: FormGroup;
  passPattern = passPattern;
  showPass = false;
  texts = texts;

  constructor(
    private fb: FormBuilder,
    private authModalService: AuthModalService,
    private authHttpService: AuthHttpService
  ) { super(); }

  ngOnInit(): void {
    this.initForm();
  }

  showPassword() {
    this.showPass = !this.showPass;
  }

  private initForm() {
    this.form = this.fb.group({
      login: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(8), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.pattern(this.passPattern), Validators.minLength(8), Validators.maxLength(40)]],
      repeatPassword: ['', [Validators.required]]
    });
    this.formRepeatPassword.setValidators([Validators.required, compareValidator(this.formPassword)]);
    this.form.updateValueAndValidity();
  }

  get formLogin() {
    return this.form.get('login') as FormControl;
  }
  get formEmail() {
    return this.form.get('email') as FormControl;
  }
  get formPassword() {
    return this.form.get('password') as FormControl;
  }
  get formRepeatPassword() {
    return this.form.get('repeatPassword') as FormControl;
  }

  submit () {
    if (this.form.invalid) {
      return;
    }
    const form = this.form.getRawValue();
    const authData: IUserRegister = {
      username: form.login,
      email: form.email,
      password: form.password
    }
    // this.authModalService.setModalData = this.form.getRawValue();

    this.authHttpService.register(authData).pipe(takeUntil(this.ngUnsubscribe$)).subscribe(res => {
      if (res) {
        this.authModalService.close();//test
      }
    })
  }
}
