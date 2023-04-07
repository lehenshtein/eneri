import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";

@Pipe({
  name: 'safePipe'
})
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(data: string | any, type: 'url' | 'html'): unknown {
    if (!data) {
      return
    }

    return type === 'url' ? this.sanitizer.bypassSecurityTrustResourceUrl(data) : this.sanitizer.bypassSecurityTrustHtml(data);
  }

}
