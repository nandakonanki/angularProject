export interface Account {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  accountType: 'checking' | 'savings';
  initialDeposit: number;
  createdAt?: Date;
} 