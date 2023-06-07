import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '@shared/models/user.interface';
import { HttpClient } from '@angular/common/http';
import { IStats } from '@app/admin-panel/stats.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  fetchStats(): Observable<IStats> {
    return this.http.get<IStats>(`/admin/stats`);
  }
  fetchUserForAdmin(usernameOrEmail: string): Observable<IUser> {
    return this.http.get<IUser>(`/admin/user/${usernameOrEmail}`);
  }
  changeGameRole(username: string): Observable<IUser['gameRole']> {
    return this.http.get<IUser['gameRole']>(`/admin/changeGameRole/${username}`);
  }
  changeEmailVerification(username: string): Observable<{ verified: boolean, verificationDate: Date }> {
    return this.http.get<{ verified: boolean, verificationDate: Date }>(`/admin/changeEmailVerification/${username}`);
  }
}
