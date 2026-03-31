import { InputField, TextInput } from "@/components/ui/input-field";
import { cn } from "@/lib/cn";

type Props = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export const TrackingInput = ({ value, onChange, error }: Props) => (
  <InputField id="trackingNumber" label="송장번호" required error={error}>
    <div className="relative">
      <TextInput
        id="trackingNumber"
        type="text"
        placeholder="송장번호를 입력해주세요."
        className={cn(
          "pr-11",
          value &&
            !error &&
            "bg-blue-600/10 text-neutral-950 outline-blue-600/40",
        )}
        hasError={Boolean(error)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "trackingNumber-message" : undefined}
        required
      />
      <span
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
        aria-hidden>
        <img src="/icons/write.svg" alt="" className="h-5 w-5 opacity-75" />
      </span>
    </div>
  </InputField>
);
