import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  @Output() closeMenu: EventEmitter<any> = new EventEmitter<any>();
  @Output() searchText: EventEmitter<string> = new EventEmitter<string>();
  constructor(
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
  }
  search (searchInput: HTMLInputElement) {
    this.sharedService.searchSubjectSet(searchInput.value);
    this.closeMenu.emit();
  }
  resetSearch(searchInput: HTMLInputElement) {
    this.sharedService.searchSubjectSet('');
    searchInput.value = '';
  }

}
