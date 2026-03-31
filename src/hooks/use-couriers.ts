'use client';

import { useState } from 'react';
import { useEffect } from 'react';
import { getCouriers } from '@/lib/api-client';
import type { Courier } from '@/types/courier';

export const useCouriers = () => {
  const [couriers, setCouriers] = useState<Courier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCouriers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getCouriers();
      setCouriers(response.couriers.filter((courier) => courier.enabled));
    } catch {
      setError('택배사 목록을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchCouriers();
  }, []);

  return { couriers, loading, error, refetch: fetchCouriers };
};
