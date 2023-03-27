import { Injectable } from '@angular/core';
import { IGamePost, IGameResponse } from '@shared/models/game.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IResponseMessage } from '@shared/models/response-message.interface';

@Injectable({
  providedIn: 'root'
})
export class GameHttpService {

  constructor(private http: HttpClient) { }
  fetchGames(): Observable<IGameResponse[]> {
    return this.http.get<IGameResponse[]>(`/game`);
  }
  createGame(game: IGamePost): Observable<IGamePost> {
    return this.http.post<IGamePost>(`/game`, game);
  }
  applyToGame(gameId: IGameResponse['_id']): Observable<IResponseMessage> {
    return this.http.get<IResponseMessage>(`/game/apply/${gameId}`);
  }
}
