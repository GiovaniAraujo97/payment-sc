# Sistema de Pagamento - Payment SC

Um sistema completo de processamento de pagamentos construído com Angular 19, apresentando uma interface de checkout moderna, validação de dados robusto e arquitetura escalável.

## 📋 Índice

- [Características](#características)
- [Arquitetura do Projeto](#arquitetura-do-projeto)
- [Instalação](#instalação)
- [Uso](#uso)
- [Estrutura de Componentes](#estrutura-de-componentes)
- [Serviços](#serviços)
- [Modelos](#modelos)

## ✨ Características

- ✅ Tela de pagamento responsiva e moderna
- ✅ Múltiplos métodos de pagamento (Cartão de Crédito, Débito, Transferência Bancária, Carteira Digital)
- ✅ Validação completa de dados de pagamento com Luhn Algorithm
- ✅ Formatação automática de campos (cartão, validade, CEP)
- ✅ Endereço de cobrança
- ✅ Tratamento de erros robusto
- ✅ Tela de confirmação após pagamento
- ✅ Integração com API REST
- ✅ Interceptor HTTP para requisições
- ✅ Design responsivo (mobile-first)
- ✅ Animações suaves

## 🏗️ Arquitetura do Projeto

```
src/
├── app/
│   ├── components/           # Componentes da aplicação
│   │   ├── payment-form/     # Formulário principal de pagamento
│   │   └── payment-confirmation/  # Tela de confirmação
│   │
│   ├── services/             # Serviços de negócio
│   │   ├── payment.service.ts
│   │   └── payment-validation.service.ts
│   │
│   ├── models/               # Interfaces e tipos
│   │   └── payment.model.ts
│   │
│   ├── shared/               # Componentes e utilities compartilhados
│   │   ├── components/       # Componentes reutilizáveis
│   │   │   ├── error-message.component.ts
│   │   │   └── loading-spinner.component.ts
│   │   └── pipes/            # Custom pipes
│   │       ├── currency-format.pipe.ts
│   │       └── mask-card-number.pipe.ts
│   │
│   ├── core/                 # Funcionalidades centrais
│   │   └── interceptors/
│   │       └── api.interceptor.ts
│   │
│   ├── app.component.*
│   ├── app.config.ts         # Configuração da aplicação
│   └── app.routes.ts         # Rotas da aplicação
│
├── styles.scss               # Estilos globais
├── main.ts                   # Ponto de entrada
└── index.html
```

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- Angular CLI 19+

### Passos

```bash
# Clone o repositório
git clone <seu-repositorio>

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm start

# Acesse http://localhost:4200
```

## 🚀 Uso

### Iniciar Servidor de Desenvolvimento

```bash
npm start
```

A aplicação será acessível em `http://localhost:4200`

### Build para Produção

```bash
npm run build
```

### Executar Testes

```bash
npm test
```

### Watch Mode

```bash
npm run watch
```

## 📊 Estrutura de Componentes

### PaymentFormComponent
**Localização**: `src/app/components/payment-form/`

Componente principal que renderiza o formulário de pagamento.

**Funcionalidades**:
- Seleção de método de pagamento
- Preenchimento de dados do cartão
- Preenchimento do endereço de cobrança
- Validação em tempo real
- Processamento de pagamento

**Inputs**: Nenhum

**Outputs**: Navegação para confirmação após sucesso

### PaymentConfirmationComponent
**Localização**: `src/app/components/payment-confirmation/`

Componente exibido após o processamento bem-sucedido do pagamento.

**Funcionalidades**:
- Exibição do ID da transação
- Timestamp do pagamento
- Botões para ir à home ou fazer novo pagamento

## 🔧 Serviços

### PaymentService
**Responsabilidades**:
- Comunicação com API de pagamentos
- Processamento de pagamentos
- Validação de pagamentos
- Recuperação de status
- Listagem de métodos disponíveis

```typescript
// Exemplos de uso
paymentService.processPayment(paymentData);
paymentService.validatePayment(paymentData);
paymentService.getPaymentStatus(transactionId);
```

### PaymentValidationService
**Responsabilidades**:
- Validação completa de dados de pagamento
- Validação de números de cartão (Luhn Algorithm)
- Validação de data de validade
- Validação de CVV
- Validação de CEP brasileiro

```typescript
// Exemplo de uso
const result = validationService.validatePaymentData(payment);
if (!result.isValid) {
  console.log(result.errors); // Array de erros
}
```

## 📋 Modelos

### PaymentData
```typescript
interface PaymentData {
  id?: string;
  amount: number;           // Valor do pagamento
  currency: string;         // Moeda (BRL, USD, EUR)
  description: string;      // Descrição do pagamento
  paymentMethod: PaymentMethod;
  cardDetails?: CreditCard;
  billingAddress?: Address;
  metadata?: Record<string, any>;
  createdAt?: Date;
  status?: PaymentStatus;
}
```

### CreditCard
```typescript
interface CreditCard {
  cardNumber: string;       // Número do cartão
  cardholderName: string;   // Nome do titular
  expiryDate: string;       // Data de validade (MM/YY)
  cvv: string;              // Código de segurança
  cardBrand?: 'visa' | 'mastercard' | 'amex' | 'elo';
}
```

### Address
```typescript
interface Address {
  street: string;
  number: string;
  complement?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}
```

### PaymentMethod
```typescript
interface PaymentMethod {
  id: string;
  name: string;
  type: 'credit_card' | 'debit_card' | 'bank_transfer' | 'wallet';
  icon?: string;
}
```

## 🎨 Temas e Estilos

A aplicação utiliza um design moderno com:
- Gradiente roxo/violeta como cor principal
- Componentes com sombras suaves
- Animações fluidas
- Design responsivo que se adapta a todas as resoluções
- Acessibilidade (a11y) em mente

## 🔐 Segurança

- Validação de cartão com Luhn Algorithm
- Validação de data de expiração
- Validação de CVV
- Sanitização de entrada de dados
- Interceptor para adicionar tokens de autenticação
- HTTPS recomendado para produção

## 🌐 Rotas

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/` | PaymentFormComponent | Redireciona para /payment |
| `/payment` | PaymentFormComponent | Tela principal de pagamento |
| `/confirmation/:transactionId` | PaymentConfirmationComponent | Confirmação de pagamento |
| `**` | PaymentFormComponent | Qualquer outra rota redireciona |

## 📞 Suporte

Para suporte, entre em contato ou abra uma issue no repositório.

## 📄 Licença

Este projeto está sob a licença MIT.
