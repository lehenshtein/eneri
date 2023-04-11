import { Component, OnInit, SecurityContext } from '@angular/core';
import { GameHttpService } from '@shared/services/game-http.service';
import { Observable, shareReplay, switchMap, takeUntil, tap } from 'rxjs';
import { IGameResponse } from '@shared/models/game.interface';
import { IUser } from '@shared/models/user.interface';
import { AuthHttpService } from '@shared/services/auth-http.service';
import { SharedService } from '@shared/services/shared.service';
import { UnsubscribeAbstract } from '@shared/helpers/unsubscribe.abstract';
import { IGameFilters } from '@shared/models/game-filters.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-games-wrapper',
  templateUrl: './games-wrapper.component.html',
  styleUrls: ['./games-wrapper.component.scss']
})
export class GamesWrapperComponent extends UnsubscribeAbstract implements OnInit {
  games: IGameResponse[] = [];
  user: IUser | undefined;
  gamesFor: 'player' | 'master' | undefined;
  filters: IGameFilters = {
    search: '',
    isShowSuspended: false,
    gameSystemId: null,
    cityCode: null,
    sort: 0
  }
  texts: string[] = ['Створюй. Шукай. Грай.', 'Щоб змогти 5 сесій на тиждень треба лише...<br>Записатися на гру',
    'Хочеш поганяти Страдів по Баровії?<br>Записуйся!', 'Гарячий ДМ покаже тобі своє підземелля'];
  subtitle = this.texts[0];
  constructor (
    private gameHttpService: GameHttpService,
    private authHttpService: AuthHttpService,
    private sharedService: SharedService,
    private route: ActivatedRoute,
    ) {
    super();
  }

  ngOnInit(): void {
    this.setUser();
    this.route.snapshot.routeConfig?.path === 'my-games' ? this.gamesFor = 'player' :
      this.route.snapshot.routeConfig?.path === 'my-created' ? this.gamesFor = 'master' :
        this.gamesFor = undefined;
    this.setSubtitle();
    this.searchChanges();
    this.filterChanges();
    this.suspendedChanges();
  }

  setUser() {
    this.authHttpService.user$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((user: IUser | undefined) => {
      this.user = user;
    });
  }

  searchChanges() {
    this.sharedService.search$.pipe(takeUntil(this.ngUnsubscribe$), switchMap((search: string) => {
      this.filters.search = search;
      const filter: IGameFilters = {
        search: search,
        isShowSuspended: this.filters.isShowSuspended,
        gameSystemId: null,
        cityCode: null,
        sort: 0
      }
      return this.gameHttpService.fetchGames(filter, this.gamesFor);
    })).pipe(takeUntil(this.ngUnsubscribe$)).subscribe((games: IGameResponse[]) => {
      this.games = games;
    })
  }
  filterChanges() {
    this.sharedService.filters$.pipe(takeUntil(this.ngUnsubscribe$), switchMap((filter: Partial<IGameFilters>) => {
      this.filters.gameSystemId = filter.gameSystemId;
      this.filters.cityCode = filter.cityCode;
      this.filters.search = filter.search || '';
      this.filters.sort = filter.sort || 0;
      return this.gameHttpService.fetchGames(this.filters, this.gamesFor);
    })).pipe(takeUntil(this.ngUnsubscribe$)).subscribe((games: IGameResponse[]) => {
      this.games = games;
    })
  }
  suspendedChanges() {
    this.sharedService.showSuspended$.pipe(takeUntil(this.ngUnsubscribe$), switchMap((isShowSuspended: boolean) => {
      this.filters.isShowSuspended = isShowSuspended;
      return this.gameHttpService.fetchGames(this.filters, this.gamesFor);
    })).pipe(takeUntil(this.ngUnsubscribe$)).subscribe((games: IGameResponse[]) => {
      this.games = games;
    })
  }

  getRandomNumb(num: number) {
    return Math.floor(Math.random() * num);
  }
  setSubtitle() {
    const randomNum = this.getRandomNumb(this.texts.length);
    this.subtitle = this.texts[randomNum];
  }
}
