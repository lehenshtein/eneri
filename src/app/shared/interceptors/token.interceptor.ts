import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { EMPTY, Observable } from 'rxjs';
import { environment } from '@environment/environment';
import { isPlatformBrowser } from '@angular/common';
import { AuthHttpService } from '@shared/services/auth-http.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor (private authService: AuthHttpService, @Inject(PLATFORM_ID) private platformId: Object) {
  }

  intercept (request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.authService.token;
    const isTokenExpired = this.authService.isTokenExpired();
    if (token && isTokenExpired){
      this.authService.logout();
    }

    if (token && !isTokenExpired) {
      request = request.clone({
        setHeaders: {
          authorization: token
        }
      });
    }

    const requestForStatic = !(request.url.slice(0, 8).indexOf('/assets/') === -1);
    const swRequest = !(request.url.indexOf('ngsw') === -1);

    if (!isPlatformBrowser(this.platformId) && swRequest) {
      return EMPTY; // disabling taking manifest on server
    }


    request = request.clone({
      url: request.url.indexOf('http://') === -1 && request.url.indexOf('https://') === -1 && !requestForStatic
        ? environment.apiUrl + request.url : request.url
    });
    // console.log(request.url);


    return next.handle(request);
  }
}
