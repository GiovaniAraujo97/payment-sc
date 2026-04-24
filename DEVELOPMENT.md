# 📖 Guia de Desenvolvimento - Payment SC

## 🚀 Início Rápido

### 1. Configuração do Ambiente

```bash
# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm start

# A aplicação será acessível em http://localhost:4200
```

### 2. Estrutura de Pastas e Organização

```
src/app/
├── components/          # Componentes da UI
├── services/            # Lógica de negócio
├── models/              # Tipos e interfaces
├── shared/              # Componentes reutilizáveis
├── core/                # Funcionalidades centrais
├── utils/               # Funções auxiliares e constantes
└── environments/        # Configurações de ambiente
```

## 📝 Desenvolvimento

### Adicionar um Novo Componente

```bash
# O Angular CLI criará os arquivos necessários
ng generate component components/my-component
```

### Adicionar um Novo Serviço

```bash
ng generate service services/my-service
```

### Adicionar um Novo Pipe

```bash
ng generate pipe shared/pipes/my-pipe
```

## 🧪 Testando a Aplicação

### Dados de Teste

Para facilitar o teste, use os dados abaixo:

#### Cartão Visa Válido
```
Número: 4532 0151 1283 0366
Titular: John Doe
Validade: 12/25
CVV: 123
```

#### Cartão MasterCard Válido
```
Número: 5425 2334 3010 9903
Titular: Jane Smith
Validade: 06/26
CVV: 456
```

#### Cartão American Express Válido
```
Número: 3782 822463 10005
Titular: Bob Johnson
Validade: 09/27
CVV: 1234
```

#### Endereço de Teste
```
Rua: Avenida Paulista
Número: 1000
Complemento: Apto 2001
Cidade: São Paulo
Estado: SP
CEP: 01311-100
País: Brasil
```

### Cenários de Teste

1. **Pagamento com Cartão de Crédito**
   - Preenchimento correto dos dados
   - Validação de campos obrigatórios
   - Formatação automática

2. **Validação de Dados**
   - Número de cartão inválido
   - Data de validade expirada
   - CVV inválido
   - CEP mal formatado

3. **Múltiplos Métodos de Pagamento**
   - Trocar entre diferentes métodos
   - Validação específica de cada método

4. **Responsividade**
   - Testar em diferentes resoluções
   - Verificar mobile, tablet e desktop

## 🔧 Configuração de API

### Configurar Endpoint da API

Edite `src/environments/environment.ts`:

```typescript
export const environment = {
  api: {
    baseUrl: 'https://seu-api.com/v1',
    // ... outras configurações
  }
};
```

### Mock de API (para desenvolvimento local)

A aplicação pode ser facilmente adaptada para usar mock data:

```typescript
// No payment.service.ts, comentar a chamada HTTP real
// e retornar dados mockados

processPayment(paymentData: PaymentData): Observable<PaymentResponse> {
  // Mock response
  return of({
    success: true,
    message: 'Pagamento processado com sucesso',
    transactionId: 'TXN-' + Date.now(),
    data: paymentData
  }).pipe(delay(1000));
}
```

## 📚 Estrutura de Dados

### Fluxo de Pagamento

```
1. Usuário preenche formulário
   ↓
2. Validação local dos dados
   ↓
3. Se válido → Enviar para API
   ↓
4. Processamento na API
   ↓
5. Retorno do resultado
   ↓
6. Exibir confirmação ou erro
```

### Validações Implementadas

- ✅ Validação de número de cartão (Luhn Algorithm)
- ✅ Validação de data de expiração
- ✅ Validação de CVV
- ✅ Validação de CEP brasileiro
- ✅ Validação de campos obrigatórios
- ✅ Formatação automática

## 🎨 Customização de Estilos

### Temas

Os principais estilos estão em:
- `src/styles.scss` - Estilos globais
- `src/app/components/payment-form/payment-form.component.scss` - Estilos específicos

### Cores Principais

```scss
$primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
$error-color: #d32f2f;
$success-color: #2e7d32;
$border-color: #ddd;
```

## 📦 Dependências Principais

- **Angular 19**: Framework
- **RxJS**: Programação reativa
- **TypeScript**: Tipagem

## 🐛 Debugging

### Ativar Logs

Em `src/app/core/interceptors/api.interceptor.ts`, os logs estão ativados por padrão em desenvolvimento.

### DevTools do Angular

1. Instale Angular DevTools (extensão do Chrome)
2. Abra DevTools (F12)
3. Acesse a aba "Angular"

### Console

```typescript
// Ver estado do formulário
console.log(this.paymentForm.value);

// Ver erros de validação
console.log(this.paymentForm.errors);
```

## 📈 Performance

### Build de Produção

```bash
npm run build

# O build será em dist/payment-sc/
```

### Analisar tamanho do bundle

```bash
npm run build -- --stats-json
# Depois acesse: https://webpack.github.io/analyse/
```

## 🔐 Segurança

### Boas Práticas Implementadas

1. **Validação de entrada**: Todos os dados são validados
2. **Sanitização**: Dados são sanitizados antes do envio
3. **Interpolação segura**: Angular template syntax previne XSS
4. **HTTPS**: Use em produção (nunca HTTP)
5. **Tokens**: Implementar autenticação no interceptor

## 📝 Convenções de Código

### Nomes de Arquivos

- Componentes: `component-name.component.ts`
- Serviços: `service-name.service.ts`
- Pipes: `pipe-name.pipe.ts`
- Interfaces: `interface-name.model.ts`

### Estrutura de Componente

```typescript
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-component-name',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './component-name.component.html',
  styleUrl: './component-name.component.scss'
})
export class ComponentNameComponent implements OnInit {
  // Propriedades
  // Lifecycle
  // Métodos públicos
  // Métodos privados
}
```

## 🚀 Deploy

### Preparar para Produção

1. Otimizar bundle
2. Configurar variáveis de ambiente
3. Ativar minificação
4. Desativar source maps

### Deploy no GitHub Pages

```bash
npm install -g angular-cli-ghpages

ng build --configuration production --base-href /payment-sc/
ngh --dir=dist/payment-sc/
```

## 📞 Recursos Úteis

- [Angular Docs](https://angular.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [RxJS Docs](https://rxjs.dev)
- [Material Design](https://material.io/design)

## ✅ Checklist de Desenvolvimento

- [ ] Componentes criados e funcionando
- [ ] Validações implementadas
- [ ] Serviços conectados à API
- [ ] Testes unitários passando
- [ ] Responsividade verificada
- [ ] Acessibilidade testada
- [ ] Performance otimizada
- [ ] Documentação atualizada
- [ ] Code review realizado
- [ ] Ready para deploy

## 💡 Dicas Úteis

1. Use `ng serve --open` para abrir o navegador automaticamente
2. Use `ng serve --port 4300` para mudar a porta
3. Use strict mode para melhor type checking: `ng serve --configuration development`
4. Implemente lazy loading para rotas em aplicações maiores
5. Use trackBy em *ngFor para melhor performance

---

**Última atualização**: 2026-04-24
