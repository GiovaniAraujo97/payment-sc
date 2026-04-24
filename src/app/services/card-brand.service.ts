import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';

export interface CardBrandInfo {
  brand: string;
  logoUrl: string;
  source: 'api' | 'local';
}

interface BinLookupResponse {
  scheme?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CardBrandService {
  private readonly binLookupUrl = 'https://lookup.binlist.net';
  private readonly eloPrefixes = [
    '4011', '431274', '438935', '451416', '457393', '504175', '627780',
    '636297', '636368', '650', '6516', '6550'
  ];
  private readonly hipercardPrefixes = ['606282', '637095', '637568', '637599', '637609', '637612'];

  private readonly logos: Record<string, string> = {
    visa: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/visa.svg',
    mastercard: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/mastercard.svg',
    amex: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/americanexpress.svg',
    elo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Elo_card_logo.png',
    hipercard: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Hipercard_logo.svg',
    default: ''
  };

  constructor(private http: HttpClient) {}

  lookupBrand(bin: string): Observable<CardBrandInfo | null> {
    if (!/^\d{6,8}$/.test(bin)) {
      return of(null);
    }

    const headers = new HttpHeaders({
      Accept: 'application/json'
    });

    return this.http.get<BinLookupResponse>(`${this.binLookupUrl}/${bin}`, { headers }).pipe(
      timeout(2000),
      map((response) => {
        const normalized = this.normalizeBrand(response?.scheme || '');
        if (!normalized) {
          return null;
        }

        return {
          brand: normalized,
          logoUrl: this.getLogoUrl(normalized),
          source: 'api'
        } as CardBrandInfo;
      }),
      catchError(() => of(null))
    );
  }

  detectLocally(cardNumber: string): CardBrandInfo {
    const sanitized = cardNumber.replace(/\s+/g, '');
    const brand = this.detectByPrefix(sanitized);

    return {
      brand,
      logoUrl: this.getLogoUrl(brand),
      source: 'local'
    };
  }

  getLogoUrl(brand: string): string {
    return this.logos[brand] || this.logos['default'];
  }

  private normalizeBrand(raw: string): string | null {
    const value = raw.toLowerCase().trim();

    if (value.includes('visa')) return 'visa';
    if (value.includes('master')) return 'mastercard';
    if (value.includes('amex') || value.includes('american express')) return 'amex';
    if (value.includes('elo')) return 'elo';
    if (value.includes('hipercard')) return 'hipercard';

    return null;
  }

  private detectByPrefix(cardNumber: string): string {
    if (!cardNumber) return 'default';

    if (this.matchesAnyPrefix(cardNumber, this.hipercardPrefixes)) return 'hipercard';
    if (this.matchesAnyPrefix(cardNumber, this.eloPrefixes)) return 'elo';
    if (/^3[47]/.test(cardNumber)) return 'amex';
    if (/^5[1-5]/.test(cardNumber)) return 'mastercard';
    if (/^2(2[2-9]|[3-6]|7[01]|720)/.test(cardNumber)) return 'mastercard';
    if (/^4/.test(cardNumber)) return 'visa';

    return 'default';
  }

  private matchesAnyPrefix(cardNumber: string, prefixes: string[]): boolean {
    if (cardNumber.length < 4) {
      return false;
    }

    return prefixes.some((prefix) => {
      const lengthToCompare = Math.min(cardNumber.length, prefix.length);
      return cardNumber.slice(0, lengthToCompare) === prefix.slice(0, lengthToCompare);
    });
  }
}
