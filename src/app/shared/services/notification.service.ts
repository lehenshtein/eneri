import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationServiceComponent } from '@shared/components/notification-service/notification-service.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) { }

  openSnackBar(type: 'success' | 'error' | 'info', message: string, title?: string, durationMS?: number) {
    this.snackBar.openFromComponent(NotificationServiceComponent, {
      duration: durationMS || 3000,
      horizontalPosition: 'right',
      panelClass: ['dark-snackbar', 'dark-snackbar--border'],
      data: {type, message, title}
    });
  }
}
