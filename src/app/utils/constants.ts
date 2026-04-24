/**
 * Application Constants
 * 
 * This file contains all constant values used throughout the application.
 */

// Payment Methods
export const PAYMENT_METHODS = {
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  BANK_TRANSFER: 'bank_transfer',
  WALLET: 'wallet',
} as const;

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const;

// Error Codes
export const ERROR_CODES = {
  // Amount Errors
  INVALID_AMOUNT: 'INVALID_AMOUNT',
  MISSING_AMOUNT: 'MISSING_AMOUNT',
  
  // Currency Errors
  MISSING_CURRENCY: 'MISSING_CURRENCY',
  INVALID_CURRENCY: 'INVALID_CURRENCY',
  
  // Description Errors
  MISSING_DESCRIPTION: 'MISSING_DESCRIPTION',
  
  // Payment Method Errors
  MISSING_METHOD: 'MISSING_METHOD',
  INVALID_METHOD: 'INVALID_METHOD',
  
  // Card Errors
  INVALID_CARD_NUMBER: 'INVALID_CARD_NUMBER',
  INVALID_EXPIRY: 'INVALID_EXPIRY',
  INVALID_CVV: 'INVALID_CVV',
  INVALID_NAME: 'INVALID_NAME',
  
  // Address Errors
  MISSING_STREET: 'MISSING_STREET',
  MISSING_CITY: 'MISSING_CITY',
  MISSING_STATE: 'MISSING_STATE',
  INVALID_ZIPCODE: 'INVALID_ZIPCODE',
  
  // General Errors
  PAYMENT_ERROR: 'PAYMENT_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
} as const;

// Currencies
export const CURRENCIES = {
  BRL: 'BRL',
  USD: 'USD',
  EUR: 'EUR',
} as const;

// Card Brands
export const CARD_BRANDS = {
  VISA: 'visa',
  MASTERCARD: 'mastercard',
  AMEX: 'amex',
  ELO: 'elo',
} as const;

// Regex Patterns
export const PATTERNS = {
  CARD_NUMBER: /^\d{13,19}$/,
  CVV: /^\d{3,4}$/,
  ZIPCODE: /^\d{5}-?\d{3}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\d\s\-+()]*$/,
} as const;

// API Configuration
export const API_CONFIG = {
  DEFAULT_TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

// Local Storage Keys
export const LOCAL_STORAGE_KEYS = {
  PAYMENT_DRAFT: 'payment_draft',
  USER_PREFERENCES: 'user_preferences',
  PAYMENT_HISTORY: 'payment_history',
} as const;

// Session Storage Keys
export const SESSION_STORAGE_KEYS = {
  TRANSACTION_ID: 'transaction_id',
  PAYMENT_STEP: 'payment_step',
} as const;
