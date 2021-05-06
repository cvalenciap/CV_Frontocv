import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'CustomeCurrency'})
export class CustomCurrencyPipe implements PipeTransform {

  constructor() {
  }

  transform(val: number): string {
    if (val !== undefined && val !== null) {
      //return 'S/ ' + val.toLocaleString("latn", {minimumFractionDigits: 2});
      return 'S/ ' + val.toLocaleString(undefined, {minimumFractionDigits: 2});
    } else {
      return '';
    }
  }
}
