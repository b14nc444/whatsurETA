'use client';

import { useEffect, useState } from 'react';

const DAUM_POSTCODE_SCRIPT_URL =
  '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';

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
  const [sdkError, setSdkError] = useState<string>('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.daum?.postcode?.Postcode) {
      setSdkReady(true);
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${DAUM_POSTCODE_SCRIPT_URL}"]`
    );
    if (existingScript) {
      const onLoad = () => setSdkReady(true);
      const onError = () => setSdkError('주소 검색 SDK를 불러오지 못했어요. 잠시 후 다시 시도해주세요.');
      existingScript.addEventListener('load', onLoad);
      existingScript.addEventListener('error', onError);
      return () => {
        existingScript.removeEventListener('load', onLoad);
        existingScript.removeEventListener('error', onError);
      };
    }

    const script = document.createElement('script');
    script.src = DAUM_POSTCODE_SCRIPT_URL;
    script.async = true;
    script.onload = () => setSdkReady(true);
    script.onerror = () => setSdkError('주소 검색 SDK를 불러오지 못했어요. 잠시 후 다시 시도해주세요.');
    document.head.appendChild(script);
  }, []);

  const openAddressSearch = () => {
    setSdkError('');
    if (!sdkReady || !window.daum?.postcode?.Postcode) {
      setSdkError('주소 검색 준비 중이에요. 잠시 후 다시 시도해주세요.');
      return;
    }

    const wrap = document.getElementById('postcode-layer');
    if (!wrap) return;
    wrap.innerHTML = '';

    new window.daum.postcode.Postcode({
      oncomplete: (data) => {
        const baseAddress = data.roadAddress || data.address || data.jibunAddress || '';
        onChange({
          postalCode: data.zonecode ?? '',
          baseAddress
        });
      }
    }).embed(wrap);
  };

  const message = error || sdkError;

  return (
    <div className="space-y-2">
      <label className="label">도착지</label>
      <button
        type="button"
        className="btn-secondary"
        onClick={openAddressSearch}
        disabled={!sdkReady}
      >
        {sdkReady ? '도착지 검색' : '주소 검색 로딩 중...'}
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
      <div id="postcode-layer" className="overflow-hidden rounded-lg border border-slate-200" />
      {message ? <p className="text-xs text-red-700">{message}</p> : null}
    </div>
  );
};
