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
    if (filters.gameSystemId || filters.gameSystemId === 0) {
      params = params.append('gameSystemId', filters.gameSystemId)
    }
    if (filters.cityCode || filters.cityCode === 0) {
      params = params.append('cityCode', filters.cityCode)
    }
    if (filters.sort) {
      params = params.append('sort', filters.sort)
    }
    return this.http.get<IGameResponse[]>(`/game`, {params});
  }
  fetchGameById(gameId: string, master = false): Observable<IGameResponse> {
    let params = new HttpParams();
    if (master) {
      params = params.append('master', true)
    }
    return this.http.get<IGameResponse>(`/game/${gameId}`, {params});
  }
  createGame(game: IGamePost): Observable<IGameResponse> {
    return this.http.post<IGameResponse>(`/game`, game);
  }
  updateGame(game: IGamePost, id: string): Observable<IGamePost> {
    return this.http.put<IGamePost>(`/game/${id}`, game);
  }
  applyToGame(gameId: IGameResponse['_id']): Observable<IResponseMessage> {
    return this.http.get<IResponseMessage>(`/game/apply/${gameId}`);
  }
}
