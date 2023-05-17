import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthHttpService } from '@shared/services/auth-http.service';
import { NotificationService } from '@shared/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthHttpService, private router: Router, private notificationService: NotificationService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authService.getUser || this.authService.getUser.role !== 'superAdmin') {
      this.notificationService.openSnackBar('error', 'Використані невірні руни');
      this.router.navigateByUrl('/');
      return false;
    }
    return true;
  }
}
