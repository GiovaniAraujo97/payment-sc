export interface SupabasePaymentRow {
  id?: string;
  transaction_id?: string;
  amount: number;
  currency: string;
  description: string;
  payment_method: string;
  installments?: number;
  card_brand?: string | null;
  card_last4?: string | null;
  cardholder_name?: string | null;
  status: string;
  metadata?: Record<string, unknown> | null;
  created_at?: string;
  updated_at?: string;
}
