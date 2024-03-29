import { Component, OnInit,  } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { passPattern } from '@shared/helpers/regex-patterns';
import { AuthModalService } from '@shared/services/auth-modal.service';
import { AuthHttpService } from '@shared/services/auth-http.service';
import { UnsubscribeAbstract } from '@shared/helpers/unsubscribe.abstract';
import { takeUntil } from 'rxjs';
import { texts } from '@shared/helpers/texts';

@Component({
  selector: 'app-sign-in-form',
  templateUrl: './sign-in-form.component.html',
  styleUrls: ['./sign-in-form.component.scss']
})
export class SignInFormComponent extends UnsubscribeAbstract implements OnInit {
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
      email: ['', [Validators.required, Validators.email, Validators.minLength(8), Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.pattern(this.passPattern), Validators.minLength(8), Validators.maxLength(40)]]
    });
  }

  get formEmail() {
    return this.form.get('email') as FormControl;
  }
  get formPassword() {
    return this.form.get('password') as FormControl;
  }

  submit () {
    if (this.form.invalid) {
      return;
    }
    this.authHttpService.login(this.form.getRawValue()).pipe(takeUntil(this.ngUnsubscribe$),).subscribe(res => {
      if (res) {
        this.authModalService.close();//test
      }
    })
  }
}
