'use client';

import { useCallback, useEffect, useState } from 'react';

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

  return (
    <div className="space-y-2">
      <label className="label">도착지</label>
      <button
        type="button"
        className="btn-secondary"
        onClick={openAddressSearch}
        disabled={isOpening}
      >
        {isOpening ? '주소 검색 준비 중...' : '도착지 검색'}
      </button>
      <input
        className="input"
        value={value.postalCode}
        placeholder="우편번호"
        readOnly
      />
      <input
        className="input"
        value={value.baseAddress}
        placeholder="기본주소"
        readOnly
      />
      {message ? <p className="text-xs text-red-700">{message}</p> : null}
    </div>
  );
};
