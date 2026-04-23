'use client';

import { useMemo } from 'react';
import { SUPPORTED_COURIERS } from '@/lib/couriers';
import type { Courier } from '@/types/courier';

export const useCouriers = () => {
  const couriers = useMemo<Courier[]>(
    () => SUPPORTED_COURIERS.filter((courier) => courier.enabled),
    []
  );

  return {
    couriers,
    loading: false,
    error: null,
    refetch: async () => undefined
  };
};
