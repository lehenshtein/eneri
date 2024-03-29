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
  gameRequest = false;
  constructor (private route: ActivatedRoute,
              private gameHttpService: GameHttpService,
              private authHttpService: AuthHttpService,
              private metaHelper: MetaHelper,) {
    super();
    if (this.route.snapshot.data['page'] === 'game-request') {
      this.gameRequest = true;
    }
  }
  route$ = this.route.params.pipe(shareReplay(1), takeUntil(this.ngUnsubscribe$));
  user$: Observable<IUser | undefined> = this.authHttpService.user$.pipe(shareReplay());
  game$: Observable<IGameResponse | undefined> = this.route$.pipe(
    switchMap((params: Params) => { //take id from route
      if (!params['id']) {
        return EMPTY;
      }
      return this.user$.pipe(takeUntil(this.ngUnsubscribe$), switchMap((user: IUser | undefined) => { //take user
        if (user?.username && (params['creator'] === user?.username || params['master'] === user?.username)) { //check master from query for master or default request
          const request = this.gameRequest ?
            this.gameHttpService.fetchGameRequestById(params['id'], true) :
            this.gameHttpService.fetchGameById(params['id'], true);
          return request.pipe(takeUntil(this.ngUnsubscribe$),tap((res: IGameResponse) => {
        this.updateMeta(res);
      }));//:TODO change this 2 requests as 1 with ternar, remove unsubscribe
        }
        const request = this.gameRequest ?
          this.gameHttpService.fetchGameRequestById(params['id']) :
          this.gameHttpService.fetchGameById(params['id']);
        return request.pipe(takeUntil(this.ngUnsubscribe$),tap((res: IGameResponse) => {
        this.updateMeta(res);
      }));
      }))
    })
  );

  private updateMeta (item: IGameResponse) {
    const url = item.creator ? `${environment.url}/game-request/${item.creator.username}/${item._id}` :
      `${environment.url}/${item.master.username}/${item._id}`
    this.metaHelper.updateMeta({
      title: item.title,
      tags: item.tags,
      text: item.description,
      type: 'article',
      url: url,
      imgUrl: item.imgUrl || 'https://eneri.com.ua/assets/images/eneri-social.jpg',
      author: item.master? item.master.username : 'В пошуку майстра'
    });
  }

}
