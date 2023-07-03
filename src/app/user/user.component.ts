import { Component, OnInit, SecurityContext } from '@angular/core';
import { AuthHttpService } from '@shared/services/auth-http.service';
import { IUser } from '@shared/models/user.interface';
import { UnsubscribeAbstract } from '@shared/helpers/unsubscribe.abstract';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { texts } from '@shared/helpers/texts';
import { UserHttpService } from '@app/user/user-http.service';
import { finalize, take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TextDialogComponent } from '@shared/components/text-dialog/text-dialog.component';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationService } from '@shared/services/notification.service';
import { telegramPattern } from '@shared/helpers/regex-patterns';
import { createFormDataWithFile } from '@shared/helpers/forms.helper';
import { MaxSizeValidator } from '@angular-material-components/file-input';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-user.content',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent extends UnsubscribeAbstract implements OnInit {
  form!: FormGroup;
  user: IUser | undefined;
  texts = texts;
  date = new Date;
  nextEmailDate = new Date();
  maxImageSize = 1024 * 1024 * 3; // 3 MB
  loading = false;

  constructor (
    private authHttpService: AuthHttpService,
    private fb: FormBuilder,
    private userHttpService: UserHttpService,
    private dialog: MatDialog,
    private dom: DomSanitizer,
    private notificationService: NotificationService,
    private clipboard: Clipboard
  ) {
    super();
  }

  ngOnInit () {
    this.authHttpService.user$.subscribe((user: IUser | undefined) => {
      this.user = user;
      if (this.user && !this.user.verified) {
        this.updateNextEmailDate(this.user.verificationDate);
      }
      this.initForm();
    })
  }

  private initForm() {
    if (!this.user) {
      return;
    }
    this.form = this.fb.group({
      name: [this.user.name || '', [Validators.maxLength(30)]],
      about: [this.user.about, [Validators.maxLength(600)]],
      fullAccessCode: [this.user.fullAccessCode || '', [Validators.maxLength(30)]],
      showContacts: [this.user.showContacts || false],
      file: [ null, [MaxSizeValidator(this.maxImageSize)] ],
      contactData: this.contactDataGroup
    });

    this.form.disable();
  }

  get contactDataGroup (): FormGroup {
    return this.fb.group({
      phone: [ this.user?.contactData?.phone || '', [Validators.minLength(12)]],
      telegram: [ this.user?.contactData?.telegram || '', [ Validators.minLength(3), Validators.maxLength(30), Validators.pattern(telegramPattern) ] ]
    });
  }

  get formName(): FormControl {
    return this.form.get('name') as FormControl;
  }

  get formAbout(): FormControl {
    return this.form.get('about') as FormControl;
  }

  get formFile () {
    return this.form.get('file') as FormControl;
  }

  get formFullAccessCode(): FormControl {
    return this.form.get('fullAccessCode') as FormControl;
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
    this.loading = true;
    let dataToSend = {...this.form.getRawValue()};
    let phone = this.form.getRawValue()['contactData']['phone'];
    if (phone.length > 12) {
      phone = this.form.getRawValue()['contactData']['phone'].slice(0, -1);
    }
    dataToSend.contactData.phone = phone;

    if (this.user?.gameRole === 'player') {
      dataToSend.showContacts = false;
    }
    const dataWithContactsStringified = {...dataToSend, contactData: JSON.stringify(dataToSend.contactData)};
    const formData = createFormDataWithFile(dataWithContactsStringified, 'avatar');
    this.userHttpService.updateUser(formData).pipe(take(1), finalize(() => this.loading = false)).subscribe(res => {
      if (res.message === 'success') {
        if (dataToSend.file) {
          dataToSend.avatar = URL.createObjectURL(dataToSend.file as File)
        }
        this.authHttpService.setUser = {...this.authHttpService.getUser, ...dataToSend};
        this.notificationService.openSnackBar('success', 'Успіх');
      }
    })
  }

  becomeMaster () {
    if (!this.user?.contactData?.telegram) {
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

  timeToResendMail (): { minutes: number, seconds: number } {
    const timeDiff = Math.abs(this.nextEmailDate.getTime() - this.date.getTime()) / 1000;
    return {
      minutes: Math.round(timeDiff / 60),
      seconds: Math.round(timeDiff % 60)
    };
  }

  updateDate () {
    this.date = new Date();
  }

  resendEmail () {
    this.authHttpService.resendEmail().pipe(take(1)).subscribe(verificationDate => {
      this.notificationService.openSnackBar('success', 'Листа надіслано.');
      this.updateNextEmailDate(verificationDate);
    })
  }
  private updateNextEmailDate(nextDate: Date) {
    const date = new Date(nextDate);
    this.nextEmailDate = new Date(date.setHours(date.getHours() + 1));
  }

  copy() {
    this.clipboard.copy(`https://eneri.com.ua/user/${this.user?.username}?fullAccessKey=${this.formFullAccessCode.value}`);
    this.notificationService.openSnackBar('info', 'Скопійовано, тепер надішли це кудись.', 'Ура!')
  }
}
