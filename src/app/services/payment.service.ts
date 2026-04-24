import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, delay, tap } from 'rxjs';
import { PaymentData, PaymentError, PaymentResponse } from '../models';
import { environment } from '../../environments/environment';
import { SupabaseClientService } from './supabase-client.service';
import { SupabasePaymentsService } from './supabase-payments.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly apiUrl = `${environment.api.baseUrl}/payments`;

  constructor(
    private http: HttpClient,
    private supabaseClientService: SupabaseClientService,
    private supabasePaymentsService: SupabasePaymentsService
  ) {}

  /**
   * Process a payment
   */
  processPayment(paymentData: PaymentData): Observable<PaymentResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<PaymentResponse>(
      `${this.apiUrl}/process`,
      paymentData,
      { headers }
    ).pipe(
      tap((response) => {
        if (!response?.success) {
          return;
        }

        void this.persistPaymentToSupabaseIfEnabled(paymentData, response.transactionId);
      }),
      delay(1000) // Simulate network delay
    );
  }

  /**
   * Validate payment data
   */
  validatePayment(paymentData: PaymentData): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>(
      `${this.apiUrl}/validate`,
      paymentData
    );
  }

  /**
   * Get payment status
   */
  getPaymentStatus(transactionId: string): Observable<PaymentResponse> {
    return this.http.get<PaymentResponse>(
      `${this.apiUrl}/${transactionId}/status`
    );
  }

  /**
   * Get available payment methods
   */
  getPaymentMethods(): Observable<any> {
    return this.http.get(`${this.apiUrl}/methods`);
  }

  async persistValidationFailure(
    paymentData: PaymentData,
    errors: PaymentError[]
  ): Promise<void> {
    if (!environment.features.useSupabase) {
      return;
    }

    if (!this.supabaseClientService.isConfigured()) {
      console.warn('Supabase ativado por feature flag, mas sem configuracao de URL/anonKey.');
      return;
    }

    try {
      await this.supabasePaymentsService.createPaymentRecord(
        {
          ...paymentData,
          status: 'failed',
          metadata: {
            ...(paymentData.metadata || {}),
            source: 'frontend-validation',
            validationErrors: errors,
          },
        },
        undefined
      );
    } catch (error) {
      console.error('Falha ao persistir tentativa com erro de validacao no Supabase:', error);
    }
  }

  private async persistPaymentToSupabaseIfEnabled(
    paymentData: PaymentData,
    transactionId?: string
  ): Promise<void> {
    if (!environment.features.useSupabase) {
      return;
    }

    if (!this.supabaseClientService.isConfigured()) {
      console.warn('Supabase ativado por feature flag, mas sem configuracao de URL/anonKey.');
      return;
    }

    try {
      await this.supabasePaymentsService.createPaymentRecord(paymentData, transactionId);
    } catch (error) {
      console.error('Falha ao persistir pagamento no Supabase:', error);
    }
  }
}
