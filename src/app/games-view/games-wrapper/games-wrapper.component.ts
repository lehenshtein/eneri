import { Component, Input, OnInit } from '@angular/core';
import { GameHttpService } from '@shared/services/game-http.service';
import { finalize, Observable, switchMap, takeUntil } from 'rxjs';
import { IGameResponse } from '@shared/models/game.interface';
import { IUser } from '@shared/models/user.interface';
import { AuthHttpService } from '@shared/services/auth-http.service';
import { SharedService } from '@shared/services/shared.service';
import { UnsubscribeAbstract } from '@shared/helpers/unsubscribe.abstract';
import { IGameFilters } from '@shared/models/game-filters.interface';
import { ActivatedRoute } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { HttpResponse } from '@angular/common/http';
import { MetaHelper } from '@shared/helpers/meta.helper';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-games-wrapper',
  templateUrl: './games-wrapper.component.html',
  styleUrls: ['./games-wrapper.component.scss']
})
export class GamesWrapperComponent extends UnsubscribeAbstract implements OnInit {
  @Input() userProfilePage = false;
  fullAccessKey?: string;
  loading = false;
  tabletView = false;
  games: IGameResponse[] = [];
  user: IUser | undefined;
  gamesFor: 'player' | 'master' | undefined;
  page = 0;
  limit = 20;
  total = 20;
  filters: IGameFilters = {
    search: '',
    isShowSuspended: true,
    gameSystemId: null,
    cityCode: null,
    sort: 0
  }
  pageDescription = {
      games: {title: 'Ігри', description: 'В цьому розділі знаходяться всі ігри створені майстрами. Ви можете записатися на будь-яку гру та обумовити деталі з майстром.'},
      gameRequests: {title: 'Запити гри', description: 'Перелік ігор створенних гравцями, або партіями які не мали майстра на момент створення. Записатись на таку гру можуть, як гравець (в ролі гравця) так і майстер (в ролі майстра, або гравця).'},
      myGames: {title: 'Історія гравця', description: 'Це всі ігри де ви були записані в якості гравця. В тому числі створені вами "Запити гри".'},
      createdGames: {title: 'Історія майстра', description: 'Перелік ігор в яких ви виступали в ролі майстра. В чому числі ігри на які ви записувалися, як майстер у розділі "Запити гри".'},
      };
  texts: string[] = ['Створюй. Шукай. Грай.', 'Щоб змогти 5 сесій на тиждень треба лише...<br>Записатися на гру',
    'Хочеш поганяти Страдів по Баровії?<br>Записуйся!', 'Вільні гравці в твоєму районі хочуть пограти з тобою', 'Привіт, хочеш розповімо тобі про АоСік?',
    'Не подобається, куди йде сюжет? Виженіть майстра і продовжуйте самі.'];
  subtitle = this.texts[0];
  gameRequest = false;
  isBrowser = false;
  constructor (
    private gameHttpService: GameHttpService,
    private authHttpService: AuthHttpService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private metaHelper: MetaHelper,
    private breakpointObserver: BreakpointObserver,
    ) {
    super();
    this.gameRequest = this.route.snapshot.data['page'] === 'game-request';
    this.isBrowser = this.sharedService.isBrowser;
  }

  ngOnInit(): void {
    this.resize();
    this.metaHelper.resetMeta();
    this.setUser();
    this.route.snapshot.routeConfig?.path === 'my-games' ? this.gamesFor = 'player' :
      this.route.snapshot.routeConfig?.path === 'my-created' ? this.gamesFor = 'master' :
        this.gamesFor = undefined;
    this.setSubtitle();
    this.checkQuery();
    this.searchChanges();
    this.filterChanges();
    this.suspendedChanges();
  }
  private resize () {
    this.breakpointObserver.observe([
      '(max-width: 748px)'
    ]).subscribe((result: BreakpointState) => {
      this.tabletView = result.breakpoints['(max-width: 748px)'];
    });
  }

  setUser() {
    this.authHttpService.user$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((user: IUser | undefined) => {
      this.user = user;
    });
  }

  private checkQuery() {
    this.fullAccessKey = this.route.snapshot.queryParams['fullAccessKey'];
    this.sharedService.queryFiltersSet(this.route.snapshot.queryParams);
  }

  getPageDescription(): {title: string, description: string} {
    if (this.gameRequest) {
      return this.pageDescription.gameRequests;
    } else if (!this.gameRequest && !this.gamesFor) {
      return this.pageDescription.games;
    } else if (!this.gameRequest && this.gamesFor === 'player') {
      return this.pageDescription.myGames;
    } else {
      return this.pageDescription.createdGames;
    }
  }

  searchChanges() {
    this.sharedService.search$.pipe(takeUntil(this.ngUnsubscribe$), switchMap((search: string) => {
      this.loading = true;
      const queryParams = this.route.snapshot.queryParams;
      this.filters.search = search;
      const filter: IGameFilters = {
        search: search || queryParams['search'],
        isShowSuspended: this.filters.isShowSuspended,
        gameSystemId: queryParams['gameSystemId'] || null,
        cityCode: queryParams['cityCode'] || null,
        sort: queryParams['sort'] || 0
      }
      const request = this.userProfilePage ?
        this.gameHttpService.fetchGames(filter, this.page, this.limit, this.gamesFor, this.route.snapshot.params['username'], this.fullAccessKey) :
        this.gameRequest ?
        this.gameHttpService.fetchGameRequests(filter, this.page, this.limit, this.gamesFor) :
        this.gameHttpService.fetchGames(filter, this.page, this.limit, this.gamesFor);
      return request.pipe(takeUntil(this.ngUnsubscribe$), finalize(() => this.loading = false));
    })).pipe(takeUntil(this.ngUnsubscribe$)).subscribe((res: HttpResponse<IGameResponse[]>) => {
      this.gamesResponseAction(res);
    })
  }
  filterChanges() {
    this.loading = true;
    this.sharedService.filters$.pipe(takeUntil(this.ngUnsubscribe$), switchMap((filter: Partial<IGameFilters>) => {
      this.filters.gameSystemId = filter.gameSystemId;
      this.filters.cityCode = filter.cityCode;
      this.filters.search = filter.search || '';
      this.filters.sort = filter.sort || 0;
      return this.fetchGames();
    })).pipe(takeUntil(this.ngUnsubscribe$)).subscribe((res: HttpResponse<IGameResponse[]>) => {
      this.gamesResponseAction(res);
    })
  }
  suspendedChanges() {
    this.loading = true;
    this.sharedService.showSuspended$.pipe(takeUntil(this.ngUnsubscribe$), switchMap((isShowSuspended: boolean) => {
      this.filters.isShowSuspended = isShowSuspended;
      return this.fetchGames();
    })).pipe(takeUntil(this.ngUnsubscribe$)).subscribe((res: HttpResponse<IGameResponse[]>) => {
      this.gamesResponseAction(res);
    })
  }
  handlePageEvent ($event: PageEvent) {
    this.loading = true;
    this.page = $event.pageIndex;
    this.fetchGames().subscribe((res: HttpResponse<IGameResponse[]>) => {
      this.gamesResponseAction(res);
    })
  }

  fetchGames(): Observable<HttpResponse<IGameResponse[]>> {
    this.loading = true;
    const request = this.userProfilePage ?
      this.gameHttpService.fetchGames(this.filters, this.page, this.limit, this.gamesFor, this.route.snapshot.params['username'], this.fullAccessKey) :
      this.gameRequest ? this.gameHttpService.fetchGameRequests(this.filters, this.page, this.limit, this.gamesFor) : this.gameHttpService.fetchGames(this.filters, this.page, this.limit, this.gamesFor);
    return request.pipe(takeUntil(this.ngUnsubscribe$), finalize(() => this.loading = false));
  }
  gamesResponseAction(res: HttpResponse<IGameResponse[]>) {
    this.games = res.body || [];
    if (res.headers.get('x-page')) {
      this.page = +res.headers.get('x-page')!;
    }
    if (res.headers.get('x-total')) {
      this.total = +res.headers.get('x-total')!;
    }
  }

  getRandomNumb(num: number) {
    return Math.floor(Math.random() * num);
  }
  setSubtitle() {
    const randomNum = this.getRandomNumb(this.texts.length);
    this.subtitle = this.texts[randomNum];
  }
}
