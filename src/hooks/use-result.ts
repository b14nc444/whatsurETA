'use client';

import { useEffect, useState } from 'react';
import { getResult } from '@/lib/api-client';
import type { ApiError, TrackResponse } from '@/types/api';

export const useResult = (queryId: string) => {
  const [data, setData] = useState<TrackResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getResult(queryId);
        setData(response);
      } catch (err) {
        setError(err as ApiError);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [queryId]);

  return { data, loading, error };
};
