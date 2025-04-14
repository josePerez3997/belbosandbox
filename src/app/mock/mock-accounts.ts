import { Account } from '../data/models/account.model';

export const MOCK_ACCOUNTS: Account[] = [
  {
    id: 'mock-account-id-1',
    name: 'Cuenta Principal',
    number: '1234567890',
    currency: 'MXN',
    balance: {
      current: 13550.00,
      available: 13000.00
    },
    institution: 'mock-bank-1',
    type: 'checking',
    category: 'personal',
    public: true,
    created_at: '2024-11-01T08:00:00Z',
    updated_at: '2024-12-01T08:00:00Z'
  },
  {
    id: 'mock-account-id-2',
    name: 'Cuenta Ahorros',
    number: '0987654321',
    currency: 'MXN',
    balance: {
      current: 4200.00,
      available: 4000.00
    },
    institution: 'mock-bank-2',
    type: 'savings',
    category: 'personal',
    public: true,
    created_at: '2024-11-10T10:00:00Z',
    updated_at: '2024-12-10T10:00:00Z'
  }
];
