import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AuthModalService } from '@shared/services/auth-modal.service';
import { AuthHttpService } from '@shared/services/auth-http.service';
import { SignUpFormComponent } from '@shared/components/sign-up-form/sign-up-form.component';
import { SignInFormComponent } from '@shared/components/sign-in-form/sign-in-form.component';
import { SharedService } from '@shared/services/shared.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ICity } from '@shared/models/city.interface';
import { IGameSystem } from '@shared/models/game.interface';
import { cities } from '@app/shared/helpers/cities';
import { gameSystems } from '@app/shared/helpers/game-systems';
import { texts } from '@app/shared/helpers/texts';
import { SearchComponent } from '@shared/components/search/search.component';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @ViewChild('searchComponent') searchComponent!: SearchComponent;
  @Input() hideSidebarOnClick: boolean = false;
  @Output() closeMenu: EventEmitter<any> = new EventEmitter<any>();
  form!: FormGroup;
  user$ = this.authHttpService.user$;
  searchText = '';
  isShowSuspended = false;
  texts = texts;
  cities: ICity[] = cities;
  gameSystems: IGameSystem[] = gameSystems;

  constructor (
    private authModalService: AuthModalService,
    private authHttpService: AuthHttpService,
    private sharedService: SharedService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit (): void {
    this.initForm();
  }

  private initForm () {
    this.form = this.fb.group({
      gameSystemId: [ null ],
      cityCode: [ null ],
      sort: [ 0 ]
    });
  }

  get formGameSystemId () {
    return this.form.get('gameSystemId') as FormControl;
  }
  get formCityCode () {
    return this.form.get('cityCode') as FormControl;
  }

  tryCloseMenu() {
    this.closeMenu.emit()
  }

  dialog (type: 'signup' | 'signin') {
    if (this.hideSidebarOnClick) {
      this.closeMenu.emit();
    }
    if (type === 'signup') {
      this.authModalService.openDialog(SignUpFormComponent);
      return;
    }
    this.authModalService.openDialog(SignInFormComponent)
  }

  logout () {
    this.authHttpService.logout();
  }

  showSuspended () {
    this.isShowSuspended = !this.isShowSuspended;
    this.sharedService.showSuspendedSet(this.isShowSuspended);
  }

  search(text: string) {
    if (this.hideSidebarOnClick) {
      this.closeMenu.emit();
    }
    this.form.reset();
    this.sharedService.searchSubjectSet(text);
    this.searchText = text;
    if (!text) {
      this.searchComponent.text = '';
    }
  }

  submit () {
    if (this.hideSidebarOnClick) {
      this.closeMenu.emit();
    }
    this.sharedService.filtersSet({...this.form.getRawValue(), search: this.searchComponent.text});
  }
}
