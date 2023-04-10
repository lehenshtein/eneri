import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AuthModalService } from '@shared/services/auth-modal.service';
import { AuthHttpService } from '@shared/services/auth-http.service';
import { SignUpFormComponent } from '@shared/components/sign-up-form/sign-up-form.component';
import { SignInFormComponent } from '@shared/components/sign-in-form/sign-in-form.component';
import { SharedService } from '@shared/services/shared.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ICity } from '@shared/models/city.interface';
import { IGameSystem } from '@shared/models/game.interface';
import { cities } from '@app/shared/helpers/cities';
import { gameSystems } from '@app/shared/helpers/game-systems';
import { texts } from '@app/shared/helpers/texts';
import { SearchComponent } from '@shared/components/search/search.component';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

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
  filtersDisabled = false;
  urlsForNotDisablingFilter = ['', '/', '/my-created', '/my-games'];

  constructor (
    private authModalService: AuthModalService,
    private authHttpService: AuthHttpService,
    private sharedService: SharedService,
    private fb: FormBuilder,
    private router: Router
  ) {
  }

  ngOnInit (): void {
    this.filtersChanging();
    this.tagsSearch();
    this.initForm();
  }

  private filtersChanging() {
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => {
        this.resetFilters();
        this.filtersDisabled = !this.urlsForNotDisablingFilter.find(url => url === e.url);
        this.filtersDisabled ? this.form.disable() : this.form.enable();
      })
    ).subscribe();
  }

  private resetFilters() {
    this.form.reset();
    this.formSort.reset(0);
    this.isShowSuspended = false;
    this.sharedService.searchSubjectSet('');
    this.searchComponent.text = '';
    this.searchText = '';
  }
  private tagsSearch() {
    this.sharedService.tagSearch$.subscribe((text: string | null) => {

      if (text === null) {
        return;
      }
      this.searchComponent.text = text;
      this.search(text);
    })
  };

  private initForm () {
    this.form = this.fb.group({
      gameSystemId: [ {value: null, disabled: this.filtersDisabled} ],
      cityCode: [ {value: null, disabled: this.filtersDisabled} ],
      sort: [ {value: 0, disabled: this.filtersDisabled} ]
    });
  }

  get formGameSystemId () {
    return this.form.get('gameSystemId') as FormControl;
  }
  get formCityCode () {
    return this.form.get('cityCode') as FormControl;
  }
  get formSort () {
    return this.form.get('sort') as FormControl;
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
    if (this.form) {
      this.form.reset();
    }
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
