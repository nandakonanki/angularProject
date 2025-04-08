import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { PayeeService } from '../../services/payee.service';
import { TransferService } from '../../services/transfer.service';
import { Observable } from 'rxjs';
import { HeaderComponent } from '../header/header.component';
import { AlertComponent } from '../shared/alert/alert.component';
import { ConfirmationModalComponent } from '../shared/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-transfers',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    HeaderComponent,
    AlertComponent,
    ConfirmationModalComponent
  ],
  templateUrl: './transfers.component.html',
  styleUrls: ['./transfers.component.scss']
})
export class TransfersComponent implements OnInit {
  showAddPayeeForm = false;
  payeeForm!: FormGroup;
  transferForm!: FormGroup;
  accounts$: Observable<any>;
  payees$: Observable<any>;
  transfers$: Observable<any>;
  isTransferInProgress = false;

  // Alert properties
  showAlert = false;
  alertMessage = '';
  alertType: 'success' | 'error' | 'warning' = 'success';

  // Confirmation modal properties
  showConfirmModal = false;
  confirmModalTitle = '';
  confirmModalMessage = '';
  confirmModalAction: () => void = () => {};

  constructor(
    private accountService: AccountService,
    private payeeService: PayeeService,
    private transferService: TransferService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.initializeForms();
    this.accounts$ = this.accountService.getAccounts();
    this.payees$ = this.payeeService.getPayees();
    this.transfers$ = this.transferService.getTransfers();
  }

  ngOnInit(): void {
    this.transferForm.valueChanges.subscribe(value => {
      this.isTransferInProgress = Object.values(value).some(val => val !== '' && val !== null && val !== undefined);
    });
  }

  private initializeForms(): void {
    this.payeeForm = this.fb.group({
      name: ['', Validators.required],
      bankName: ['', Validators.required],
      accountType: ['checking', Validators.required],
      accountNumber: ['', [Validators.required, Validators.pattern('^[0-9]{8,17}$')]],
      routingNumber: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      email: ['', [Validators.email]],
      phone: ['', [Validators.pattern('^[0-9-+()]*$')]]
    });

    this.transferForm = this.fb.group({
      fromAccountId: ['', Validators.required],
      toPayeeId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', Validators.required]
    });
  }

  showNotification(message: string, type: 'success' | 'error' | 'warning'): void {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
    }, 5000);
  }

  onAddPayee(): void {
    if (this.payeeForm.valid) {
      this.payeeService.addPayee(this.payeeForm.value).subscribe({
        next: () => {
          this.showAddPayeeForm = false;
          this.payeeForm.reset({ accountType: 'checking' });
          this.showNotification('Payee added successfully!', 'success');
        },
        error: (error) => {
          console.error('Error adding payee:', error);
          this.showNotification('Failed to add payee. Please try again.', 'error');
        }
      });
    }
  }

  onCreateTransfer(): void {
    if (this.transferForm.valid) {
      this.showConfirmModal = true;
      this.confirmModalTitle = 'Confirm Transfer';
      this.confirmModalMessage = 'Are you sure you want to proceed with this transfer?';
      this.confirmModalAction = () => {
        this.transferService.createTransfer(this.transferForm.value).subscribe({
          next: () => {
            this.transferForm.reset();
            this.isTransferInProgress = false;
            this.showNotification('Transfer completed successfully!', 'success');
          },
          error: (error) => {
            console.error('Error creating transfer:', error);
            this.showNotification('Failed to create transfer. Please try again.', 'error');
          }
        });
      };
    }
  }

  navigateBack(): void {
    if (this.isTransferInProgress) {
      this.showConfirmModal = true;
      this.confirmModalTitle = 'Unsaved Changes';
      this.confirmModalMessage = 'You have an unfinished transfer. Are you sure you want to leave this page? Any unsaved changes will be lost.';
      this.confirmModalAction = () => {
        this.router.navigate(['/dashboard']);
      };
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  onConfirmModalConfirmed(): void {
    this.showConfirmModal = false;
    this.confirmModalAction();
  }

  onConfirmModalCancelled(): void {
    this.showConfirmModal = false;
  }

  onAlertClosed(): void {
    this.showAlert = false;
  }
} 