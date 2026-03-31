'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Toast } from '@/components/common/toast';
import { CourierSelect } from '@/components/input/courier-select';
import { TrackingInput } from '@/components/input/tracking-input';
import { DestinationPicker } from '@/components/input/destination-picker';
import { useCouriers } from '@/hooks/use-couriers';
import { useTrack } from '@/hooks/use-track';
import { trackEvent } from '@/lib/events';
import { ERROR_MESSAGES } from '@/lib/constants';
import { getLastCourierCode, setLastCourierCode } from '@/lib/storage';
import { isDestinationValid, isTrackingNumberValid, sanitizeTrackingNumber } from '@/lib/validators';
import type { TrackResponse } from '@/types/api';

type Props = {
  onSuccess?: (response: TrackResponse) => void;
};

export const SearchForm = ({ onSuccess }: Props) => {
  const { couriers, loading: couriersLoading, error: couriersError, refetch } = useCouriers();
  const { submit, loading: submitting, error: submitError } = useTrack();

  const [courierCode, setCourierCode] = useState<string>('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [destination, setDestination] = useState({
    postalCode: '',
    baseAddress: ''
  });
  const [trackingError, setTrackingError] = useState<string>('');
  const [destinationError, setDestinationError] = useState<string>('');
  const [toast, setToast] = useState<{
    open: boolean;
    type: 'success' | 'error';
    message: string;
  }>({
    open: false,
    type: 'success',
    message: ''
  });

  const canSubmit = Boolean(courierCode && trackingNumber && destination.postalCode && destination.baseAddress);

  const closeToast = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  useEffect(() => {
    const stored = getLastCourierCode();
    if (stored) {
      setCourierCode(stored);
    }
  }, []);

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

    const result = await submit({
      courierCode,
      trackingNumber: sanitized,
      destination: {
        postalCode: destination.postalCode,
        baseAddress: destination.baseAddress
      }
    });

    if (!result || !result.response) {
      trackEvent('search_error', {
        courierCode,
        errorCode: result?.error?.error.code ?? 'SYSTEM_ERROR'
      });
      setToast({
        open: true,
        type: 'error',
        message: '조회에 실패했어요. 잠시 후 다시 시도해주세요.'
      });
      return;
    }

    trackEvent('search_success', {
      courierCode,
      status: result.response.tracking.deliveryStatus,
      dataSource: result.response.dataSource,
      isStale: result.response.isStale
    });

    setToast({
      open: true,
      type: 'success',
      message: '조회가 완료되었어요.'
    });

    onSuccess?.(result.response);
  };

  return (
    <>
      <Toast open={toast.open} type={toast.type} message={toast.message} onClose={closeToast} />
      <Card as="form" preset="form" className="space-y-4" onSubmit={onSubmit}>
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
            <Button variant="secondary" onClick={refetch}>
              다시 시도
            </Button>
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
    </>
  );
};
