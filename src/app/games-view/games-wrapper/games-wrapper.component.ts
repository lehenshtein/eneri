import { Component, OnInit } from '@angular/core';
import { GameHttpService } from '@shared/services/game-http.service';
import { Observable, switchMap, takeUntil } from 'rxjs';
import { IGameResponse } from '@shared/models/game.interface';
import { IUser } from '../../shared/models/user.interface';
import { AuthHttpService } from '../../shared/services/auth-http.service';
import { SharedService } from '@shared/services/shared.service';
import { UnsubscribeAbstract } from '@shared/helpers/unsubscribe.abstract';
import { IGameFilters } from '@shared/models/game-filters.interface';

@Component({
  selector: 'app-games-wrapper',
  templateUrl: './games-wrapper.component.html',
  styleUrls: ['./games-wrapper.component.scss']
})
export class GamesWrapperComponent extends UnsubscribeAbstract implements OnInit {
  games: IGameResponse[] = [];
  user$: Observable<IUser | undefined> = this.authHttpService.user$;
  filters: IGameFilters = {
    search: '',
    isShowSuspended: false
  }
  constructor (private gameHttpService: GameHttpService, private authHttpService: AuthHttpService, private sharedService: SharedService) {
    super();
  }

  ngOnInit(): void {
    this.searchChanges();
    this.suspendedChanges();
  }

  searchChanges() {
    this.sharedService.search$.pipe(takeUntil(this.ngUnsubscribe$), switchMap((search: string) => {
      this.filters.search = search;
      return this.gameHttpService.fetchGames(this.filters);
    })).pipe(takeUntil(this.ngUnsubscribe$)).subscribe((games: IGameResponse[]) => {
      this.games = games;
    })
  }
  suspendedChanges() {
    this.sharedService.showSuspended$.pipe(takeUntil(this.ngUnsubscribe$), switchMap((isShowSuspended: boolean) => {
      this.filters.isShowSuspended = isShowSuspended;
      return this.gameHttpService.fetchGames(this.filters);
    })).pipe(takeUntil(this.ngUnsubscribe$)).subscribe((games: IGameResponse[]) => {
      this.games = games;
    })
  }
}
