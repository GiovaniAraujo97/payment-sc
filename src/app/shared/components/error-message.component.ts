import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentError } from '../../models';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="errors && errors.length > 0" class="error-container">
      <div class="error-header">
        <span class="error-icon">⚠️</span>
        <span class="error-title">{{ title }}</span>
      </div>
      <ul class="error-list">
        <li *ngFor="let error of errors" class="error-item">
          {{ error.message }}
        </li>
      </ul>
    </div>
  `,
  styles: [`
    .error-container {
      background-color: #fee;
      border: 1px solid #fcc;
      border-radius: 4px;
      padding: 12px 16px;
      margin-bottom: 16px;
    }

    .error-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      font-weight: 600;
      color: #d32f2f;
    }

    .error-icon {
      font-size: 18px;
    }

    .error-title {
      font-size: 14px;
    }

    .error-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .error-item {
      font-size: 13px;
      color: #c62828;
      padding: 4px 0;
    }
  `]
})
export class ErrorMessageComponent {
  @Input() errors: PaymentError[] | null = null;
  @Input() title: string = 'Erros encontrados';
}
