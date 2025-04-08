import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { AccountService, Account } from '../../services/account.service';
import { TransferService, Transfer } from '../../services/transfer.service';
import { Observable, map } from 'rxjs';

interface Transaction extends Omit<Transfer, 'type'> {
  type: 'credit' | 'debit';
}

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent
  ],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {
  account$: Observable<Account | undefined>;
  transactions$: Observable<Transaction[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private accountService: AccountService,
    private transferService: TransferService
  ) {
    this.account$ = new Observable<Account | undefined>();
    this.transactions$ = new Observable<Transaction[]>();
  }

  ngOnInit() {
    const accountId = this.route.snapshot.paramMap.get('id');
    if (!accountId) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.account$ = this.accountService.getAccounts().pipe(
      map(accounts => accounts.find(acc => acc.id === accountId))
    );

    this.transactions$ = this.transferService.getTransfers().pipe(
      map(transfers => 
        transfers
          .filter(transfer => transfer.fromAccountId === accountId)
          .map(transfer => ({
            ...transfer,
            type: 'debit' as const,
            amount: transfer.amount
          }) as Transaction)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      )
    );
  }

  navigateBack(): void {
    this.router.navigate(['/dashboard']);
  }
} 