import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="show" class="alert" [ngClass]="type" [@slideIn]>
      <div class="alert-content">
        <i class="material-icons">{{ getIcon() }}</i>
        <span>{{ message }}</span>
      </div>
      <button class="close-btn" (click)="onClose()">
        <i class="material-icons">close</i>
      </button>
    </div>
  `,
  styles: [`
    .alert {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem;
      border-radius: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      min-width: 300px;
      max-width: 400px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      z-index: 1000;
    }

    .alert-content {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .success {
      background-color: #dcfce7;
      color: #166534;
    }

    .error {
      background-color: #fee2e2;
      color: #991b1b;
    }

    .warning {
      background-color: #fef3c7;
      color: #92400e;
    }

    .close-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.7;
      transition: opacity 0.2s;

      &:hover {
        opacity: 1;
      }
    }

    .material-icons {
      font-size: 20px;
    }
  `],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('200ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class AlertComponent {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'warning' = 'success';
  @Input() show: boolean = false;
  @Output() closed = new EventEmitter<void>();

  getIcon(): string {
    switch (this.type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  }

  onClose(): void {
    this.closed.emit();
  }
} 