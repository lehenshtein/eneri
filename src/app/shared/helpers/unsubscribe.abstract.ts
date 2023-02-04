import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Component({template: 'abstract'})
export abstract class UnsubscribeAbstract implements OnDestroy {
  ngUnsubscribe$: Subject<void> = new Subject<void>();

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
