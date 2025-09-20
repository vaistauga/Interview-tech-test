import { useQuery } from 'react-query';
import { accountsClient } from '../clients/accounts';

export const useAccounts = () => {
  return useQuery('accounts', accountsClient.getAll);
};

export const useAccount = (id: string) => {
  return useQuery(['account', id], () => accountsClient.getById(id), {
    enabled: !!id,
  });
};
