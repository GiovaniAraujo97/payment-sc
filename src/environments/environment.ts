/**
 * Environment Configuration
 * 
 * This file contains environment-specific configuration for the Payment SC application.
 * Use different values for development, staging, and production environments.
 */

export const environment = {
  production: false,
  
  // API Configuration
  api: {
    baseUrl: 'https://api.payment.local/v1',
    timeout: 30000, // 30 seconds
    
    // Endpoints
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
    // Ex: https://your-project-id.supabase.co
    url: '',
    // Ex: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
    anonKey: '',
    // Target table for payment records
    paymentsTable: 'payments',
  },

  // Payment Configuration
  payment: {
    // Accepted currencies
    currencies: ['BRL', 'USD', 'EUR'],
    
    // Default currency
    defaultCurrency: 'BRL',
    
    // Minimum payment amount
    minAmount: 0.01,
    
    // Maximum payment amount
    maxAmount: 999999.99,
    
    // API timeout for payment processing
    processingTimeout: 30000,
  },

  // Validation Configuration
  validation: {
    // Card number validation
    cardNumber: {
      minLength: 13,
      maxLength: 19,
    },
    
    // CVV validation
    cvv: {
      minLength: 3,
      maxLength: 4,
    },
    
    // Cardholder name
    cardholderName: {
      minLength: 3,
      maxLength: 100,
    },
  },

  // UI Configuration
  ui: {
    // Form configuration
    form: {
      // Auto-format input fields
      autoFormat: true,
      
      // Show success message duration (ms)
      successMessageDuration: 3000,
      
      // Show error message duration (ms)
      errorMessageDuration: 5000,
    },

    // Payment method icons (emoji)
    paymentMethodIcons: {
      credit_card: '💳',
      debit_card: '🏧',
      bank_transfer: '🏦',
      wallet: '📱',
    },
  },

  // Logging Configuration
  logging: {
    // Enable request/response logging
    enabled: true,
    
    // Log level: 'debug', 'info', 'warn', 'error'
    level: 'info',
  },

  // Feature Flags
  features: {
    // Enable payment processing
    paymentProcessing: true,
    
    // Enable billing address
    billingAddress: true,
    
    // Enable payment history
    paymentHistory: false,
    
    // Enable multiple payment methods
    multiplePaymentMethods: true,

    // Enable Supabase persistence for payments
    useSupabase: false,
  }
};

/**
 * Production Environment Configuration
 * 
 * Override values above for production environment
 */
export const productionEnvironment = {
  ...environment,
  production: true,
  
  api: {
    ...environment.api,
    baseUrl: 'https://api.payment.com/v1',
  },
  
  logging: {
    ...environment.logging,
    level: 'error',
  },
};

/**
 * Staging Environment Configuration
 * 
 * Override values above for staging environment
 */
export const stagingEnvironment = {
  ...environment,
  production: false,
  
  api: {
    ...environment.api,
    baseUrl: 'https://staging-api.payment.com/v1',
  },
  
  logging: {
    ...environment.logging,
    level: 'debug',
  },
};
