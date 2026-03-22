'use client';

type Destination = {
  postalCode: string;
  baseAddress: string;
  detailAddress: string;
};

type Props = {
  value: Destination;
  onChange: (value: Destination) => void;
  error?: string;
};

export const DestinationPicker = ({ value, onChange, error }: Props) => {
  const openAddressSearch = () => {
    const baseAddress = window.prompt('도로명 주소를 입력해주세요.', value.baseAddress);
    if (!baseAddress) return;

    const postalCode = window.prompt('우편번호를 입력해주세요.', value.postalCode);
    if (!postalCode) return;

    onChange({
      ...value,
      baseAddress,
      postalCode
    });
  };

  return (
    <div className="space-y-2">
      <label className="label">도착지</label>
      <button type="button" className="btn-secondary" onClick={openAddressSearch}>
        도착지 검색
      </button>
      <input
        className="input"
        value={value.postalCode}
        placeholder="우편번호"
        onChange={(e) => onChange({ ...value, postalCode: e.target.value })}
      />
      <input
        className="input"
        value={value.baseAddress}
        placeholder="기본주소"
        onChange={(e) => onChange({ ...value, baseAddress: e.target.value })}
      />
      <input
        className="input"
        value={value.detailAddress ?? ''}
        placeholder="상세주소 (선택)"
        onChange={(e) => onChange({ ...value, detailAddress: e.target.value })}
      />
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
    </div>
  );
};
