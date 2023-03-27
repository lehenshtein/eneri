import { Component } from '@angular/core';
import { GameHttpService } from '@shared/services/game-http.service';
import { Observable } from 'rxjs';
import { IGameResponse } from '@shared/models/game.interface';
import { IUser } from '../../shared/models/user.interface';
import { AuthHttpService } from '../../shared/services/auth-http.service';

@Component({
  selector: 'app-games-wrapper',
  templateUrl: './games-wrapper.component.html',
  styleUrls: ['./games-wrapper.component.scss']
})
export class GamesWrapperComponent {
  games$: Observable<IGameResponse[]> = this.gameHttpService.fetchGames();
  user$: Observable<IUser | undefined> = this.authHttpService.user$;
  constructor (private gameHttpService: GameHttpService, private authHttpService: AuthHttpService) {
  }

}
