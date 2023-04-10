import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedService } from '@shared/services/shared.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  @Input() disabled = false;
  @Output() closeMenu: EventEmitter<any> = new EventEmitter<any>();
  @Output() searchText: EventEmitter<string> = new EventEmitter<string>();
  text = '';

  constructor (public sharedService: SharedService) {
  }

  search (searchInput: HTMLInputElement) {
    this.searchText.emit(searchInput.value);
    this.closeMenu.emit();
  }
  resetSearch(searchInput: HTMLInputElement) {
    this.searchText.emit('');
    searchInput.value = '';
  }


}
