import { Injectable } from '@angular/core';
import { IUser, IUserLogin, IUserRegister } from '@shared/models/user.interface';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, of, take, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { SharedService } from '@shared/services/shared.service';

@Injectable({
  providedIn: 'root'
})
export class AuthHttpService {
  jwtHelper = new JwtHelperService();
  private user?: IUser;
  private userSubject = new BehaviorSubject<IUser | undefined>(undefined);
  user$: Observable<IUser | undefined> = this.userSubject.asObservable();

  constructor(private sharedService: SharedService, private http: HttpClient) { }

  setToken (token: string | undefined) {
    if (!this.sharedService.isBrowser) {
      return;
    }
    if (token) {
      localStorage.setItem('auth-token', token);
    }
  }

  get token (): string | null {
    if (!this.sharedService.isBrowser) {
      return null;
    }
    return localStorage.getItem('auth-token');
  }

  set setUser (user: IUser | undefined) {
    this.userSubject.next(user);
    this.user = user;
  }

  get getUser (): IUser | undefined {
    return this.user;
  }

  isTokenExpired(): boolean {
    return this.jwtHelper.isTokenExpired(this.token);
  }


  fetchUser (): Observable<IUser | undefined> {
    if (this.token && !this.jwtHelper.isTokenExpired(this.token)) {
      return this.http.get<IUser>(`/user`);
    }
    return of(undefined);
  }

  register (data: IUserRegister): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`/auth/register`, data).pipe(
      tap(({token}) => {
        this.setAllUserData(token);
      })
    );
  }

  login (data: IUserLogin): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`/auth/login`, data).pipe(
      tap(({token}) => {
        this.setAllUserData(token);
      })
    );
  }

  setAllUserData (token: string | null) {
    if (token) {
      this.setToken(token);
    }
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      this.fetchUser().pipe(take(1)).subscribe((res: IUser | undefined) => {
        this.setUser = res;
      });
    }
  }

  logout () {
    if (!this.sharedService.isBrowser) {
      return;
    }
    localStorage.removeItem('auth-token');
    window.location.href = '/';
  }

  verify (code: string): Observable<null> {
    return this.http.get<null>(`/auth/verification/${code}`);
  }
  resendEmail (): Observable<IUser> {
    return this.http.get<IUser>(`/auth/verification/resend`);
  }
}
