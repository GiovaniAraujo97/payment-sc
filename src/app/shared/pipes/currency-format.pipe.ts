import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currency',
  standalone: true
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number, currencyCode: string = 'BRL'): string {
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currencyCode,
    });
    return formatter.format(value);
  }
}
