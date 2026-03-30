import { InputField, TextInput } from '@/components/ui/input-field';

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
        placeholder="숫자만 입력해주세요"
        className="pr-11"
        hasError={Boolean(error)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'trackingNumber-message' : undefined}
        required
      />
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500" aria-hidden>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.7" />
          <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      </span>
    </div>
  </InputField>
);
