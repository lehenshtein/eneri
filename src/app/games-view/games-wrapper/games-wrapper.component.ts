import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-games-wrapper',
  templateUrl: './games-wrapper.component.html',
  styleUrls: ['./games-wrapper.component.scss']
})
export class GamesWrapperComponent extends UnsubscribeAbstract implements OnInit {
  loading = false;
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
  texts: string[] = ['Створюй. Шукай. Грай.', 'Щоб змогти 5 сесій на тиждень треба лише...<br>Записатися на гру',
    'Хочеш поганяти Страдів по Баровії?<br>Записуйся!', 'Вільні гравці в твоєму районі хочуть пограти з тобою', 'Привіт, хочеш розповімо тобі про АоСік?'];
  subtitle = this.texts[0];
  constructor (
    private gameHttpService: GameHttpService,
    private authHttpService: AuthHttpService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private metaHelper: MetaHelper,
    ) {
    super();
  }

  ngOnInit(): void {
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

  setUser() {
    this.authHttpService.user$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((user: IUser | undefined) => {
      this.user = user;
    });
  }

  private checkQuery() {
    this.sharedService.queryFiltersSet(this.route.snapshot.queryParams);
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
      return this.gameHttpService.fetchGames(filter, this.page, this.limit, this.gamesFor).pipe(takeUntil(this.ngUnsubscribe$), finalize(() => this.loading = false));
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
    return this.gameHttpService.fetchGames(this.filters, this.page, this.limit, this.gamesFor).pipe(takeUntil(this.ngUnsubscribe$), finalize(() => this.loading = false));
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
