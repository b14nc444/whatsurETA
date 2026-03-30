'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CourierSelect } from '@/components/input/courier-select';
import { TrackingInput } from '@/components/input/tracking-input';
import { DestinationPicker } from '@/components/input/destination-picker';
import { RetryButton } from '@/components/common/retry-button';
import { useCouriers } from '@/hooks/use-couriers';
import { useTrack } from '@/hooks/use-track';
import { trackEvent } from '@/lib/events';
import { ERROR_MESSAGES } from '@/lib/constants';
import { getLastCourierCode, setLastCourierCode } from '@/lib/storage';
import { isDestinationValid, isTrackingNumberValid, sanitizeTrackingNumber } from '@/lib/validators';

export const SearchForm = () => {
  const router = useRouter();
  const { couriers, loading: couriersLoading, error: couriersError, refetch } = useCouriers();
  const { submit, loading: submitting, error: submitError } = useTrack();

  const [courierCode, setCourierCode] = useState<string>(() => getLastCourierCode() ?? '');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [destination, setDestination] = useState({
    postalCode: '',
    baseAddress: ''
  });
  const [trackingError, setTrackingError] = useState<string>('');
  const [destinationError, setDestinationError] = useState<string>('');

  const canSubmit = useMemo(() => {
    return Boolean(courierCode && trackingNumber && destination.postalCode && destination.baseAddress);
  }, [courierCode, trackingNumber, destination]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTrackingError('');
    setDestinationError('');

    const sanitized = sanitizeTrackingNumber(trackingNumber);
    if (!isTrackingNumberValid(sanitized)) {
      setTrackingError(ERROR_MESSAGES.INVALID_TRACKING_NUMBER);
      return;
    }

    if (!isDestinationValid(destination.postalCode, destination.baseAddress)) {
      setDestinationError(ERROR_MESSAGES.DESTINATION_REQUIRED);
      return;
    }

    setLastCourierCode(courierCode);
    trackEvent('search_submit', { courierCode });

    const response = await submit({
      courierCode,
      trackingNumber: sanitized,
      destination: {
        postalCode: destination.postalCode,
        baseAddress: destination.baseAddress
      }
    });

    if (!response) {
      trackEvent('search_error', {
        courierCode,
        errorCode: submitError?.error.code ?? 'SYSTEM_ERROR'
      });
      return;
    }

    trackEvent('search_success', {
      courierCode,
      status: response.tracking.deliveryStatus,
      dataSource: response.dataSource,
      isStale: response.isStale
    });

    router.push(`/result/${response.queryId}`);
  };

  return (
    <Card as="form" preset="form" className="space-y-5" onSubmit={onSubmit}>
      <CourierSelect
        couriers={couriers}
        value={courierCode}
        onChange={setCourierCode}
        disabled={couriersLoading || submitting}
      />
      <TrackingInput value={trackingNumber} onChange={setTrackingNumber} error={trackingError} />
      <DestinationPicker value={destination} onChange={setDestination} error={destinationError} />

      {couriersError ? (
        <div className="flex items-center justify-between rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
          <span>{couriersError}</span>
          <RetryButton onClick={refetch} />
        </div>
      ) : null}

      {submitError ? (
        <p className="text-xs text-red-700">
          {submitError.error?.message ?? ERROR_MESSAGES.SYSTEM_ERROR}
        </p>
      ) : null}

      <Button
        variant="primary-gradient"
        type="submit"
        fullWidth
        size="lg"
        loading={submitting}
        loadingText="조회 중..."
        disabled={!canSubmit || couriersLoading}
      >
        조회하기
      </Button>
    </Card>
  );
};
