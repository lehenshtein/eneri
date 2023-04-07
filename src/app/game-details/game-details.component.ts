import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { UnsubscribeAbstract } from '@shared/helpers/unsubscribe.abstract';
import { EMPTY, Observable, shareReplay, switchMap, takeUntil, tap } from 'rxjs';
import { IGameResponse } from '@shared/models/game.interface';
import { GameHttpService } from '@shared/services/game-http.service';
import { IUser } from '../shared/models/user.interface';
import { AuthHttpService } from '../shared/services/auth-http.service';

@Component({
  selector: 'app-game-details.content',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.scss']
})
export class GameDetailsComponent extends UnsubscribeAbstract implements OnInit{
  constructor (private route: ActivatedRoute, private gameHttpService: GameHttpService, private authHttpService: AuthHttpService) {
    super();
  }
  route$ = this.route.params.pipe(shareReplay(1), takeUntil(this.ngUnsubscribe$));
  user$: Observable<IUser | undefined> = this.authHttpService.user$.pipe(shareReplay());
  game$: Observable<IGameResponse | undefined> = this.route$.pipe(
    switchMap((params: Params) => { //take id from route
      if (!params['id']) {
        return EMPTY;
      }
      return this.user$.pipe(takeUntil(this.ngUnsubscribe$), switchMap((user: IUser | undefined) => { //take user
        if (params['master'] === user?.username) { //check master from query for master or default request
          return this.gameHttpService.fetchGameById(params['id'], true).pipe(takeUntil(this.ngUnsubscribe$));
        }
        return this.gameHttpService.fetchGameById(params['id']).pipe(takeUntil(this.ngUnsubscribe$));
      }))
    })
  );

  ngOnInit (): void {
    // this.userData();
  }

  // userData() {
  //   this.authHttpService.user$.pipe(takeUntil(this.ngUnsubscribe$)).subscribe((user: IUser | undefined) => {
  //     console.log(user);
  //   })
  // }

}
