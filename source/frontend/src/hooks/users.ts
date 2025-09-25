import { usersClient } from '@/clients';
import { useMutation, useQuery, useQueryClient } from 'react-query';

export const USERS_QUERY_KEYS = {
  all: ['users'] as const,
  lists: () => [...USERS_QUERY_KEYS.all, 'list'] as const,
};

export const useUsers = (accountId: string) => {
  return useQuery({
    queryKey: [USERS_QUERY_KEYS.lists(), accountId],
    queryFn: () => usersClient.getUsers(accountId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    enabled: Boolean(accountId),
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: usersClient.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries([USERS_QUERY_KEYS.all]);
    },
  });
};

export const useImportUsers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ accountId, file }: { accountId: string; file: File }) =>
      usersClient.importUsers(accountId, file),
    onSuccess: () => {
      // Invalidate users list to refetch data after import
      queryClient.invalidateQueries([USERS_QUERY_KEYS.lists()]);
    },
  });
};

export const useImportUsersFile = () => {
  return useMutation({
    mutationFn: ({ accountId, file }: { accountId: string; file: File }) =>
      usersClient.importUsersFile(accountId, file),
  });
};

export const useQueryJobStatus = (jobId: string) => {
  return useQuery({
    queryFn: () => usersClient.getJobStatus(jobId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    enabled: Boolean(jobId),
  });
};
