type Props = {
  onClick: () => void;
  label?: string;
};

export const RetryButton = ({ onClick, label = '다시 시도' }: Props) => (
  <button type="button" className="btn-secondary" onClick={onClick}>
    {label}
  </button>
);
