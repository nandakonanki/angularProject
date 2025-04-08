import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { AccountService, Account } from '../../services/account.service';
import { Observable, Subscription } from 'rxjs';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    ConfirmationDialogComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  accounts$ = new Observable<Account[]>();
  totalBalance = 0;
  totalChecking = 0;
  accounts: Account[] = [];
  isDeleteDialogOpen = false;
  private accountsSubscription?: Subscription;

  quickActions = [
    { icon: 'add', label: 'Create Account', route: '/create-account' },
    { icon: 'credit_card', label: 'Bill Pay', route: '/bill-pay' },
    { icon: 'send', label: 'Transfer', route: '/transfers' },
    { icon: 'description', label: 'Statements', route: '/statements' },
    { icon: 'account_balance', label: 'Account Status', route: '/account-status' },
    { icon: 'delete', label: 'Delete All', action: () => this.showDeleteConfirmation() }
  ];

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  ngOnDestroy(): void {
    if (this.accountsSubscription) {
      this.accountsSubscription.unsubscribe();
    }
  }

  private loadAccounts(): void {
    this.accounts$ = this.accountService.getAccounts();
    this.accountsSubscription = this.accounts$.subscribe(accounts => {
      console.log('Received accounts update:', accounts);
      this.accounts = accounts;
      this.calculateBalances(accounts);
    });
  }

  private calculateBalances(accounts: Account[]): void {
    this.totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
    this.totalChecking = accounts
      .filter(account => account.accountType === 'CHK')
      .reduce((sum, account) => sum + account.balance, 0);
  }

  toggleCardVisibility(accountType: string): void {
    const account = this.accounts.find(acc => acc.accountType === accountType);
    if (account && account.debitCard) {
      this.accountService.toggleCardVisibility(account.id);
    }
  }

  getLastFourDigits(cardNumber: string): string {
    return cardNumber.replace(/\s/g, '').slice(-4);
  }

  showDeleteConfirmation(): void {
    console.log('Opening delete confirmation dialog...');
    this.isDeleteDialogOpen = true;
  }

  onDeleteConfirm(): void {
    console.log('Delete confirmed, deleting all accounts...');
    this.accountService.deleteAllAccounts();
    this.isDeleteDialogOpen = false;
    this.loadAccounts(); // Refresh the accounts list
  }

  onDeleteCancel(): void {
    console.log('Delete cancelled');
    this.isDeleteDialogOpen = false;
  }

  handleQuickAction(action: any): void {
    if (action.action) {
      action.action();
    }
  }

  getCheckingAccount(): Account | undefined {
    return this.accounts
      .filter(account => account.accountType === 'CHK')
      .pop();
  }

  getSavingsAccount(): Account | undefined {
    return this.accounts
      .filter(account => account.accountType === 'SAV')
      .pop();
  }

  getAccountByType(accountType: 'CHK' | 'SAV'): Account | undefined {
    return this.accounts.find(acc => acc.accountType === accountType);
  }
}
