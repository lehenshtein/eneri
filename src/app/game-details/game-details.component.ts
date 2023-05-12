import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { UnsubscribeAbstract } from '@shared/helpers/unsubscribe.abstract';
import { EMPTY, Observable, shareReplay, switchMap, takeUntil, tap } from 'rxjs';
import { IGameResponse } from '@shared/models/game.interface';
import { GameHttpService } from '@shared/services/game-http.service';
import { IUser } from '@shared/models/user.interface';
import { AuthHttpService } from '@shared/services/auth-http.service';
import { MetaHelper } from '@shared/helpers/meta.helper';
import { environment } from '@environment/environment';

@Component({
  selector: 'app-game-details.content',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.scss']
})
export class GameDetailsComponent extends UnsubscribeAbstract {
  constructor (private route: ActivatedRoute,
              private gameHttpService: GameHttpService,
              private authHttpService: AuthHttpService,
              private metaHelper: MetaHelper,) {
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
          return this.gameHttpService.fetchGameById(params['id'], true).pipe(takeUntil(this.ngUnsubscribe$),tap((res: IGameResponse) => {
        this.updateMeta(res);
      }));//:TODO change this 2 requests as 1 with ternar, remove unsubscribe
        }
        return this.gameHttpService.fetchGameById(params['id']).pipe(takeUntil(this.ngUnsubscribe$),tap((res: IGameResponse) => {
        this.updateMeta(res);
      }));
      }))
    })
  );

  private updateMeta (item: IGameResponse) {
    this.metaHelper.updateMeta({
      title: item.title,
      tags: item.tags,
      text: item.description,
      type: 'article',
      url: `${environment.url}/${item.master.username}/${item._id}`,
      imgUrl: item.imgUrl || 'https://eneri.com.ua/assets/images/eneri-social.jpg',
      author: item.master.username
    });
  }

}
