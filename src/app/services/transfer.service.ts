import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, take } from 'rxjs';
import { AccountService } from './account.service';
import { PayeeService } from './payee.service';

export interface Transfer {
  id: string;
  fromAccountId: string;
  toPayeeId: string;
  amount: number;
  description: string;
  date: Date;
  status: 'pending' | 'completed' | 'failed';
}

@Injectable({
  providedIn: 'root'
})
export class TransferService {
  private transfers = new BehaviorSubject<Transfer[]>([]);
  transfers$ = this.transfers.asObservable();

  constructor(
    private accountService: AccountService,
    private payeeService: PayeeService
  ) {}

  getTransfers(): Observable<Transfer[]> {
    return this.transfers$;
  }

  createTransfer(transferData: Omit<Transfer, 'id' | 'date' | 'status'>): Observable<Transfer> {
    return new Observable(observer => {
      // Get current accounts state
      this.accountService.getAccounts().pipe(
        take(1)
      ).subscribe(accounts => {
        const fromAccount = accounts.find(acc => acc.id === transferData.fromAccountId);
        
        if (!fromAccount) {
          observer.error(new Error('Source account not found'));
          return;
        }

        if (fromAccount.balance < transferData.amount) {
          observer.error(new Error('Insufficient funds'));
          return;
        }

        // Create new transfer
        const newTransfer: Transfer = {
          ...transferData,
          id: crypto.randomUUID(),
          date: new Date(),
          status: 'pending'
        };

        // Update account balance
        const updatedAccounts = accounts.map(acc => {
          if (acc.id === transferData.fromAccountId) {
            return {
              ...acc,
              balance: acc.balance - transferData.amount
            };
          }
          return acc;
        });

        // Update accounts
        this.accountService.updateAccounts(updatedAccounts);

        // Add transfer to list
        const currentTransfers = this.transfers.value;
        this.transfers.next([...currentTransfers, newTransfer]);

        // Simulate transfer processing
        setTimeout(() => {
          const completedTransfer = { ...newTransfer, status: 'completed' as const };
          const updatedTransfers = this.transfers.value.map(t => 
            t.id === completedTransfer.id ? completedTransfer : t
          );
          this.transfers.next(updatedTransfers);
          observer.next(completedTransfer);
          observer.complete();
        }, 2000);
      });
    });
  }
} 