import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { PaymentData, PaymentStatus } from '../models';
import { SupabasePaymentRow } from '../models/supabase.model';
import { SupabaseClientService } from './supabase-client.service';

@Injectable({
  providedIn: 'root'
})
export class SupabasePaymentsService {
  private readonly tableName = environment.supabase?.paymentsTable || 'payments';

  constructor(private supabaseClientService: SupabaseClientService) {}

  async createPaymentRecord(payment: PaymentData, transactionId?: string): Promise<SupabasePaymentRow> {
    const client = this.supabaseClientService.getClient();
    const payload = this.toRow(payment, transactionId);

    const { data, error } = await client
      .from(this.tableName)
      .insert(payload)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Erro ao inserir pagamento no Supabase: ${error.message}`);
    }

    return data as SupabasePaymentRow;
  }

  async updatePaymentStatus(transactionId: string, status: PaymentStatus): Promise<void> {
    const client = this.supabaseClientService.getClient();

    const { error } = await client
      .from(this.tableName)
      .update({ status, updated_at: new Date().toISOString() })
      .eq('transaction_id', transactionId);

    if (error) {
      throw new Error(`Erro ao atualizar status no Supabase: ${error.message}`);
    }
  }

  async getPaymentByTransactionId(transactionId: string): Promise<SupabasePaymentRow | null> {
    const client = this.supabaseClientService.getClient();

    const { data, error } = await client
      .from(this.tableName)
      .select('*')
      .eq('transaction_id', transactionId)
      .maybeSingle();

    if (error) {
      throw new Error(`Erro ao buscar pagamento no Supabase: ${error.message}`);
    }

    return data as SupabasePaymentRow | null;
  }

  private toRow(payment: PaymentData, transactionId?: string): SupabasePaymentRow {
    const cardNumber = payment.cardDetails?.cardNumber?.replace(/\s+/g, '') || '';
    const cardLast4 = cardNumber.length >= 4 ? cardNumber.slice(-4) : null;

    // Nunca persista CVV ou PAN completo.
    return {
      transaction_id: transactionId,
      amount: payment.amount,
      currency: payment.currency,
      description: payment.description,
      payment_method: payment.paymentMethod.type,
      installments: payment.cardDetails?.installments,
      card_brand: payment.cardDetails?.cardBrand || null,
      card_last4: cardLast4,
      cardholder_name: payment.cardDetails?.cardholderName || null,
      status: payment.status || 'pending',
      metadata: payment.metadata || null,
    };
  }
}
