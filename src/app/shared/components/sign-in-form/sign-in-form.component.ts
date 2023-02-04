import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { passPattern } from '@shared/helpers/regex-patterns';
import { UserLoginInterface } from '@shared/models/user.interface';
import { AuthModalService } from '@shared/services/auth-modal.service';

@Component({
  selector: 'app-sign-in-form',
  templateUrl: './sign-in-form.component.html',
  styleUrls: ['./sign-in-form.component.scss']
})
export class SignInFormComponent implements OnInit {
  @Output() onSubmit = new EventEmitter<UserLoginInterface>();
  form!: FormGroup;
  passPattern = passPattern;
  showPass = false;

  constructor(
    private fb: FormBuilder,
    private authModalService: AuthModalService
  ) { }

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
    this.authModalService.setModalData = this.form.getRawValue();
    this.authModalService.close();//test
    if (this.form.invalid) {
      return;
    }
    this.onSubmit.emit(this.form.getRawValue());
  }
}
