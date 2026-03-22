import type { Courier } from '@/types/courier';

type Props = {
  couriers: Courier[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export const CourierSelect = ({ couriers, value, onChange, disabled }: Props) => (
  <div>
    <label className="label" htmlFor="courierCode">
      택배사
    </label>
    <select
      id="courierCode"
      className="input"
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
    </select>
  </div>
);
