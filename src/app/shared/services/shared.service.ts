import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { IGameFilters } from '@shared/models/game-filters.interface';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private isBrowserVar = false;
  get isBrowser(): boolean {
    return this.isBrowserVar;
  }
  set setBrowser(isBrowser: boolean) {
    this.isBrowserVar = isBrowser;
  }

  private searchSubject = new BehaviorSubject<string>('');
  search$: Observable<string> = this.searchSubject.asObservable();
  searchSubjectSet(data: string) {
    this.searchSubject.next(data);
  }

  private tagSearchSubject = new BehaviorSubject<string | null>(null);
  tagSearch$: Observable<string | null> = this.tagSearchSubject.asObservable();
  tagSearchSubjectSet(data: string | null) {
    this.tagSearchSubject.next(data);
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

  private resetFilters = new BehaviorSubject<null>(null);
  resetFilters$: Observable<null> = this.resetFilters.asObservable();
  resetFiltersSubjectSet() {
    this.resetFilters.next(null);
    this.searchSubject.next('');
    this.showSuspendedSubject.next(false);
    this.filtersSubject.next({
      search: '',
      isShowSuspended: false,
      gameSystemId: undefined,
      cityCode: undefined,
      sort: 0
    })
  }

  private queryFiltersSubject = new Subject<Partial<IGameFilters>>();
  queryFilters$: Observable<Partial<IGameFilters>> = this.queryFiltersSubject.asObservable();
  queryFiltersSet(data: Partial<IGameFilters>) {
    this.queryFiltersSubject.next(data);
  }
}
