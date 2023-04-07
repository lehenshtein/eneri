import { Component, OnInit, SecurityContext } from '@angular/core';
import { AuthHttpService } from '@shared/services/auth-http.service';
import { IUser } from '@shared/models/user.interface';
import { UnsubscribeAbstract } from '@shared/helpers/unsubscribe.abstract';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { texts } from '@shared/helpers/texts';
import { UserHttpService } from '@app/user/user-http.service';
import { EMPTY, of, switchMap, take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TextDialogComponent } from '@shared/components/text-dialog/text-dialog.component';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationService } from '@shared/services/notification.service';

@Component({
  selector: 'app-user.content',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent extends UnsubscribeAbstract implements OnInit {
  form!: FormGroup;
  user: IUser | undefined;
  texts = texts;

  constructor (
    private authHttpService: AuthHttpService,
    private fb: FormBuilder,
    private userHttpService: UserHttpService,
    private dialog: MatDialog,
    private dom: DomSanitizer,
    private notificationService: NotificationService,
  ) {
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
      phone: [ this.user?.contactData?.phone || '', [Validators.minLength(12)]],
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
    let dataToSend = {...this.form.getRawValue()};
    let phone = this.form.getRawValue()['contactData']['phone'];
    if (phone.length > 12) {
      phone = this.form.getRawValue()['contactData']['phone'].slice(0, -1);
    }
    dataToSend.contactData.phone = phone;
    this.userHttpService.updateUser(dataToSend).pipe(take(1)).subscribe(res => {
      if (res.message === 'success') {
        this.authHttpService.setUser = {...this.authHttpService.getUser, ...dataToSend};
        this.notificationService.openSnackBar('success', 'Успіх');
      }
    })
  }

  becomeMaster () {
    if (!this.user?.contactData.telegram) {
      this.openApplyDialog('Щоб стати майстром у вас в профілі має бути вказаний телеграм');
      return;
    }
    const text = `Якщо ви справді хочете стати майстром, напишіть нам в телеграм свій нікнейм або електронну скриньку на "Енері",<br> а також кілька слів про свій досвід.
    <a href="https://t.me/lehenshtein" target="_blank" class="primary-text semibold">@LEHENSHTEIN</a>`;

    this.openApplyDialog(this.dom.sanitize(SecurityContext.HTML, text) || '');
  }

  openApplyDialog(text: string, withConfirm: boolean = false, auth: boolean = false) {
    const dialogRef = this.dialog.open(TextDialogComponent, {
      data: {title: 'Стати майстром/ведучим', text, withConfirm, auth},
      autoFocus: false,
      panelClass: 'bordered-dialog'
    });
  }
}
