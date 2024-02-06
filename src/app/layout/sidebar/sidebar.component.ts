import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
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
import {
  ActivatedRoute,
  IsActiveMatchOptions,
  NavigationEnd,
  Params,
  QueryParamsHandling,
  Router,
} from '@angular/router';
import { filter, map, Observable, take } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PartnersDialogComponent } from '@shared/components/partners-dialog/partners-dialog.component';
import { DOCUMENT } from '@angular/common';
import { gameRoles } from '@shared/models/gameRoles.type';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  private window!: Window;
  @ViewChild('searchComponent') searchComponent!: SearchComponent;
  @Input() hideSidebarOnClick: boolean = false;
  @Output() closeMenu: EventEmitter<any> = new EventEmitter<any>();
  routerActiveLinkOptions: IsActiveMatchOptions = {
    paths: 'exact',
    queryParams: 'ignored',
    matrixParams: 'ignored',
    fragment: 'ignored',
  };
  form!: FormGroup;
  user$ = this.authHttpService.user$;
  searchText = '';
  isShowSuspended = true;
  texts = texts;
  cities: ICity[] = cities;
  gameSystems: IGameSystem[] = gameSystems;
  filtersDisabled = false;
  urlsForNotDisablingFilter = [
    '',
    '/',
    '/my-created',
    '/my-games',
    '/game-requests',
  ];
  links: {
    link: string;
    text: string;
    permissions: null | gameRoles;
    queryHandling: QueryParamsHandling | null | undefined;
  }[] = [
    {
      link: 'user',
      text: 'РЕДАГУВАТИ ПРОФІЛЬ',
      permissions: null,
      queryHandling: null,
    },
    { link: 'games', text: 'ІГРИ', permissions: null, queryHandling: null },
    {
      link: 'games/game-requests',
      text: 'ЗАПИТИ ГРИ',
      permissions: null,
      queryHandling: null,
    },
    {
      link: 'create-game',
      text: 'СТВОРИТИ ПРИГОДУ',
      permissions: 'both',
      queryHandling: null,
    },
    {
      link: 'create-game-request',
      text: 'СТВОРИТИ ЗАПИТ ГРИ',
      permissions: null,
      queryHandling: null,
    },
    {
      link: 'my-created',
      text: 'ІСТОРІЯ МАЙСТРА',
      permissions: 'both',
      queryHandling: null,
    },
    {
      link: 'my-games',
      text: 'ІСТОРІЯ ГРАВЦЯ',
      permissions: null,
      queryHandling: null,
    },
  ];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private authModalService: AuthModalService,
    private authHttpService: AuthHttpService,
    private sharedService: SharedService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialogRef: MatDialog
  ) {
    if (this.document.defaultView) {
      this.window = this.document.defaultView;
    }
  }

  ngOnInit(): void {
    this.filtersChanging();
    this.tagsSearch();
    this.initForm();
    this.checkQuery();
  }

  private checkQuery() {
    this.sharedService.queryFilters$.pipe(take(1)).subscribe((res) => {
      if (this.form) {
        res['gameSystemId'] &&
          this.formGameSystemId.patchValue(+res['gameSystemId']);
        res['cityCode'] && this.formCityCode.patchValue(+res['cityCode']);
        res['sort'] && this.formSort.patchValue(+res['sort']);
        if (res['search']) {
          this.searchText = res['search'];
          this.searchComponent.text = res['search'];
        }
        this.sharedService.filtersSet({
          ...this.form.getRawValue(),
          search: this.searchComponent?.text,
        });
      }
    });
  }

  private filtersChanging() {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        map((e) => {
          const urlForNotDisablingFilter = !this.urlsForNotDisablingFilter.find(
            (url) => url === e.url.split('?')[0]
          );
          if (!urlForNotDisablingFilter && e.url.includes('?')) {
            return;
          }
          this.filtersDisabled = urlForNotDisablingFilter;
          this.resetFilters();
          this.filtersDisabled ? this.form.disable() : this.form.enable();
        })
      )
      .subscribe();
  }

  private resetFilters() {
    this.form.reset();
    this.formSort.reset(0);
    this.isShowSuspended = true;
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
    });
  }

  private initForm() {
    this.form = this.fb.group({
      gameSystemId: [{ value: null, disabled: this.filtersDisabled }],
      cityCode: [{ value: null, disabled: this.filtersDisabled }],
      sort: [{ value: 0, disabled: this.filtersDisabled }],
    });
  }

  get formGameSystemId() {
    return this.form.get('gameSystemId') as FormControl;
  }
  get formCityCode() {
    return this.form.get('cityCode') as FormControl;
  }
  get formSort() {
    return this.form.get('sort') as FormControl;
  }

  tryCloseMenu() {
    this.closeMenu.emit();
  }

  dialog(type: 'signup' | 'signin') {
    if (this.hideSidebarOnClick) {
      this.closeMenu.emit();
    }
    if (type === 'signup') {
      this.authModalService.openDialog(SignUpFormComponent);
      return;
    }
    this.authModalService.openDialog(SignInFormComponent);
  }

  partnersDialog() {
    if (this.hideSidebarOnClick) {
      this.closeMenu.emit();
    }
    this.dialogRef.open(PartnersDialogComponent, {
      minWidth: '50%',
      width: '700px',
      maxWidth: '90vw',
      autoFocus: false,
      panelClass: 'bordered-dialog',
    });
  }

  logout() {
    this.authHttpService.logout();
  }

  showSuspended() {
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
    this.addQuery();
  }

  submit() {
    if (this.hideSidebarOnClick) {
      this.closeMenu.emit();
    }
    this.addQuery();
    this.sharedService.filtersSet({
      ...this.form.getRawValue(),
      search: this.searchComponent?.text,
    });
  }

  addQuery() {
    const queryParams: Params = {
      search: this.searchText || null,
      ...this.form.getRawValue(),
    };
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: queryParams,
      queryParamsHandling: 'merge', // remove to replace all query params by provided
      preserveFragment: true,
    });
  }

  openTg() {
    this.window.open(`https://telegram.me/EneriNews`, '_blank');
  }
}
