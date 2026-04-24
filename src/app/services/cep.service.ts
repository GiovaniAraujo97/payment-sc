import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';

export interface CepLookupResult {
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface ViaCepResponse {
  cep?: string;
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CepService {
  constructor(private http: HttpClient) {}

  lookup(cep: string): Observable<CepLookupResult | null> {
    const normalizedCep = cep.replace(/\D/g, '');

    if (!/^\d{8}$/.test(normalizedCep)) {
      return of(null);
    }

    return this.http.get<ViaCepResponse>(`https://viacep.com.br/ws/${normalizedCep}/json/`).pipe(
      timeout(2500),
      map((response) => {
        if (!response || response.erro) {
          return null;
        }

        return {
          cep: response.cep || normalizedCep,
          street: response.logradouro || '',
          neighborhood: response.bairro || '',
          city: response.localidade || '',
          state: (response.uf || '').toUpperCase(),
        };
      }),
      catchError(() => of(null))
    );
  }
}
