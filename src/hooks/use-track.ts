'use client';

import { useState } from 'react';
import { postTrack } from '@/lib/api-client';
import type { ApiError, TrackRequest, TrackResponse } from '@/types/api';

export const useTrack = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const submit = async (payload: TrackRequest): Promise<TrackResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      return await postTrack(payload);
    } catch (err) {
      setError(err as ApiError);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
};
