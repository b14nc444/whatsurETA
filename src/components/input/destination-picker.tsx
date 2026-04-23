"use client";

import { InputField, inputControlClassName } from "@/components/ui/input-field";
import { cn } from "@/lib/cn";
import { useCallback, useState } from "react";

const DAUM_POSTCODE_SCRIPT_URL =
  "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
const DAUM_POSTCODE_SCRIPT_ID = "daum-postcode-sdk";

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
  const [isOpening, setIsOpening] = useState(false);
  const [sdkError, setSdkError] = useState<string>("");

  const loadPostcodeSdk = useCallback(async (): Promise<void> => {
    if (typeof window === "undefined") return;
    if (window.daum?.Postcode) {
      return;
    }

    await new Promise<void>((resolve, reject) => {
      const existingScript = document.getElementById(
        DAUM_POSTCODE_SCRIPT_ID,
      ) as HTMLScriptElement | null;
      if (existingScript) {
        const onLoad = () => resolve();
        const onError = () => reject(new Error("SDK_LOAD_FAILED"));
        existingScript.addEventListener("load", onLoad, { once: true });
        existingScript.addEventListener("error", onError, { once: true });
        return;
      }

      const script = document.createElement("script");
      script.id = DAUM_POSTCODE_SCRIPT_ID;
      script.src = DAUM_POSTCODE_SCRIPT_URL;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("SDK_LOAD_FAILED"));
      document.head.appendChild(script);
    });

    if (!window.daum?.Postcode) {
      throw new Error("SDK_NOT_READY");
    }
  }, []);

  const openAddressSearch = async () => {
    setSdkError("");

    try {
      setIsOpening(true);
      await loadPostcodeSdk();
      if (!window.daum?.Postcode) {
        throw new Error("SDK_NOT_READY");
      }

      new window.daum.Postcode({
        oncomplete: (data) => {
          const baseAddress =
            data.roadAddress || data.address || data.jibunAddress || "";
          onChange({
            postalCode: data.zonecode ?? "",
            baseAddress,
          });
        },
      }).open();
    } catch {
      setSdkError("주소 검색 준비 중이에요. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsOpening(false);
    }
  };

  const message = error || sdkError;
  const displayText =
    value.baseAddress ||
    (isOpening ? "주소 검색 준비 중..." : "도착지를 검색해주세요.");

  return (
    <InputField id="destination" label="도착지" required error={message}>
      <button
        id="destination"
        type="button"
        className={cn(
          inputControlClassName,
          "flex items-center justify-between text-left",
          value.baseAddress
            ? "bg-[#155DFC1A] text-neutral-950 outline-[#155DFC66]"
            : "text-neutral-950/50",
          message &&
            "bg-neutral-0 outline-rose-500 hover:outline-rose-500 focus:outline-rose-500",
        )}
        onClick={openAddressSearch}
        disabled={isOpening}
        aria-invalid={Boolean(message)}
        aria-describedby={message ? "destination-message" : undefined}>
        <span className="truncate pr-4">{displayText}</span>
        <span className="shrink-0 text-neutral-500" aria-hidden>
          <img src="/icons/search.svg" alt="" className="h-5 w-5 opacity-75" />
        </span>
      </button>
    </InputField>
  );
};
