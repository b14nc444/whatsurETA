export type PredictionSource = 'gpt' | 'fallback';

export type Prediction = {
  earliestEta: string | null;
  latestEta: string | null;
  reason: string;
  source: PredictionSource;
  fallback: boolean;
};
