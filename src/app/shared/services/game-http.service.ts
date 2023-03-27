import { Injectable } from '@angular/core';
import { IGamePost, IGameResponse } from '@shared/models/game.interface';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IResponseMessage } from '@shared/models/response-message.interface';
import { IGameFilters } from '@shared/models/game-filters.interface';

@Injectable({
  providedIn: 'root'
})
export class GameHttpService {

  constructor(private http: HttpClient) { }
  fetchGames(filters: IGameFilters): Observable<IGameResponse[]> {
    let params = new HttpParams();
    if(filters.search) {
      params = params.append('search', filters.search)
    }
    if(filters.isShowSuspended) {
      params = params.append('isShowSuspended', filters.isShowSuspended)
    }
    return this.http.get<IGameResponse[]>(`/game`, {params});
  }
  createGame(game: IGamePost): Observable<IGamePost> {
    return this.http.post<IGamePost>(`/game`, game);
  }
  applyToGame(gameId: IGameResponse['_id']): Observable<IResponseMessage> {
    return this.http.get<IResponseMessage>(`/game/apply/${gameId}`);
  }
}
