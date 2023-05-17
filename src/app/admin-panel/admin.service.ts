import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser, IUserAsMaster } from '@shared/models/user.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  fetchUserForAdmin(usernameOrEmail: string): Observable<IUser> {
    return this.http.get<IUser>(`/user/admin/user/${usernameOrEmail}`);
  }
  changeGameRole(username: string): Observable<IUser['gameRole']> {
    return this.http.get<IUser['gameRole']>(`/user/admin/changeGameRole/${username}`);
  }
}
