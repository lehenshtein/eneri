import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appTelegram]'
})
export class TelegramDirective {
  regexStr = '^[a-zA-Z0-9_]*$';
  specialKeys: Array<string> = [ 'Backspace', 'Tab', 'End', 'Home', 'Control' ];

  constructor(private el: ElementRef, private control: NgControl) { }
  @HostListener('keydown', ['$event']) onKeydown(event: KeyboardEvent) {
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
    event.preventDefault();
    let paste = event.clipboardData?.getData('text');
    let trimmed = paste?.replace(/[^a-zA-Z0-9_]/g, '');
    this.control.control?.setValue(trimmed);
  }
}
