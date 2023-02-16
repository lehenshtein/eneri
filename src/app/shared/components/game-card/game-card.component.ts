import { Component, Input } from '@angular/core';
import { IGameResponse, IGameSystem } from '@shared/models/game.interface';
import { cities } from '@shared/helpers/cities';
import { ICity } from '@shared/models/city.interface';
import { gameSystems } from '@app/shared/helpers/game-systems';

@Component({
  selector: 'app-game-card',
  templateUrl: './game-card.component.html',
  styleUrls: ['./game-card.component.scss']
})
export class GameCardComponent {
  @Input() game!: IGameResponse;
  cities: ICity[] = cities;
  gameSystems: IGameSystem[] = gameSystems;

  getCity(cityCode: number): ICity | undefined {
    return this.cities.find((city: ICity) => city.code === cityCode);
  }
  getSystem(id: number): IGameSystem | undefined {
    return this.gameSystems.find((system: IGameSystem) => system._id === id);
  }

}
