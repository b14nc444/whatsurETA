'use client';

import { useState } from 'react';
import { postTrack } from '@/lib/api-client';
import type { ApiError, TrackRequest, TrackResponse } from '@/types/api';

type SubmitResult = {
  response: TrackResponse | null;
  error: ApiError | null;
};

export const useTrack = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const submit = async (payload: TrackRequest): Promise<SubmitResult> => {
    try {
      setLoading(true);
      setError(null);
      const response = await postTrack(payload);
      return { response, error: null };
    } catch (err) {
      const nextError = err as ApiError;
      setError(nextError);
      return { response: null, error: nextError };
    } finally {
      setLoading(false);
    }
  };

  return { submit, loading, error };
};
