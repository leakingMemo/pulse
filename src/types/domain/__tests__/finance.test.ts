import {
  Account,
  AccountType,
  Balance,
  Transaction,
  TransactionCategory,
  TransactionStatus,
} from '../finance';

describe('Finance Domain Types', () => {
  describe('Account', () => {
    it('should create a valid account object', () => {
      const account: Account = {
        id: 'acc_123',
        name: 'Main Checking',
        type: AccountType.CHECKING,
        balance: {
          current: 5000,
          currency: 'USD',
          asOf: new Date('2025-01-27'),
        },
        institution: 'Bank of Example',
        lastFourDigits: '1234',
        currency: 'USD',
        isActive: true,
        lastSyncedAt: new Date('2025-01-27T10:00:00Z'),
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2025-01-27'),
      };

      expect(account.id).toBe('acc_123');
      expect(account.type).toBe(AccountType.CHECKING);
      expect(account.balance.current).toBe(5000);
      expect(account.isActive).toBe(true);
    });
  });

  describe('AccountType', () => {
    it('should have all expected account types', () => {
      expect(AccountType.CHECKING).toBe('checking');
      expect(AccountType.SAVINGS).toBe('savings');
      expect(AccountType.CREDIT_CARD).toBe('credit_card');
      expect(AccountType.INVESTMENT).toBe('investment');
      expect(AccountType.LOAN).toBe('loan');
      expect(AccountType.MORTGAGE).toBe('mortgage');
      expect(AccountType.OTHER).toBe('other');
    });
  });
});
