import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="logo">
        <i class="material-icons">account_balance</i>
        <span>SECURE<strong>BANK</strong></span>
      </div>
      <div class="user-info">
        <span>Welcome Nanda Kishore</span>
        <span class="last-login">Last login: Today at {{ currentTime | date:'shortTime' }}</span>
        <div class="reset-message" *ngIf="showResetMessage">All accounts have been deleted!</div>
      </div>
      <div class="actions">
        <button 
          class="action-btn" 
          (click)="resetAccounts()" 
          title="Delete All Accounts" 
          [class.spinning]="isResetting" 
          [disabled]="isResetting"
        >
          <i class="material-icons">delete_forever</i>
        </button>
        <button class="action-btn" title="Notifications">
          <i class="material-icons">notifications</i>
        </button>
        <button class="action-btn" title="Help">
          <i class="material-icons">help</i>
        </button>
        <button class="action-btn" title="Profile">
          <i class="material-icons">person</i>
        </button>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background-color: #2563eb;
      color: white;
      padding: 1rem 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.25rem;

      i {
        font-size: 24px;
      }
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      position: relative;

      .last-login {
        font-size: 0.75rem;
        opacity: 0.8;
      }

      .reset-message {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        background-color: #dc2626;
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-size: 0.875rem;
        margin-top: 0.5rem;
        animation: fadeInOut 2s ease-in-out;
        white-space: nowrap;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
    }

    .actions {
      display: flex;
      gap: 0.5rem;

      .action-btn {
        background: none;
        border: none;
        color: white;
        padding: 0.5rem;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;

        &:hover:not(:disabled) {
          background-color: rgba(255, 255, 255, 0.1);
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        &.spinning i {
          animation: spin 1s linear infinite;
        }

        i {
          font-size: 20px;
        }
      }
    }

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes fadeInOut {
      0% {
        opacity: 0;
        transform: translate(-50%, -10px);
      }
      15% {
        opacity: 1;
        transform: translate(-50%, 0);
      }
      85% {
        opacity: 1;
        transform: translate(-50%, 0);
      }
      100% {
        opacity: 0;
        transform: translate(-50%, -10px);
      }
    }
  `]
})
export class HeaderComponent {
  currentTime = new Date();
  isResetting = false;
  showResetMessage = false;

  constructor(private accountService: AccountService) {}

  resetAccounts(): void {
    if (this.isResetting) return;
    
    this.isResetting = true;
    this.accountService.resetAccounts();
    
    // Show spinning animation and deletion message
    setTimeout(() => {
      this.isResetting = false;
      this.showResetMessage = true;
      
      // Hide deletion message after 2 seconds
      setTimeout(() => {
        this.showResetMessage = false;
      }, 2000);
    }, 1000);
  }
}
