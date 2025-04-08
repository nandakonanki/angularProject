import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dialog-overlay" *ngIf="isOpen" (click)="onCancel()">
      <div class="dialog-content" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <h3>{{ title }}</h3>
          <button class="close-button" (click)="onCancel()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="dialog-body">
          <p>{{ message }}</p>
        </div>
        <div class="dialog-actions">
          <button class="btn-cancel" (click)="onCancel()">Cancel</button>
          <button class="btn-confirm" (click)="onConfirm()">
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease;
    }

    .dialog-content {
      background: white;
      border-radius: 0.75rem;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      animation: slideIn 0.3s ease;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #e2e8f0;

      h3 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: #1e293b;
      }

      .close-button {
        background: none;
        border: none;
        color: #64748b;
        cursor: pointer;
        padding: 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 0.375rem;
        transition: all 0.2s ease;

        &:hover {
          background-color: #f1f5f9;
          color: #1e293b;
        }
      }
    }

    .dialog-body {
      padding: 1.5rem;
      color: #475569;
      font-size: 1rem;
      line-height: 1.5;

      p {
        margin: 0;
      }
    }

    .dialog-actions {
      padding: 1rem 1.5rem;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      border-top: 1px solid #e2e8f0;

      button {
        padding: 0.625rem 1.25rem;
        border-radius: 0.5rem;
        font-weight: 500;
        font-size: 0.875rem;
        transition: all 0.2s ease;

        &.btn-cancel {
          background: white;
          border: 1px solid #e2e8f0;
          color: #64748b;

          &:hover {
            background: #f8fafc;
            border-color: #64748b;
          }
        }

        &.btn-confirm {
          background: #ef4444;
          border: none;
          color: white;

          &:hover {
            background: #dc2626;
          }
        }
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class ConfirmationDialogComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirm Action';
  @Input() message = 'Are you sure you want to proceed?';
  @Input() confirmText = 'Confirm';
  
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
} 