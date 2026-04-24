import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-payment-confirmation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="confirmation-container">
      <div class="confirmation-card">
        <div class="success-icon">✓</div>
        <h1 class="success-title">Pagamento Realizado com Sucesso!</h1>
        
        <div class="confirmation-details">
          <p class="transaction-id">
            <span class="label">ID da Transação:</span>
            <span class="value">{{ transactionId }}</span>
          </p>
          <p class="timestamp">
            <span class="label">Data e Hora:</span>
            <span class="value">{{ currentDateTime }}</span>
          </p>
        </div>

        <div class="confirmation-message">
          <p>Obrigado por sua compra! Você receberá um comprovante de pagamento no seu email em breve.</p>
        </div>

        <div class="action-buttons">
          <button class="btn btn-primary" (click)="goHome()">
            Ir para Home
          </button>
          <button class="btn btn-secondary" (click)="newPayment()">
            Realizar Outro Pagamento
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .confirmation-container {
      width: 100%;
      min-height: 100vh;
      height: auto;
      background: linear-gradient(140deg, #1db954 0%, #00a884 55%, #0f9d58 100%);
      padding: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      overflow-y: auto;
    }

    .confirmation-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      max-width: 500px;
      width: 100%;
      padding: 40px 30px;
      text-align: center;
    }

    .success-icon {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #00a86b 0%, #0f9d58 100%);
      border-radius: 50%;
      color: white;
      font-size: 48px;
      font-weight: bold;
      margin-bottom: 24px;
      animation: scaleIn 0.6s ease;
    }

    .success-title {
      margin: 0 0 24px 0;
      font-size: 24px;
      font-weight: 700;
      color: #333;
    }

    .confirmation-details {
      background: #f5f5f5;
      border-radius: 8px;
      padding: 20px;
      margin: 24px 0;
      text-align: left;

      p {
        margin: 12px 0;
        display: flex;
        justify-content: space-between;
        font-size: 13px;

        .label {
          font-weight: 600;
          color: #666;
        }

        .value {
          color: #333;
          word-break: break-all;
          text-align: right;
          flex: 1;
          margin-left: 16px;
        }
      }
    }

    .confirmation-message {
      margin: 24px 0;
      padding: 16px;
      background: #e8f5e9;
      border-radius: 8px;
      color: #2e7d32;
      font-size: 14px;
      line-height: 1.6;

      p {
        margin: 0;
      }
    }

    .action-buttons {
      display: flex;
      gap: 12px;
      margin-top: 30px;
      flex-wrap: wrap;
    }

    .btn {
      flex: 1;
      min-width: 140px;
      padding: 12px 20px;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      font-family: inherit;
    }

    .btn-primary {
      background: linear-gradient(135deg, #00a86b 0%, #0f9d58 100%);
      color: white;

      &:hover {
        box-shadow: 0 10px 25px rgba(0, 168, 107, 0.35);
        transform: translateY(-2px);
      }
    }

    .btn-secondary {
      background: #f0f0f0;
      color: #333;

      &:hover {
        background: #e0e0e0;
      }
    }

    @keyframes scaleIn {
      from {
        transform: scale(0);
        opacity: 0;
      }
      to {
        transform: scale(1);
        opacity: 1;
      }
    }

    @media (max-width: 600px) {
      .confirmation-card {
        padding: 30px 20px;
      }

      .action-buttons {
        flex-direction: column;
      }

      .btn {
        width: 100%;
      }
    }
  `]
})
export class PaymentConfirmationComponent implements OnInit {
  transactionId: string = '';
  currentDateTime: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.transactionId = params['transactionId'] || 'N/A';
    });

    this.currentDateTime = new Date().toLocaleString('pt-BR');
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  newPayment(): void {
    this.router.navigate(['/payment']);
  }
}
