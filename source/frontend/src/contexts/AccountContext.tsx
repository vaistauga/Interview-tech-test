import React, { createContext, useContext, useEffect, useState } from 'react';
import { Account } from '../clients/accounts';
import { useAccounts } from '../hooks/accounts';

type AccountContextType = {
  accounts: Account[];
  selectedAccount: Account | null;
  setSelectedAccount: (account: Account | null) => void;
  loading: boolean;
  error: Error | null;
};

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: accounts = [], isLoading, error } = useAccounts();
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  // Set the first account as selected when accounts are loaded
  useEffect(() => {
    if (accounts.length > 0 && !selectedAccount) {
      setSelectedAccount(accounts[0]);
    }
  }, [accounts, selectedAccount]);

  return (
    <AccountContext.Provider
      value={{
        accounts,
        selectedAccount,
        setSelectedAccount,
        loading: isLoading,
        error: error as Error | null,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccountContext = () => {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccountContext must be used within an AccountProvider');
  }

  return context;
};
