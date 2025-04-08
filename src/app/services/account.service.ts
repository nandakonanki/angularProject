import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, delay, tap } from 'rxjs';

export interface DebitCard {
  cardNumber: string;
  cardHolderName: string;
  expiryDate: string;
  cvv: string;
  status: string;
}

export interface Account {
  id: string;
  accountNumber: string;
  accountName: string;
  accountType: 'CHK' | 'SAV';
  balance: number;
  currency: string;
  status: string;
  createdAt: Date;
  alternativeId: string;
  parentClientId: string;
  debitCard?: DebitCard;
}

export interface AccountHolder {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  ssn: string;
  lastLogin: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private accountHolder = new BehaviorSubject<AccountHolder | null>(null);
  private accounts = new BehaviorSubject<Account[]>([]);
  private readonly CHECKING_INITIAL_BALANCE = 1000;
  private readonly SAVINGS_INITIAL_BALANCE = 500;

  constructor() {
    // No need to reset accounts on initialization
  }

  resetAccounts(): void {
    console.log('Resetting accounts to initial state...');
    this.accounts.next([]);
    console.log('Accounts have been reset to initial state');
  }

  private generateExpiryDate(): string {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 4); // Card expires in 4 years
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${month}/${year}`;
  }

  createAccount(accountData: any): Observable<any> {
    console.log('Creating account with data:', accountData);
    
    // Ensure accounts BehaviorSubject is initialized
    if (!this.accounts) {
      console.log('Reinitializing accounts BehaviorSubject');
      this.accounts = new BehaviorSubject<Account[]>([]);
    }

    // Generate random account number and card number
    const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const cardNumber = Math.floor(1000000000000000 + Math.random() * 9000000000000000).toString();
    const formattedCardNumber = cardNumber.replace(/(\d{4})/g, '$1 ').trim();

    // Set initial balance based on account type
    const initialBalance = accountData.virtualAccountDetails.accountType === 'CHK' ? this.CHECKING_INITIAL_BALANCE : this.SAVINGS_INITIAL_BALANCE;

    // Create new account object
    const newAccount: Account = {
      id: Date.now().toString(),
      accountNumber,
      accountName: accountData.virtualAccountDetails.virtualAccountName,
      accountType: accountData.virtualAccountDetails.accountType,
      balance: initialBalance,
      currency: 'USD',
      status: 'Active',
      createdAt: new Date(),
      alternativeId: '154821',
      parentClientId: '1000195150',
      debitCard: accountData.virtualAccountDetails.accountType === 'CHK' ? {
        cardNumber: formattedCardNumber,
        cardHolderName: `${accountData.individualDetails.legalName.firstName} ${accountData.individualDetails.legalName.lastName}`,
        expiryDate: this.generateExpiryDate(),
        cvv: Math.floor(100 + Math.random() * 900).toString(),
        status: 'Hidden'
      } : undefined
    };

    // Update accounts list
    const currentAccounts = this.accounts.value;
    this.accounts.next([...currentAccounts, newAccount]);
    
    console.log('Account created:', newAccount);
    console.log('Updated accounts list:', this.accounts.value);

    // Simulate API delay
    return of(newAccount).pipe(
      delay(1000),
      tap(() => {
        console.log('Account creation completed');
      })
    );
  }

  getAccounts(): Observable<Account[]> {
    return this.accounts.asObservable();
  }

  getAccountById(id: string): Account | undefined {
    return this.accounts.value.find(account => account.id === id);
  }

  updateAccount(updatedAccount: Account): void {
    const currentAccounts = this.accounts.value;
    const index = currentAccounts.findIndex(account => account.id === updatedAccount.id);
    if (index !== -1) {
      currentAccounts[index] = updatedAccount;
      this.accounts.next([...currentAccounts]);
    }
  }

  deleteAccount(id: string): void {
    const currentAccounts = this.accounts.value;
    this.accounts.next(currentAccounts.filter(account => account.id !== id));
  }

  toggleCardVisibility(accountId: string): void {
    const account = this.getAccountById(accountId);
    if (account && account.debitCard) {
      const updatedAccount = {
        ...account,
        debitCard: {
          ...account.debitCard,
          status: account.debitCard.status === 'Active' ? 'Hidden' : 'Active'
        }
      };
      this.updateAccount(updatedAccount);
    }
  }

  updateAccounts(accounts: Account[]): void {
    this.accounts.next(accounts);
  }

  deleteAllAccounts(): void {
    console.log('Deleting all accounts...');
    this.accounts.next([]);
    console.log('All accounts have been deleted');
  }

  // Ensure service is properly initialized
  ensureInitialized(): void {
    console.log('Ensuring AccountService is initialized...');
    if (!this.accounts) {
      console.log('Reinitializing accounts BehaviorSubject');
      this.accounts = new BehaviorSubject<Account[]>([]);
    }
    console.log('AccountService is initialized');
  }

  // Create account with robust error handling
  createAccountRobust(accountData: { accountType: 'CHK' | 'SAV', virtualAccountName: string }): Observable<void> {
    // Ensure service is initialized
    this.ensureInitialized();
    
    return new Observable(subscriber => {
      try {
        console.log('Creating new account with data:', accountData);
        
        // Generate a random account number
        const accountNumber = Math.floor(Math.random() * 9000000000 + 1000000000).toString();
        const cardNumber = Math.floor(Math.random() * 9000000000000000 + 1000000000000000).toString();
        const formattedCardNumber = cardNumber.match(/.{1,4}/g)?.join(' ') || cardNumber;
        
        // Set initial balance based on account type
        const initialBalance = accountData.accountType === 'CHK' 
          ? this.CHECKING_INITIAL_BALANCE 
          : this.SAVINGS_INITIAL_BALANCE;

        console.log(`Creating new ${accountData.accountType} account with initial balance: $${initialBalance}`);
        
        // Create new account
        const newAccount: Account = {
          id: Date.now().toString(),
          accountNumber,
          accountName: accountData.virtualAccountName,
          accountType: accountData.accountType,
          balance: initialBalance,
          currency: 'USD',
          status: 'Active',
          createdAt: new Date(),
          alternativeId: '154821',
          parentClientId: '1000195150',
          debitCard: accountData.accountType === 'CHK' ? {
            cardNumber: formattedCardNumber,
            cardHolderName: 'Account Holder',
            expiryDate: this.generateExpiryDate(),
            cvv: Math.floor(100 + Math.random() * 900).toString(),
            status: 'Hidden'
          } : undefined
        };

        // Update accounts
        const currentAccounts = this.accounts.value;
        this.accounts.next([...currentAccounts, newAccount]);
        console.log('Account created successfully:', newAccount);
        console.log('Updated accounts list:', [...currentAccounts, newAccount]);

        // Simulate API delay
        setTimeout(() => {
          subscriber.next();
          subscriber.complete();
        }, 1000);
      } catch (error) {
        console.error('Error creating account:', error);
        subscriber.error(error);
      }
    });
  }
}
