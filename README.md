# Payment SC

Checkout web app em Angular com:

- pagamento por cartao (credito/debito)
- validacoes de formulario
- deteccao de bandeira de cartao
- busca de endereco por CEP (ViaCEP)
- persistencia no Supabase (incluindo tentativas com erro)

## Stack

- Angular 19 (standalone)
- RxJS + Reactive Forms
- Supabase JS (`@supabase/supabase-js`)

## Como rodar localmente

1. Instale dependencias:

```bash
npm install
```

2. Rode o projeto:

```bash
npm start
```

3. Abra:

```text
http://localhost:4200
```

## Supabase (obrigatorio para ver os dados no banco)

Mesmo com o frontend funcionando, as colunas completas so aparecem no banco depois da migration SQL.

1. Abra o SQL Editor no Supabase.
2. Execute o script:

- [supabase/sql/001_init_payments.sql](supabase/sql/001_init_payments.sql)

3. Confirme que a tabela usada pelo ambiente existe.

Observacao:

- O ambiente atual esta configurado para `pagamentos`.
- O servico possui fallback para `payments` quando necessario.

## Configuracao de ambiente

Confira:

- [src/environments/environment.ts](src/environments/environment.ts)
- [src/environments/environment.prod.ts](src/environments/environment.prod.ts)

Campos principais:

- `supabase.url`
- `supabase.anonKey`
- `supabase.paymentsTable`
- `features.useSupabase`

## O que e salvo no Supabase

No envio (inclusive em falha de validacao/processamento), o app persiste dados legiveis do formulario, por exemplo:

- valor, moeda, descricao
- metodo de pagamento (id, nome, tipo)
- cartao (bandeira, numero, ultimos 4, titular, validade, cvv, parcelas)
- endereco de cobranca completo
- status da tentativa (`pending`, `failed`, etc.)
- `validation_errors` e `metadata.formSnapshot`

## Fluxos de validacao

- Se o formulario estiver invalido: nao envia processamento.
- Se houver erro de validacao de negocio (ex.: numero de cartao invalido): exibe erro e persiste tentativa com `status = failed`.
- Se houver erro na chamada de processamento: exibe erro e persiste tentativa com `status = failed`.

## Scripts uteis

- `npm start`: sobe app em desenvolvimento
- `npm test`: testes unitarios
- `npm run build`: build de producao

## Estrutura principal

- [src/app/components/payment-form/payment-form.component.ts](src/app/components/payment-form/payment-form.component.ts)
- [src/app/services/payment.service.ts](src/app/services/payment.service.ts)
- [src/app/services/supabase-payments.service.ts](src/app/services/supabase-payments.service.ts)
- [src/app/services/card-brand.service.ts](src/app/services/card-brand.service.ts)
- [src/app/services/cep.service.ts](src/app/services/cep.service.ts)

## Seguranca

Este projeto foi ajustado para persistir dados sensiveis de cartao por requisito funcional.
Em ambiente real, evite armazenar PAN completo e CVV em texto aberto.
