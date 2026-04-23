"use client";

import { Toast } from "@/components/common/toast";
import { CourierSelect } from "@/components/input/courier-select";
import { DestinationPicker } from "@/components/input/destination-picker";
import { TrackingInput } from "@/components/input/tracking-input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCouriers } from "@/hooks/use-couriers";
import { useTrack } from "@/hooks/use-track";
import { ERROR_MESSAGES } from "@/lib/constants";
import { trackEvent } from "@/lib/events";
import {
  getLastCourierCode,
  getLastDestination,
  getLastTrackingNumber,
  setLastCourierCode,
  setLastDestination,
  setLastTrackingNumber,
} from "@/lib/storage";
import {
  isDestinationValid,
  isTrackingNumberValid,
  sanitizeTrackingNumber,
} from "@/lib/validators";
import type { TrackResponse } from "@/types/api";
import { FormEvent, useCallback, useEffect, useState } from "react";

type Props = {
  onSuccess?: (response: TrackResponse) => void;
};

export const SearchForm = ({ onSuccess }: Props) => {
  const {
    couriers,
    loading: couriersLoading,
    error: couriersError,
    refetch,
  } = useCouriers();
  const { submit, loading: submitting, error: submitError } = useTrack();

  const [courierCode, setCourierCode] = useState<string>("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [destination, setDestination] = useState({
    postalCode: "",
    baseAddress: "",
  });
  const [trackingError, setTrackingError] = useState<string>("");
  const [destinationError, setDestinationError] = useState<string>("");
  const [toast, setToast] = useState<{
    open: boolean;
    type: "success" | "error";
    message: string;
  }>({
    open: false,
    type: "success",
    message: "",
  });

  const canSubmit = Boolean(
    courierCode &&
      trackingNumber &&
      destination.postalCode &&
      destination.baseAddress,
  );

  const closeToast = useCallback(() => {
    setToast((prev) => ({ ...prev, open: false }));
  }, []);

  useEffect(() => {
    const stored = getLastCourierCode();
    if (stored) {
      setCourierCode(stored);
    }

    const storedTrackingNumber = getLastTrackingNumber();
    if (storedTrackingNumber) {
      setTrackingNumber(storedTrackingNumber);
    }

    const storedDestination = getLastDestination();
    if (
      storedDestination &&
      isDestinationValid(storedDestination.postalCode, storedDestination.baseAddress)
    ) {
      setDestination(storedDestination);
    }
  }, []);

  useEffect(() => {
    setLastCourierCode(courierCode);
  }, [courierCode]);

  useEffect(() => {
    setLastTrackingNumber(trackingNumber);
  }, [trackingNumber]);

  useEffect(() => {
    if (!isDestinationValid(destination.postalCode, destination.baseAddress)) return;
    setLastDestination(destination);
  }, [destination]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTrackingError("");
    setDestinationError("");

    const sanitized = sanitizeTrackingNumber(trackingNumber);
    if (!isTrackingNumberValid(sanitized)) {
      setTrackingError(ERROR_MESSAGES.INVALID_TRACKING_NUMBER);
      return;
    }

    if (!isDestinationValid(destination.postalCode, destination.baseAddress)) {
      setDestinationError(ERROR_MESSAGES.DESTINATION_REQUIRED);
      return;
    }

    trackEvent("search_submit", { courierCode });

    const result = await submit({
      courierCode,
      trackingNumber: sanitized,
      destination: {
        postalCode: destination.postalCode,
        baseAddress: destination.baseAddress,
      },
    });

    if (!result.response) {
      trackEvent("search_error", {
        courierCode,
        errorCode: result.error?.error.code ?? "SYSTEM_ERROR",
      });
      setToast({
        open: true,
        type: "error",
        message: "조회에 실패했어요. 잠시 후 다시 시도해주세요.",
      });
      return;
    }

    trackEvent("search_success", {
      courierCode,
      status: result.response.tracking.deliveryStatus,
      dataSource: result.response.dataSource,
      isStale: result.response.isStale,
    });

    setToast({
      open: true,
      type: "success",
      message: "조회가 완료되었어요.",
    });

    onSuccess?.(result.response);
  };

  return (
    <>
      <Toast
        open={toast.open}
        type={toast.type}
        message={toast.message}
        onClose={closeToast}
      />
      <Card
        as="form"
        preset="form"
        className="flex w-full self-stretch flex-col items-start gap-[1.625rem] !rounded-2xl !border !border-[#F3F4F6] !bg-white !p-9 !shadow-[0_10px_15px_-3px_rgba(229,231,235,0.50)] [&>*]:w-full"
        onSubmit={onSubmit}>
        <CourierSelect
          couriers={couriers}
          value={courierCode}
          onChange={setCourierCode}
          loading={couriersLoading}
          disabled={couriersLoading || submitting}
        />
        <TrackingInput
          value={trackingNumber}
          onChange={setTrackingNumber}
          error={trackingError}
        />
        <DestinationPicker
          value={destination}
          onChange={setDestination}
          error={destinationError}
        />

        {couriersError ? (
          <div className="flex items-center justify-between rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            <span>{couriersError}</span>
            <Button variant="secondary" onClick={refetch}>
              다시 시도
            </Button>
          </div>
        ) : null}

        <div className="flex w-full flex-col items-start gap-2">
          <Button
            variant="primary-gradient"
            type="submit"
            fullWidth
            size="lg"
            loading={submitting}
            loadingText="조회 중..."
            disabled={!canSubmit || couriersLoading}>
            조회하기
          </Button>
          {submitError ? (
            <p className="w-full text-sm font-normal text-rose-500">
              조회되지 않는 배송 건입니다. 입력 정보를 확인해주세요.
            </p>
          ) : null}
        </div>
      </Card>
    </>
  );
};
