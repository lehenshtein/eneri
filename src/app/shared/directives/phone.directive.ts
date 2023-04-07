import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appPhone]'
})
export class PhoneDirective {
  regexStr = '[0-9]{3}-[0-9]{3}-[0-9]{4}';

  constructor(private el: ElementRef) { }
  @HostListener('input', ['$event']) onKeyDown(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;

    let trimmed = input.value.replace(/\D*/g, '');

    if (trimmed.length >= 10) {
      trimmed = trimmed.substring(0, 10);
    }

    trimmed = trimmed.replace(/-/g,'');

    let numbers = [];

    numbers.push(trimmed.substring(0,3));
    if(trimmed.substring(3,5)!=="")
      numbers.push(trimmed.substring(3,6));
    if(trimmed.substring(6,9)!="")
      numbers.push(trimmed.substring(6,10));


    input.value = numbers.join('-');
  }
}
