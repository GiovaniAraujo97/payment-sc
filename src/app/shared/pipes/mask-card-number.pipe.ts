import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskCardNumber',
  standalone: true
})
export class MaskCardNumberPipe implements PipeTransform {
  transform(cardNumber: string): string {
    if (!cardNumber) return '';
    const sanitized = cardNumber.replace(/\s+/g, '');
    return sanitized.replace(/(\d{4})/g, '$1 ').trim().replace(/\s(?=\d{4}$)/, '');
  }
}
