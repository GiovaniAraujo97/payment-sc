/**
 * Utility Functions and Helpers
 */

/**
 * Format a number as currency
 */
export function formatCurrency(value: number, currencyCode: string = 'BRL'): string {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currencyCode,
  });
  return formatter.format(value);
}

/**
 * Format card number for display
 * Input: 4532015112830366
 * Output: 4532 0151 1283 0366
 */
export function formatCardNumber(cardNumber: string): string {
  if (!cardNumber) return '';
  const sanitized = cardNumber.replace(/\s+/g, '');
  return sanitized.replace(/(\d{4})/g, '$1 ').trim();
}

/**
 * Mask card number for security
 * Input: 4532015112830366
 * Output: •••• •••• •••• 0366
 */
export function maskCardNumber(cardNumber: string): string {
  if (!cardNumber) return '';
  const sanitized = cardNumber.replace(/\s+/g, '');
  const last4 = sanitized.slice(-4);
  return `•••• •••• •••• ${last4}`;
}

/**
 * Format expiry date
 * Input: 1225
 * Output: 12/25
 */
export function formatExpiryDate(expiryDate: string): string {
  if (!expiryDate) return '';
  const sanitized = expiryDate.replace(/\D/g, '');
  if (sanitized.length >= 2) {
    return sanitized.substring(0, 2) + '/' + sanitized.substring(2, 4);
  }
  return sanitized;
}

/**
 * Format CEP (Brazilian ZIP code)
 * Input: 12345678
 * Output: 12345-678
 */
export function formatCEP(cep: string): string {
  if (!cep) return '';
  const sanitized = cep.replace(/\D/g, '');
  if (sanitized.length >= 5) {
    return sanitized.substring(0, 5) + '-' + sanitized.substring(5, 8);
  }
  return sanitized;
}

/**
 * Detect card brand based on card number
 */
export function detectCardBrand(cardNumber: string): string {
  const sanitized = cardNumber.replace(/\s+/g, '');
  
  // Visa
  if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(sanitized)) return 'visa';
  
  // MasterCard
  if (/^5[1-5][0-9]{14}$/.test(sanitized)) return 'mastercard';
  
  // American Express
  if (/^3[47][0-9]{13}$/.test(sanitized)) return 'amex';
  
  // Elo
  if (/^(4011|431242|438935|451416|457393|504175|627780|636297|636369|650271|650300|650485|651652|655000|655021|655058|636773|506699|506778|509012|627612|627615|627884|628200|628202|628203|628204|628205|628206|628207|628208|628209|628210|628211|628212|628213|628214|628215|628216|628217|628218|628219|628220|628221|628222|628223|628224|628225|628226|628227|628228|628229|628230|628231|628232|628233|628234|628235|628236|628237|628238|628239|628240|628241|628242|628243|628244|628245|628246|628247|628248|628249|628250)[0-9]{12}/.test(sanitized)) return 'elo';
  
  return 'unknown';
}

/**
 * Generate a unique transaction ID
 */
export function generateTransactionId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 15);
  return `TXN-${timestamp}-${randomStr}`.toUpperCase();
}

/**
 * Delay execution (useful for testing)
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }

  if (obj instanceof Object) {
    const clonedObj: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }

  return obj;
}

/**
 * Get current date formatted as ISO string
 */
export function getCurrentDateISO(): string {
  return new Date().toISOString();
}

/**
 * Format date for display (pt-BR)
 */
export function formatDateBR(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Check if payment amount is valid
 */
export function isValidAmount(amount: number, min: number = 0.01, max: number = 999999.99): boolean {
  return amount >= min && amount <= max && amount === parseFloat(amount.toFixed(2));
}

/**
 * Save data to localStorage
 */
export function saveToLocalStorage(key: string, data: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage with key ${key}:`, error);
  }
}

/**
 * Get data from localStorage
 */
export function getFromLocalStorage(key: string): any {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error reading from localStorage with key ${key}:`, error);
    return null;
  }
}

/**
 * Remove data from localStorage
 */
export function removeFromLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage with key ${key}:`, error);
  }
}

/**
 * Clear all localStorage
 */
export function clearLocalStorage(): void {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}
