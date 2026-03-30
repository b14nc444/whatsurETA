import type { Courier } from '@/types/courier';
import { InputField, SelectInput } from '@/components/ui/input-field';

type Props = {
  couriers: Courier[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export const CourierSelect = ({ couriers, value, onChange, disabled }: Props) => (
  <InputField id="courierCode" label="택배사" required>
    <SelectInput
      id="courierCode"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      required
    >
      <option value="">택배사를 선택해주세요</option>
      {couriers.map((courier) => (
        <option key={courier.code} value={courier.code}>
          {courier.name}
        </option>
      ))}
    </SelectInput>
  </InputField>
);
