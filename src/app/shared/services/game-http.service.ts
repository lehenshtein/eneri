import { Injectable } from '@angular/core';
import { IGamePost, IGameResponse } from '@shared/models/game.interface';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { IResponseMessage } from '@shared/models/response-message.interface';
import { IGameFilters } from '@shared/models/game-filters.interface';

@Injectable({
  providedIn: 'root'
})
export class GameHttpService {

  constructor(private http: HttpClient) { }
  fetchGames(filters: IGameFilters, page: number, limit: number, forWhom?: 'master' | 'player'): Observable<HttpResponse<IGameResponse[]>> {
    let params = new HttpParams()
      .set('page', page)
      .set('limit', limit);
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

    if (forWhom) {
      return this.http.get<IGameResponse[]>(`/game/${forWhom}`, { params, observe: 'response' });
    }

    return this.http.get<IGameResponse[]>(`/game`, { params, observe: 'response' });
  }
  fetchGameById(gameId: string, master = false): Observable<IGameResponse> {
    let params = new HttpParams();
    if (master) {
      params = params.append('master', true)
    }
    return this.http.get<IGameResponse>(`/game/${gameId}`, {params});
  }
  createGame(game: FormData): Observable<IGameResponse> {
    return this.http.post<IGameResponse>(`/game`, game);
  }
  updateGame(game: FormData, id: string): Observable<IGamePost> {
    return this.http.put<IGamePost>(`/game/${id}`, game);
  }
  applyToGame(gameId: IGameResponse['_id']): Observable<IResponseMessage> {
    return this.http.get<IResponseMessage>(`/game/apply/${gameId}`);
  }
  removePlayerFromGame(gameId: IGameResponse['_id'], username: string): Observable<IResponseMessage> {
    return this.http.patch<IResponseMessage>(`/game/${gameId}/${username}`, {});
  }
}
