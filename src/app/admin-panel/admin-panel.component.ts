import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { texts } from '@app/shared/helpers/texts';
import { AdminService } from '@app/admin-panel/admin.service';
import { take } from 'rxjs';
import { IUser } from '@shared/models/user.interface';

@Component({
  selector: 'app-admin-panel.content',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent {
  constructor (private fb: FormBuilder, private adminService: AdminService) {
  }
  form!: FormGroup;
  texts = texts;
  user?: IUser;

  ngOnInit(): void {
    this.initForm();
  }

  private initForm() {
    this.form = this.fb.group({
      userField: ['', ]
    });
  }

  get formUserField() {
    return this.form.get('userField') as FormControl;
  }

  getUser () {
    this.adminService.fetchUserForAdmin(this.formUserField.getRawValue()).pipe(take(1)).subscribe((res: IUser) => {
      this.user = res;
    })
  }

  changeGameRole (username: string) {
    this.adminService.changeGameRole(username).pipe(take(1)).subscribe((res: IUser['gameRole']) => {
      if (this.user) {
        this.user.gameRole = res;
      }
    })
  }
  changeEmailVerification (username: string) {
    this.adminService.changeEmailVerification(username).pipe(take(1)).subscribe((res: { verified: boolean, verificationDate: Date }) => {
      if (this.user) {
        this.user.verified = res.verified;
        this.user.verificationDate = res.verificationDate;
      }
    })
  }
}
