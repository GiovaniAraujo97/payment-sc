/**
 * Payment Models and Interfaces
 */

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'credit_card' | 'debit_card' | 'bank_transfer' | 'wallet';
  icon?: string;
}

export interface CreditCard {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
  cardBrand?: 'visa' | 'mastercard' | 'amex' | 'elo';
  installments?: number;
}

export interface PaymentData {
  id?: string;
  amount: number;
  currency: string;
  description: string;
  paymentMethod: PaymentMethod;
  cardDetails?: CreditCard;
  billingAddress?: Address;
  metadata?: Record<string, any>;
  createdAt?: Date;
  status?: PaymentStatus;
}

export interface Address {
  street: string;
  number: string;
  complement?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  transactionId?: string;
  data?: PaymentData;
  errors?: PaymentError[];
}

export interface PaymentError {
  field: string;
  message: string;
  code?: string;
}

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface PaymentValidationResult {
  isValid: boolean;
  errors: PaymentError[];
}
