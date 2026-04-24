import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CardBrandInfo, CardBrandService, CepService, PaymentService, PaymentValidationService } from '../../services';
import { PaymentData, PaymentMethod, PaymentError } from '../../models';
import { ErrorMessageComponent, LoadingSpinnerComponent } from '../../shared';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ErrorMessageComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './payment-form.component.html',
  styleUrl: './payment-form.component.scss'
})
export class PaymentFormComponent implements OnInit {
  paymentForm!: FormGroup;
  isLoading = false;
  validationErrors: PaymentError[] = [];
  successMessage = '';
  selectedPaymentMethod: PaymentMethod | null = null;
  isBrandLookupLoading = false;
  isCepLookupLoading = false;
  cardBrandInfo: CardBrandInfo = {
    brand: 'default',
    logoUrl: '',
    source: 'local'
  };
  private lastBinQueried = '';
  private lastCepQueried = '';

  paymentMethods: PaymentMethod[] = [
    {
      id: '1',
      name: 'Cartão de Crédito',
      type: 'credit_card',
      icon: '💳'
    },
    {
      id: '2',
      name: 'Cartão de Débito',
      type: 'debit_card',
      icon: '🏧'
    }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private paymentService: PaymentService,
    private validationService: PaymentValidationService,
    private cardBrandService: CardBrandService,
    private cepService: CepService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.paymentForm = this.formBuilder.group({
      amount: ['', Validators.required],
      currency: ['BRL', Validators.required],
      description: ['', [Validators.required, Validators.minLength(3)]],
      paymentMethodId: ['', Validators.required],
      
      // Card Details
      cardNumber: [''],
      cardholderName: [''],
      expiryDate: [''],
      cvv: [''],
      installments: ['1'],
      
      // Billing Address
      street: [''],
      number: [''],
      neighborhood: [''],
      complement: [''],
      city: [''],
      state: [''],
      zipCode: [''],
      country: ['Brasil']
    });
  }

  selectPaymentMethod(method: PaymentMethod): void {
    this.selectedPaymentMethod = method;
    this.paymentForm.patchValue({ paymentMethodId: method.id });
    this.updateCardValidators(method.type);
  }

  private updateCardValidators(methodType: string): void {
    const cardNumberControl = this.paymentForm.get('cardNumber');
    const cardholderControl = this.paymentForm.get('cardholderName');
    const expiryControl = this.paymentForm.get('expiryDate');
    const cvvControl = this.paymentForm.get('cvv');

    if (methodType === 'credit_card' || methodType === 'debit_card') {
      cardNumberControl?.setValidators([Validators.required]);
      cardholderControl?.setValidators([Validators.required]);
      expiryControl?.setValidators([Validators.required, this.expiryDateNotPastValidator()]);
      cvvControl?.setValidators([Validators.required, Validators.pattern(/^\d{3}$/)]);
    } else {
      cardNumberControl?.clearValidators();
      cardholderControl?.clearValidators();
      expiryControl?.clearValidators();
      cvvControl?.clearValidators();
    }

    cardNumberControl?.updateValueAndValidity();
    cardholderControl?.updateValueAndValidity();
    expiryControl?.updateValueAndValidity();
    cvvControl?.updateValueAndValidity();
  }

  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\D/g, '').slice(0, 19);
    let formatted = '';
    
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += value[i];
    }
    
    this.paymentForm.patchValue({ cardNumber: formatted }, { emitEvent: false });
    event.target.value = formatted;
    this.updateCardBrand(formatted);
  }

  get cardPreviewNumber(): string {
    const value = (this.paymentForm?.get('cardNumber')?.value || '').toString();
    return value || '0000 0000 0000 0000';
  }

  get cardPreviewHolder(): string {
    const value = (this.paymentForm?.get('cardholderName')?.value || '').toString().trim();
    return value || 'NOME DO TITULAR';
  }

  get cardPreviewExpiry(): string {
    const value = (this.paymentForm?.get('expiryDate')?.value || '').toString();
    return value || 'MM/AA';
  }

  get cardBrandLabel(): string {
    if (this.cardBrandInfo.brand === 'default') {
      return '';
    }

    if (this.cardBrandInfo.brand === 'amex') {
      return 'American Express';
    }

    return this.cardBrandInfo.brand.charAt(0).toUpperCase() + this.cardBrandInfo.brand.slice(1);
  }

  get cardVisualClass(): string {
    return `brand-${this.cardBrandInfo.brand}`;
  }

  get hasIdentifiedBrand(): boolean {
    return this.cardBrandInfo.brand !== 'default';
  }

  onBrandLogoError(): void {
    this.cardBrandInfo = {
      ...this.cardBrandInfo,
      logoUrl: ''
    };
  }

  private updateCardBrand(cardNumber: string): void {
    const sanitized = cardNumber.replace(/\s+/g, '');

    if (!sanitized) {
      this.cardBrandInfo = {
        brand: 'default',
        logoUrl: '',
        source: 'local'
      };
      this.lastBinQueried = '';
      this.isBrandLookupLoading = false;
      return;
    }

    this.cardBrandInfo = this.cardBrandService.detectLocally(sanitized);

    if (sanitized.length < 6) {
      this.lastBinQueried = '';
      this.isBrandLookupLoading = false;
      return;
    }

    const bin = sanitized.slice(0, 8);
    if (bin === this.lastBinQueried) {
      return;
    }

    this.lastBinQueried = bin;
    this.isBrandLookupLoading = true;

    this.cardBrandService.lookupBrand(bin).subscribe((apiInfo) => {
      this.isBrandLookupLoading = false;
      if (apiInfo) {
        this.cardBrandInfo = apiInfo;
      }
    });
  }

  formatCurrencyInput(event: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');

    if (value.length === 0) {
      value = '0';
    }

    value = value.padStart(3, '0');

    const decimalPart = value.slice(-2);
    let integerPart = value.slice(0, -2);
    integerPart = integerPart.replace(/^0+/, '') || '0';

    const formatted = `${integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${decimalPart}`;

    input.value = formatted;
    this.paymentForm.patchValue({ amount: formatted }, { emitEvent: false });
  }

  formatCVV(event: any): void {
    const input = event.target as HTMLInputElement;
    const formatted = input.value.replace(/\D/g, '').slice(0, 3);
    input.value = formatted;
    this.paymentForm.patchValue({ cvv: formatted }, { emitEvent: false });
  }

  private parseCurrencyValue(value: string | number): number {
    if (typeof value === 'number') {
      return value;
    }

    const sanitized = (value || '').replace(/\./g, '').replace(',', '.').trim();
    const parsed = Number.parseFloat(sanitized);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  getInstallmentOptions(): Array<{ value: number; label: string }> {
    const amountControlValue = this.paymentForm?.get('amount')?.value ?? 0;
    const amount = this.parseCurrencyValue(amountControlValue);
    const formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    return Array.from({ length: 8 }, (_, index) => {
      const installment = index + 1;
      const installmentValue = installment > 0 ? amount / installment : 0;
      const installmentLabel = formatter.format(installmentValue);

      return {
        value: installment,
        label:
          installment === 1
            ? `1x de ${installmentLabel} (a vista)`
            : `${installment}x de ${installmentLabel} sem juros`
      };
    });
  }

  formatExpiryDate(event: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').slice(0, 4);

    if (value.length >= 2) {
      let month = Number.parseInt(value.slice(0, 2), 10);
      if (!Number.isFinite(month) || month <= 0) {
        month = 1;
      }
      if (month > 12) {
        month = 12;
      }
      const monthStr = month.toString().padStart(2, '0');
      value = `${monthStr}${value.slice(2)}`;
    }

    const formatted = value.length >= 3 ? `${value.slice(0, 2)}/${value.slice(2)}` : value;
    this.paymentForm.patchValue({ expiryDate: formatted }, { emitEvent: false });
    input.value = formatted;
  }

  private expiryDateNotPastValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = (control.value || '').toString();
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
        return { invalidExpiryFormat: true };
      }

      const [monthStr, yearStr] = value.split('/');
      const month = Number.parseInt(monthStr, 10);
      const year = 2000 + Number.parseInt(yearStr, 10);

      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      if (year < currentYear) {
        return { invalidExpiryPast: true };
      }

      if (year === currentYear && month < currentMonth) {
        return { invalidExpiryPast: true };
      }

      return null;
    };
  }

  formatZipCode(event: any): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').slice(0, 8);

    if (value.length >= 5) {
      value = `${value.substring(0, 5)}-${value.substring(5, 8)}`;
    }

    this.paymentForm.patchValue({ zipCode: value }, { emitEvent: false });
    input.value = value;

    const cepOnlyDigits = value.replace(/\D/g, '');
    if (cepOnlyDigits.length === 8 && cepOnlyDigits !== this.lastCepQueried) {
      this.lastCepQueried = cepOnlyDigits;
      this.lookupAddressByCep(cepOnlyDigits);
    }

    if (cepOnlyDigits.length < 8) {
      this.lastCepQueried = '';
      this.isCepLookupLoading = false;
    }
  }

  private lookupAddressByCep(cep: string): void {
    this.isCepLookupLoading = true;

    this.cepService.lookup(cep).subscribe((result) => {
      this.isCepLookupLoading = false;

      if (!result) {
        return;
      }

      const currentNeighborhood = (this.paymentForm.get('neighborhood')?.value || '').toString().trim();

      this.paymentForm.patchValue({
        street: result.street,
        city: result.city,
        state: result.state,
        neighborhood: currentNeighborhood || result.neighborhood
      });
    });
  }

  onSubmit(): void {
    if (!this.paymentForm.valid) {
      this.validationErrors = [];
      this.markFormGroupTouched(this.paymentForm);
      return;
    }

    const formValue = this.paymentForm.value;
    const paymentData: PaymentData = {
      amount: this.parseCurrencyValue(formValue.amount),
      currency: formValue.currency,
      description: formValue.description,
      paymentMethod: this.selectedPaymentMethod!,
      cardDetails: {
        cardNumber: formValue.cardNumber,
        cardholderName: formValue.cardholderName,
        expiryDate: formValue.expiryDate,
        cvv: formValue.cvv,
        cardBrand: this.hasIdentifiedBrand ? this.cardBrandInfo.brand as 'visa' | 'mastercard' | 'amex' | 'elo' : undefined,
        installments: Math.min(parseInt(formValue.installments, 10) || 1, 8)
      },
      billingAddress: {
        street: formValue.street,
        number: formValue.number,
        neighborhood: formValue.neighborhood,
        complement: formValue.complement,
        city: formValue.city,
        state: formValue.state,
        zipCode: formValue.zipCode,
        country: formValue.country
      }
    };

    // Validate payment data
    const validationResult = this.validationService.validatePaymentData(paymentData);
    if (!validationResult.isValid) {
      this.validationErrors = validationResult.errors;
      void this.paymentService.persistValidationFailure(paymentData, validationResult.errors);
      return;
    }

    this.validationErrors = [];
    this.successMessage = '';
    this.isLoading = true;

    // Process payment
    this.paymentService.processPayment(paymentData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.successMessage = `Pagamento realizado com sucesso! ID: ${response.transactionId}`;
          setTimeout(() => {
            this.router.navigate(['/confirmation', { transactionId: response.transactionId }]);
          }, 2000);
        } else {
          this.validationErrors = response.errors || [];
        }
      },
      error: (error) => {
        this.isLoading = false;
        void this.paymentService.persistValidationFailure(paymentData, [
          {
            field: 'payment',
            message: 'Erro ao processar pagamento. Tente novamente.',
            code: 'PAYMENT_ERROR'
          }
        ]);
        this.validationErrors = [
          {
            field: 'payment',
            message: 'Erro ao processar pagamento. Tente novamente.',
            code: 'PAYMENT_ERROR'
          }
        ];
        console.error('Payment error:', error);
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  resetForm(): void {
    this.paymentForm.reset();
    this.selectedPaymentMethod = null;
    this.validationErrors = [];
    this.successMessage = '';
  }
}
