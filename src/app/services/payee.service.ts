import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Payee {
  id: string;
  name: string;
  accountNumber: string;
  routingNumber: string;
  accountType: 'checking' | 'savings';
  bankName: string;
  email?: string;
  phone?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PayeeService {
  private payees = new BehaviorSubject<Payee[]>([]);

  constructor() {
    // Initialize with empty payees list
    this.resetPayees();
  }

  resetPayees(): void {
    this.payees.next([]);
  }

  getPayees(): Observable<Payee[]> {
    return this.payees.asObservable();
  }

  addPayee(payeeData: Omit<Payee, 'id'>): Observable<void> {
    return new Observable(subscriber => {
      const newPayee: Payee = {
        ...payeeData,
        id: (this.payees.value.length + 1).toString()
      };

      const currentPayees = this.payees.value;
      this.payees.next([...currentPayees, newPayee]);

      // Simulate API delay
      setTimeout(() => {
        subscriber.next();
        subscriber.complete();
      }, 1000);
    });
  }

  deletePayee(payeeId: string): void {
    const currentPayees = this.payees.value;
    this.payees.next(currentPayees.filter(payee => payee.id !== payeeId));
  }
} 