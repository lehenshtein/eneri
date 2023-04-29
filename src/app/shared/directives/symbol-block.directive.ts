import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';
import { telegramPattern } from '@shared/helpers/regex-patterns';

@Directive({
  selector: '[appSymbolBlock]'
})
export class SymbolBlockDirective {
  regexStr = telegramPattern;
  specialKeys: Array<string> = [ 'Backspace', 'Tab', 'End', 'Home', 'Control' ];

  constructor(private el: ElementRef, private control: NgControl) { }
  @Input() appSymbolBlock: 'telegram' = 'telegram';
  @HostListener('keydown', ['$event']) onKeydown(event: KeyboardEvent) {
    if (this.appSymbolBlock === 'telegram') {
      this.regexStr = telegramPattern;
    }
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    let current: string = this.el.nativeElement.value;
    let next: string = current.concat(event.key);
    if (next && !String(next).match(this.regexStr)) {
      event.preventDefault();
    }
  }
  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
    let replacePattern = /[^a-zA-Z0-9_]/g;
    if (this.appSymbolBlock === 'telegram') {
      replacePattern = /[^a-zA-Z0-9_]/g;
    }
    event.preventDefault();
    let paste = event.clipboardData?.getData('text');
    let trimmed = paste?.replace(replacePattern, '');
    this.control.control?.setValue(this.control.value + trimmed);
  }
}
