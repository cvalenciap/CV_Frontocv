import {Pipe, PipeTransform} from '@angular/core';

@Pipe({ name: 'Volume' })
export class VolumePipe  implements PipeTransform{

  constructor() { }

  transform(val: number): string {
    if (val !== undefined && val !== null) {
      return val.toLocaleString(undefined, {minimumFractionDigits: 2}) + ' m3';
    } else {
      return '';
    }
  }
}
