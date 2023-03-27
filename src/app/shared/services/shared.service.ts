import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private searchSubject = new BehaviorSubject<string>('');
  search$: Observable<string> = this.searchSubject.asObservable();
  searchSubjectSet(data: string) {
    this.searchSubject.next(data);
  }

  private showSuspendedSubject = new BehaviorSubject<boolean>(false);
  showSuspended$: Observable<boolean> = this.showSuspendedSubject.asObservable();
  showSuspendedSet(data: boolean) {
    this.showSuspendedSubject.next(data);
  }
}
