import { InputField, TextInput } from '@/components/ui/input-field';

type Props = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export const TrackingInput = ({ value, onChange, error }: Props) => (
  <InputField id="trackingNumber" label="송장번호" required error={error}>
    <TextInput
      id="trackingNumber"
      type="text"
      placeholder="송장번호를 입력하세요"
      hasError={Boolean(error)}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? 'trackingNumber-message' : undefined}
      required
    />
  </InputField>
);
