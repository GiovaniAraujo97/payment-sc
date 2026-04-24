import { Routes } from '@angular/router';
import { PaymentFormComponent } from './components/payment-form';
import { PaymentConfirmationComponent } from './components/payment-confirmation';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'payment',
    pathMatch: 'full'
  },
  {
    path: 'payment',
    component: PaymentFormComponent,
    data: { title: 'Pagamento' }
  },
  {
    path: 'confirmation/:transactionId',
    component: PaymentConfirmationComponent,
    data: { title: 'Confirmação de Pagamento' }
  },
  {
    path: '**',
    redirectTo: 'payment'
  }
];
