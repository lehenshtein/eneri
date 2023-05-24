import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUser, IUserAsMaster } from '@shared/models/user.interface';
import { IResponseMessage } from '@shared/models/response-message.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserHttpService {

  constructor(private http: HttpClient) { }

  updateUser(data: FormData) {
    return this.http.patch<IResponseMessage>(`/user`, data);
  }

  fetchUserByUsername(username: string): Observable<IUserAsMaster> {
    return this.http.get<IUserAsMaster>(`/user/${username}`);
  }
}
