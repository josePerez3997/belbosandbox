import { Transaction } from '../data/models/transaction.model';

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx1',
    account: {
      id: 'mock-account-id-1',
      name: 'Cuenta Principal',
      number: '1234567890'
    },
    date: '2024-12-01',
    collected_at: '2024-12-01T08:00:00Z',
    value_date: '2024-12-01',
    accounting_date: '2024-12-01',
    amount: 12000.00,
    balance: 15000.00,
    currency: 'MXN',
    description: 'Pago nómina',
    observations: '',
    category: 'Ingreso',
    subcategory: 'Nómina',
    reference: 'REF001',
    type: 'credit',
    status: 'processed',
    created_at: '2024-12-01T08:00:00Z',
    internal_identification: 'int001',
    merchant: {
      name: 'Empresa S.A.',
      website: 'https://empresa.com',
      logo: 'https://empresa.com/logo.png'
    }
  },
  {
    id: 'tx2',
    account: {
      id: 'mock-account-id-1',
      name: 'Cuenta Principal',
      number: '1234567890'
    },
    date: '2024-12-05',
    collected_at: '2024-12-05T10:00:00Z',
    value_date: '2024-12-05',
    accounting_date: '2024-12-05',
    amount: -1450.00,
    balance: 13550.00,
    currency: 'MXN',
    description: 'Supermercado',
    observations: '',
    category: 'Gasto',
    subcategory: 'Alimentos',
    reference: 'REF002',
    type: 'debit',
    status: 'processed',
    created_at: '2024-12-05T10:00:00Z',
    internal_identification: 'int002',
    merchant: {
      name: 'Supermercado MX',
      website: 'https://supermx.com',
      logo: 'https://supermx.com/logo.png'
    }
  },
  {
    id: 'tx3',
    account: {
      id: 'mock-account-id-2',
      name: 'Cuenta Ahorros',
      number: '0987654321'
    },
    date: '2024-12-10',
    collected_at: '2024-12-10T09:00:00Z',
    value_date: '2024-12-10',
    accounting_date: '2024-12-10',
    amount: 2000.00,
    balance: 5000.00,
    currency: 'MXN',
    description: 'Transferencia recibida',
    observations: '',
    category: 'Ingreso',
    subcategory: 'Transferencia',
    reference: 'REF003',
    type: 'credit',
    status: 'processed',
    created_at: '2024-12-10T09:00:00Z',
    internal_identification: 'int003',
    merchant: {
      name: 'Juan Pérez',
      website: '',
      logo: ''
    }
  },
  {
    id: 'tx4',
    account: {
      id: 'mock-account-id-2',
      name: 'Cuenta Ahorros',
      number: '0987654321'
    },
    date: '2024-12-15',
    collected_at: '2024-12-15T14:00:00Z',
    value_date: '2024-12-15',
    accounting_date: '2024-12-15',
    amount: -800.00,
    balance: 4200.00,
    currency: 'MXN',
    description: 'Compra en línea',
    observations: '',
    category: 'Gasto',
    subcategory: 'Compras',
    reference: 'REF004',
    type: 'debit',
    status: 'processed',
    created_at: '2024-12-15T14:00:00Z',
    internal_identification: 'int004',
    merchant: {
      name: 'Amazon MX',
      website: 'https://amazon.com.mx',
      logo: 'https://amazon.com.mx/logo.png'
    }
  }
];
