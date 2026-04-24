/**
 * Production Environment Configuration
 */

export const environment = {
  production: true,
  
  api: {
    baseUrl: 'https://api.payment.com/v1',
    timeout: 30000,
    
    endpoints: {
      payment: {
        process: '/payments/process',
        validate: '/payments/validate',
        status: '/payments/:id/status',
        methods: '/payments/methods',
      }
    }
  },

  // Supabase Configuration
  supabase: {
    url: 'https://afjsivrkogdzrvbynyta.supabase.co',
    anonKey: 'sb_publishable_24amyuSCOz74c-1Vjg-L-A_GzRXk4pj',
    paymentsTable: 'pagamentos',
  },

  payment: {
    currencies: ['BRL', 'USD', 'EUR'],
    defaultCurrency: 'BRL',
    minAmount: 0.01,
    maxAmount: 999999.99,
    processingTimeout: 30000,
  },

  validation: {
    cardNumber: {
      minLength: 13,
      maxLength: 19,
    },
    cvv: {
      minLength: 3,
      maxLength: 4,
    },
    cardholderName: {
      minLength: 3,
      maxLength: 100,
    },
  },

  ui: {
    form: {
      autoFormat: true,
      successMessageDuration: 3000,
      errorMessageDuration: 5000,
    },
    paymentMethodIcons: {
      credit_card: '💳',
      debit_card: '🏧',
      bank_transfer: '🏦',
      wallet: '📱',
    },
  },

  logging: {
    enabled: false,
    level: 'error',
  },

  features: {
    paymentProcessing: true,
    billingAddress: true,
    paymentHistory: true,
    multiplePaymentMethods: true,
    useSupabase: true,
  }
};
