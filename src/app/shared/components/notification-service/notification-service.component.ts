import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-notification-service',
  templateUrl: './notification-service.component.html',
  styleUrls: ['./notification-service.component.scss']
})
export class NotificationServiceComponent {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {
  }

}
