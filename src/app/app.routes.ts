import { Routes } from '@angular/router';
import { CreateAccountComponent } from './components/create-account/create-account.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TransfersComponent } from './components/transfers/transfers.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { AccountStatusComponent } from './components/account-status/account-status.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'create-account', component: CreateAccountComponent },
  { path: 'transfers', component: TransfersComponent },
  { path: 'transactions/:id', component: TransactionsComponent },
  { path: 'account-status', component: AccountStatusComponent }
];
