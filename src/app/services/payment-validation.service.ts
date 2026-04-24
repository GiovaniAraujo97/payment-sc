import { Injectable } from '@angular/core';
import { PaymentData, PaymentError, PaymentValidationResult } from '../models';

@Injectable({
  providedIn: 'root'
})
export class PaymentValidationService {

  /**
   * Validate entire payment data
   */
  validatePaymentData(payment: PaymentData): PaymentValidationResult {
    const errors: PaymentError[] = [];

    // Validate amount
    if (!payment.amount || payment.amount <= 0) {
      errors.push({
        field: 'amount',
        message: 'O valor do pagamento deve ser maior que zero',
        code: 'INVALID_AMOUNT'
      });
    }

    // Validate currency
    if (!payment.currency) {
      errors.push({
        field: 'currency',
        message: 'Moeda é obrigatória',
        code: 'MISSING_CURRENCY'
      });
    }

    // Validate description
    if (!payment.description || payment.description.trim().length === 0) {
      errors.push({
        field: 'description',
        message: 'Descrição é obrigatória',
        code: 'MISSING_DESCRIPTION'
      });
    }

    // Validate payment method
    if (!payment.paymentMethod) {
      errors.push({
        field: 'paymentMethod',
        message: 'Método de pagamento é obrigatório',
        code: 'MISSING_METHOD'
      });
    }

    // Validate card details if payment method is credit card
    if (payment.paymentMethod?.type === 'credit_card' && payment.cardDetails) {
      const cardErrors = this.validateCreditCard(payment.cardDetails);
      errors.push(...cardErrors);
    }

    // Validate billing address if provided
    if (payment.billingAddress) {
      const addressErrors = this.validateAddress(payment.billingAddress);
      errors.push(...addressErrors);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate credit card details
   */
  validateCreditCard(card: any): PaymentError[] {
    const errors: PaymentError[] = [];

    // Validate card number
    if (!card.cardNumber || !this.isValidCardNumber(card.cardNumber)) {
      errors.push({
        field: 'cardNumber',
        message: 'Número do cartão inválido',
        code: 'INVALID_CARD_NUMBER'
      });
    }

    // Validate cardholder name
    if (!card.cardholderName || card.cardholderName.trim().length < 3) {
      errors.push({
        field: 'cardholderName',
        message: 'Nome do titular deve ter pelo menos 3 caracteres',
        code: 'INVALID_NAME'
      });
    }

    // Validate expiry date
    if (!card.expiryDate || !this.isValidExpiryDate(card.expiryDate)) {
      errors.push({
        field: 'expiryDate',
        message: 'Data de validade inválida',
        code: 'INVALID_EXPIRY'
      });
    }

    // Validate CVV
    if (!card.cvv || !this.isValidCVV(card.cvv)) {
      errors.push({
        field: 'cvv',
        message: 'CVV inválido',
        code: 'INVALID_CVV'
      });
    }

    return errors;
  }

  /**
   * Validate address
   */
  validateAddress(address: any): PaymentError[] {
    const errors: PaymentError[] = [];

    if (!address.street || address.street.trim().length === 0) {
      errors.push({
        field: 'street',
        message: 'Rua é obrigatória',
        code: 'MISSING_STREET'
      });
    }

    if (!address.city || address.city.trim().length === 0) {
      errors.push({
        field: 'city',
        message: 'Cidade é obrigatória',
        code: 'MISSING_CITY'
      });
    }

    if (!address.state || address.state.trim().length === 0) {
      errors.push({
        field: 'state',
        message: 'Estado é obrigatório',
        code: 'MISSING_STATE'
      });
    }

    if (!address.zipCode || !this.isValidZipCode(address.zipCode)) {
      errors.push({
        field: 'zipCode',
        message: 'CEP inválido',
        code: 'INVALID_ZIPCODE'
      });
    }

    return errors;
  }

  /**
   * Validate card number using Luhn algorithm
   */
  private isValidCardNumber(cardNumber: string): boolean {
    const sanitized = cardNumber.replace(/\s+/g, '');
    if (!/^\d{13,19}$/.test(sanitized)) {
      return false;
    }

    let sum = 0;
    let isEven = false;

    for (let i = sanitized.length - 1; i >= 0; i--) {
      let digit = parseInt(sanitized[i], 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  /**
   * Validate expiry date (MM/YY format)
   */
  private isValidExpiryDate(expiryDate: string): boolean {
    const regex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    if (!regex.test(expiryDate)) {
      return false;
    }

    const [month, year] = expiryDate.split('/');
    const monthNum = parseInt(month, 10);
    const yearNum = 2000 + parseInt(year, 10);
    const today = new Date();

    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;

    if (yearNum < currentYear) {
      return false;
    }

    if (yearNum === currentYear && monthNum < currentMonth) {
      return false;
    }

    const expireDate = new Date(yearNum, monthNum, 1);

    return expireDate > today;
  }

  /**
   * Validate CVV (3 digits)
   */
  private isValidCVV(cvv: string): boolean {
    return /^\d{3}$/.test(cvv.replace(/\s+/g, ''));
  }

  /**
   * Validate zip code (Brazilian format)
   */
  private isValidZipCode(zipCode: string): boolean {
    return /^\d{5}-?\d{3}$/.test(zipCode);
  }
}
