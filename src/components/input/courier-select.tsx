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
    <div className="relative">
      <SelectInput
        id="courierCode"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        required
      >
        <option value="">택배사를 선택해주세요.</option>
        {couriers.map((courier) => (
          <option key={courier.code} value={courier.code}>
            {courier.name}
          </option>
        ))}
      </SelectInput>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500" aria-hidden>
        <img src="/icons/dropdown.svg" alt="" className="h-5 w-5 opacity-70" />
      </span>
    </div>
  </InputField>
);
