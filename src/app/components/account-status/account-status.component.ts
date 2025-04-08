import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { AccountService, Account } from '../../services/account.service';
import { Observable, Subscription } from 'rxjs';
import { trigger, state, style, transition, animate, stagger, query } from '@angular/animations';

interface AccountStatusInfo {
  accountNumber: string;
  kycStatus: string;
  onboardRequestId: string;
  alternativeId: string;
  parentClientId: string;
  accountStatus: string;
}

@Component({
  selector: 'app-account-status',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent
  ],
  templateUrl: './account-status.component.html',
  styleUrls: ['./account-status.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
    trigger('statusBadge', [
      state('verified', style({
        backgroundColor: '#d4edda',
        color: '#155724'
      })),
      state('pending', style({
        backgroundColor: '#fff3cd',
        color: '#856404'
      })),
      state('rejected', style({
        backgroundColor: '#f8d7da',
        color: '#721c24'
      })),
      transition('* => *', [
        animate('300ms ease-in-out')
      ])
    ]),
    trigger('staggerList', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('100ms', [
            animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('pulseAnimation', [
      state('active', style({
        transform: 'scale(1)'
      })),
      state('inactive', style({
        transform: 'scale(1)'
      })),
      transition('inactive => active', [
        animate('400ms ease-in-out', style({ transform: 'scale(1.03)' })),
        animate('400ms ease-in-out', style({ transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class AccountStatusComponent implements OnInit, OnDestroy {
  accounts$ = new Observable<Account[]>();
  accounts: Account[] = [];
  accountStatusInfo: AccountStatusInfo[] = [];
  today = new Date();
  animationState = 'inactive';
  private accountsSubscription?: Subscription;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.loadAccounts();
    // Trigger the pulse animation after a delay
    setTimeout(() => {
      this.animationState = 'active';
    }, 300);
  }

  ngOnDestroy(): void {
    if (this.accountsSubscription) {
      this.accountsSubscription.unsubscribe();
    }
  }

  private loadAccounts(): void {
    this.accounts$ = this.accountService.getAccounts();
    this.accountsSubscription = this.accounts$.subscribe(accounts => {
      console.log('Received accounts for status page:', accounts);
      this.accounts = accounts;
      this.extractAccountStatusInfo();
    });
  }

  private extractAccountStatusInfo(): void {
    this.accountStatusInfo = this.accounts.map(account => ({
      accountNumber: account.accountNumber,
      kycStatus: 'Verified', // Default value, could be from account data
      onboardRequestId: `REQ-${Date.now().toString().slice(-6)}`, // Generate a dummy request ID
      alternativeId: account.alternativeId,
      parentClientId: account.parentClientId,
      accountStatus: account.status
    }));
  }

  triggerPulse(): void {
    this.animationState = 'inactive';
    setTimeout(() => {
      this.animationState = 'active';
    }, 50);
  }
} 