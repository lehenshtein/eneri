import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IGameFilters } from '@shared/models/game-filters.interface';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private searchSubject = new BehaviorSubject<string>('');
  search$: Observable<string> = this.searchSubject.asObservable();
  searchSubjectSet(data: string) {
    this.searchSubject.next(data);
  }

  private showSuspendedSubject = new Subject<boolean>();
  showSuspended$: Observable<boolean> = this.showSuspendedSubject.asObservable();
  showSuspendedSet(data: boolean) {
    this.showSuspendedSubject.next(data);
  }

  private filtersSubject = new Subject<Partial<IGameFilters>>();
  filters$: Observable<Partial<IGameFilters>> = this.filtersSubject.asObservable();
  filtersSet(data: Partial<IGameFilters>) {
    this.filtersSubject.next(data);
  }
}
