import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { delay, mergeMap, Observable, of, retryWhen } from 'rxjs';
// import { NotificationService } from '@shared/services/notification.service';

export const maxRetries = 1;
export const delayMs = 3000;

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  // get notificationService() {
  //   return this.injector.get(NotificationService);
  // }

  constructor(private injector: Injector) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      retryWhen((error) => {
        return error.pipe(
          mergeMap((error, index) => {
            if (index < maxRetries && error.status == 500) {
              // this.notificationService.openSnackBar('info', 'Trying again')
              return of(error).pipe(delay(delayMs));
            }

            if (error.status == 401) {
              // this.notificationService.openSnackBar('error', 'Помилка авторизації');
              throw error;
            }

            // this.notificationService.openSnackBar('error', error.error && error.error.message
            //   ? error.error.message
            //   : error.error?.err && error.error.err.details.length ? this.showAllErrors(error.error?.err.details)
            //   :'Something went wrong', error.status ? 'Error: ' + error.status : undefined);
            throw error;
          })
        )
      })
    )
  }

  showAllErrors(messages: { message: string }[]) {
    let allMessages = '';
    messages.forEach((msg) => {
      if (!allMessages) {
        allMessages += msg.message;
        return
      }
      allMessages += msg.message + '\n';
    })
    return allMessages;
  }
}
