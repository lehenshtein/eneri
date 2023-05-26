import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileToImg'
})
export class FileToImgPipe implements PipeTransform {
  constructor() {}
  transform(file: File): unknown {
    return URL.createObjectURL(file);
  }

}
