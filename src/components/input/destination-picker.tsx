'use client';

import { useCallback, useEffect, useState } from 'react';
import { FieldInlineAction, InputField } from '@/components/ui/input-field';

const DAUM_POSTCODE_SCRIPT_URL =
  'https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
const DAUM_POSTCODE_SCRIPT_ID = 'daum-postcode-sdk';

type Destination = {
  postalCode: string;
  baseAddress: string;
};

type Props = {
  value: Destination;
  onChange: (value: Destination) => void;
  error?: string;
};

export const DestinationPicker = ({ value, onChange, error }: Props) => {
  const [sdkReady, setSdkReady] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [sdkError, setSdkError] = useState<string>('');

  const loadPostcodeSdk = useCallback(async (): Promise<void> => {
    if (typeof window === 'undefined') return;
    if (window.daum?.Postcode) {
      setSdkReady(true);
      return;
    }

    await new Promise<void>((resolve, reject) => {
      const existingScript = document.getElementById(DAUM_POSTCODE_SCRIPT_ID) as
        | HTMLScriptElement
        | null;
      if (existingScript) {
        const onLoad = () => resolve();
        const onError = () => reject(new Error('SDK_LOAD_FAILED'));
        existingScript.addEventListener('load', onLoad, { once: true });
        existingScript.addEventListener('error', onError, { once: true });
        return;
      }

      const script = document.createElement('script');
      script.id = DAUM_POSTCODE_SCRIPT_ID;
      script.src = DAUM_POSTCODE_SCRIPT_URL;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('SDK_LOAD_FAILED'));
      document.head.appendChild(script);
    });

    if (!window.daum?.Postcode) {
      throw new Error('SDK_NOT_READY');
    }
    setSdkReady(true);
  }, []);

  useEffect(() => {
    void loadPostcodeSdk().catch(() =>
      setSdkError('주소 검색 SDK를 불러오지 못했어요. 잠시 후 다시 시도해주세요.')
    );
  }, [loadPostcodeSdk]);

  const openAddressSearch = async () => {
    setSdkError('');

    try {
      setIsOpening(true);
      await loadPostcodeSdk();
      if (!window.daum?.Postcode) {
        throw new Error('SDK_NOT_READY');
      }

      new window.daum.Postcode({
        oncomplete: (data) => {
          const baseAddress = data.roadAddress || data.address || data.jibunAddress || '';
          onChange({
            postalCode: data.zonecode ?? '',
            baseAddress
          });
        }
      }).open();
    } catch {
      setSdkError('주소 검색 준비 중이에요. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsOpening(false);
    }
  };

  const message = error || sdkError;
  const hasSelectedDestination = Boolean(value.baseAddress);

  return (
    <InputField label="도착지" required error={message}>
      {hasSelectedDestination ? (
        <FieldInlineAction
          leading={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21s7-6.13 7-11a7 7 0 1 0-14 0c0 4.87 7 11 7 11Z"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.7" />
            </svg>
          }
          trailing={
            <button
              type="button"
              className="text-body-sm font-semibold text-brand-blue-600"
              onClick={openAddressSearch}
              disabled={isOpening || !sdkReady}
            >
              변경하기
            </button>
          }
          className={message ? 'border-state-error-600 bg-state-error-50' : undefined}
        >
          {value.baseAddress}
        </FieldInlineAction>
      ) : (
        <button
          type="button"
          className="flex h-11 w-full items-center rounded-lg border border-neutral-300 bg-neutral-0 px-4 text-body-sm text-neutral-500 transition-colors duration-base ease-standard hover:bg-neutral-50"
          onClick={openAddressSearch}
          disabled={isOpening || !sdkReady}
        >
          <span className="mr-2 text-brand-blue-600" aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21s7-6.13 7-11a7 7 0 1 0-14 0c0 4.87 7 11 7 11Z"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.7" />
            </svg>
          </span>
          <span className="text-left">{isOpening ? '주소 검색 준비 중...' : '도착지 검색'}</span>
          <span className="ml-auto text-neutral-500" aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="m9 5 6 7-6 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </span>
        </button>
      )}
    </InputField>
  );
};
