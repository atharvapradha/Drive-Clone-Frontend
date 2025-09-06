import { useQuery } from '@tanstack/react-query';
import client from '../api/client';

export function useFiles(folderId, q, sort) {
  return useQuery({
    queryKey: ['files', folderId, q, sort],
    queryFn: async () => {
      const res = await client.get('/api/files', {
        params: { folderId, q, sort },
      });
      return res.data;
    },
    placeholderData: [], // in v5 replaces keepPreviousData
  });
}
