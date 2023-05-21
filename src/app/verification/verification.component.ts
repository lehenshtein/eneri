import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { UnsubscribeAbstract } from '@shared/helpers/unsubscribe.abstract';
import { AuthHttpService } from '@shared/services/auth-http.service';
import { MatDialog } from '@angular/material/dialog';
import { TextDialogComponent } from '@shared/components/text-dialog/text-dialog.component';
import { texts } from '@app/shared/helpers/texts';

@Component({
  selector: 'app-verification.content',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent extends UnsubscribeAbstract implements OnInit {
  verificationCode: string | undefined = undefined;
  form!: FormGroup;
  texts = texts;

  constructor (
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authHttpService: AuthHttpService,
    private dialog: MatDialog,
    private router: Router,
  ) {
    super();
    this.verificationCode = this.route.snapshot.params['code'];
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.form = this.fb.group({
      verificationCode: [this.verificationCode ? this.verificationCode : '',
        [Validators.required, Validators.minLength(8), Validators.maxLength(8)]]
    });
    this.verify();
  }

  get formVerificationCode() {
    return this.form.get('verificationCode') as FormControl;
  }

  verify () {
    if (this.form.invalid) {
      return;
    }
    this.authHttpService.verify(this.formVerificationCode.getRawValue()).pipe(
      takeUntil(this.ngUnsubscribe$)
    ).subscribe(() => {
      this.dialog.open(TextDialogComponent, {
        data: {title: 'Успіх', text: 'Пошту підтверджено'},
        autoFocus: false,
        panelClass: 'bordered-dialog'
      });
      const newUser = this.authHttpService.getUser;
      if (newUser) {
        newUser.verified = true;
        this.authHttpService.setUser = newUser;
      }
      this.router.navigate(['/'])
    })
  }
}
