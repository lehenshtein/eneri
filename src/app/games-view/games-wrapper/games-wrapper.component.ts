import { Component } from '@angular/core';
import { GameHttpService } from '@shared/services/game-http.service';
import { Observable } from 'rxjs';
import { IGameResponse } from '@shared/models/game.interface';

@Component({
  selector: 'app-games-wrapper',
  templateUrl: './games-wrapper.component.html',
  styleUrls: ['./games-wrapper.component.scss']
})
export class GamesWrapperComponent {
  games$: Observable<IGameResponse[]> = this.gameHttpService.fetchGames();
  constructor (private gameHttpService: GameHttpService) {
  }

}
