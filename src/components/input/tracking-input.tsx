type Props = {
  value: string;
  onChange: (value: string) => void;
  error?: string;
};

export const TrackingInput = ({ value, onChange, error }: Props) => (
  <div>
    <label className="label" htmlFor="trackingNumber">
      송장번호
    </label>
    <input
      id="trackingNumber"
      className="input"
      type="text"
      placeholder="송장번호를 입력하세요"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? 'tracking-error' : undefined}
      required
    />
    {error ? (
      <p id="tracking-error" className="mt-1 text-xs text-red-700">
        {error}
      </p>
    ) : null}
  </div>
);
