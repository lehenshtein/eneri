import { Injectable } from '@angular/core';
import { UserInterface, UserLoginInterface, UserRegisterInterface } from '@shared/models/user.interface';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, of, take, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthHttpService {
  jwtHelper = new JwtHelperService();
  private user?: UserInterface;
  private userSubject = new BehaviorSubject<UserInterface | undefined>(undefined);
  user$: Observable<UserInterface | undefined> = this.userSubject.asObservable();

  constructor(private http: HttpClient) { }

  setToken (token: string | undefined) {
    if (token) {
      localStorage.setItem('auth-token', token);
    }
  }

  get token (): string | null {
    return localStorage.getItem('auth-token');
  }

  set setUser (user: UserInterface | undefined) {
    this.user = user;
  }

  get getUSer (): UserInterface | undefined {
    return this.user;
  }

  isTokenExpired(): boolean {
    return  this.jwtHelper.isTokenExpired(this.token);
  }


  getUser (): Observable<UserInterface | undefined> {
    if (this.token && !this.jwtHelper.isTokenExpired(this.token)) {
      return this.http.get<UserInterface>(`/user`);
    }
    return of(undefined);
  }

  register (data: UserRegisterInterface): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`/auth/register`, data).pipe(
      tap(({token}) => {
        this.setAllUserData(token);
      })
    );
  }

  login (data: UserLoginInterface): Observable<{ token: string }> {
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
      this.getUser().pipe(take(1)).subscribe((res: UserInterface | undefined) => {
        console.log(res);
        this.setUser = res;
        this.userSubject.next(res);
      });
    }
  }

  logout () {
    localStorage.removeItem('auth-token');
    window.location.reload();
  }
}
