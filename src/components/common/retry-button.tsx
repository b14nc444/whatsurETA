import { Button } from '@/components/ui/button';

type Props = {
  onClick: () => void;
  label?: string;
};

export const RetryButton = ({ onClick, label = '다시 시도' }: Props) => (
  <Button variant="secondary" onClick={onClick}>
    {label}
  </Button>
);
