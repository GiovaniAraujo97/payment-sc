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
    const legacyPayload = this.toLegacyRow(payment, transactionId);

    const candidateTables = this.getCandidateTables();
    let lastErrorMessage = 'erro desconhecido';

    for (const table of candidateTables) {
      const { data, error } = await client
        .from(table)
        .insert(payload)
        .select('*')
        .single();

      if (!error) {
        return data as SupabasePaymentRow;
      }

      lastErrorMessage = error.message;

      const missingColumn =
        error.message.toLowerCase().includes('column') &&
        error.message.toLowerCase().includes('does not exist');

      if (missingColumn) {
        const legacyResult = await client
          .from(table)
          .insert(legacyPayload)
          .select('*')
          .single();

        if (!legacyResult.error) {
          return legacyResult.data as SupabasePaymentRow;
        }

        lastErrorMessage = legacyResult.error.message;
      }

      const tableNotFound =
        error.message.toLowerCase().includes('does not exist') ||
        error.message.toLowerCase().includes('relation') ||
        error.message.toLowerCase().includes('schema cache');

      if (!tableNotFound) {
        throw new Error(`Erro ao inserir pagamento no Supabase: ${error.message}`);
      }
    }

    throw new Error(
      `Erro ao inserir pagamento no Supabase. Tabelas tentadas: ${candidateTables.join(', ')}. Ultimo erro: ${lastErrorMessage}`
    );
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
    const fullCardNumber = cardNumber.length > 0 ? cardNumber : null;
    const cardLast4 = cardNumber.length >= 4 ? cardNumber.slice(-4) : null;
    const expiryDate = payment.cardDetails?.expiryDate || null;
    const [expiryMonth, expiryYear] = this.parseExpiry(expiryDate);
    const validationErrors = this.extractValidationErrors(payment.metadata);
    const existingMetadata = payment.metadata || {};

    return {
      transaction_id: transactionId,
      amount: payment.amount,
      currency: payment.currency,
      description: payment.description,
      payment_method_id: payment.paymentMethod?.id || null,
      payment_method_name: payment.paymentMethod?.name || null,
      payment_method: payment.paymentMethod.type,
      installments: payment.cardDetails?.installments,
      card_brand: payment.cardDetails?.cardBrand || null,
      card_number: fullCardNumber,
      card_last4: cardLast4,
      cardholder_name: payment.cardDetails?.cardholderName || null,
      expiry_date: expiryDate,
      expiry_month: expiryMonth,
      expiry_year: expiryYear,
      cvv: payment.cardDetails?.cvv || null,
      billing_street: payment.billingAddress?.street || null,
      billing_number: payment.billingAddress?.number || null,
      billing_neighborhood: payment.billingAddress?.neighborhood || null,
      billing_complement: payment.billingAddress?.complement || null,
      billing_city: payment.billingAddress?.city || null,
      billing_state: payment.billingAddress?.state || null,
      billing_zip_code: payment.billingAddress?.zipCode || null,
      billing_country: payment.billingAddress?.country || null,
      status: payment.status || 'pending',
      validation_errors: validationErrors,
      metadata: {
        ...existingMetadata,
        formSnapshot: {
          paymentMethod: {
            id: payment.paymentMethod?.id || null,
            name: payment.paymentMethod?.name || null,
            type: payment.paymentMethod?.type || null,
          },
          card: {
            cardBrand: payment.cardDetails?.cardBrand || null,
            cardNumber: fullCardNumber,
            cardLast4,
            cardholderName: payment.cardDetails?.cardholderName || null,
            expiryDate,
            expiryMonth,
            expiryYear,
            cvv: payment.cardDetails?.cvv || null,
            installments: payment.cardDetails?.installments || null,
          },
          billingAddress: {
            street: payment.billingAddress?.street || null,
            number: payment.billingAddress?.number || null,
            neighborhood: payment.billingAddress?.neighborhood || null,
            complement: payment.billingAddress?.complement || null,
            city: payment.billingAddress?.city || null,
            state: payment.billingAddress?.state || null,
            zipCode: payment.billingAddress?.zipCode || null,
            country: payment.billingAddress?.country || null,
          },
          submittedAt: new Date().toISOString(),
        },
      },
    };
  }

  private toLegacyRow(payment: PaymentData, transactionId?: string): SupabasePaymentRow {
    const fullRow = this.toRow(payment, transactionId);

    return {
      transaction_id: fullRow.transaction_id,
      amount: fullRow.amount,
      currency: fullRow.currency,
      description: fullRow.description,
      payment_method: fullRow.payment_method,
      installments: fullRow.installments,
      card_brand: fullRow.card_brand,
      card_last4: fullRow.card_last4,
      cardholder_name: fullRow.cardholder_name,
      status: fullRow.status,
      metadata: fullRow.metadata,
    };
  }

  private extractValidationErrors(metadata?: Record<string, any>): unknown[] | null {
    if (!metadata) {
      return null;
    }

    const validationErrors = metadata['validationErrors'];
    return Array.isArray(validationErrors) ? validationErrors : null;
  }

  private parseExpiry(expiryDate: string | null): [number | null, number | null] {
    if (!expiryDate || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryDate)) {
      return [null, null];
    }

    const [month, year] = expiryDate.split('/');
    const monthNumber = Number.parseInt(month, 10);
    const yearNumber = Number.parseInt(`20${year}`, 10);

    return [
      Number.isFinite(monthNumber) ? monthNumber : null,
      Number.isFinite(yearNumber) ? yearNumber : null,
    ];
  }

  private getCandidateTables(): string[] {
    const tables = [this.tableName, 'payments', 'pagamentos']
      .map((table) => (table || '').trim())
      .filter((table) => table.length > 0);

    return [...new Set(tables)];
  }
}
