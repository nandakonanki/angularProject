import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="show" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <i class="material-icons warning-icon">warning</i>
          <h2>{{ title }}</h2>
        </div>
        <div class="modal-body">
          <p>{{ message }}</p>
        </div>
        <div class="modal-footer">
          <button class="cancel-btn" (click)="onCancel()">Cancel</button>
          <button class="confirm-btn" (click)="onConfirm()">{{ confirmText }}</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      width: 90%;
      max-width: 500px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .modal-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;

      h2 {
        margin: 0;
        color: #1f2937;
        font-size: 1.25rem;
      }

      .warning-icon {
        color: #f59e0b;
        font-size: 24px;
      }
    }

    .modal-body {
      margin-bottom: 1.5rem;
      
      p {
        margin: 0;
        color: #4b5563;
        line-height: 1.5;
      }
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }

    .cancel-btn, .confirm-btn {
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .cancel-btn {
      background-color: white;
      border: 1px solid #d1d5db;
      color: #4b5563;

      &:hover {
        background-color: #f3f4f6;
      }
    }

    .confirm-btn {
      background-color: #4f46e5;
      border: none;
      color: white;

      &:hover {
        background-color: #4338ca;
      }
    }
  `]
})
export class ConfirmationModalComponent {
  @Input() show = false;
  @Input() title = 'Confirm Action';
  @Input() message = '';
  @Input() confirmText = 'Confirm';
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }
} 