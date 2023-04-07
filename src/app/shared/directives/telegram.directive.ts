import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appTelegram]'
})
export class TelegramDirective {
  regexStr = '^[a-zA-Z0-9_]*$';
  specialKeys: Array<string> = [ 'Backspace', 'Tab', 'End', 'Home' ];

  constructor(private el: ElementRef) { }
  @HostListener("keydown", ["$event"]) onKeydown(event: KeyboardEvent) {
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    let current: string = this.el.nativeElement.value;
    let next: string = current.concat(event.key);
    if (next && !String(next).match(this.regexStr)) {
      event.preventDefault();
    }
  }
}
