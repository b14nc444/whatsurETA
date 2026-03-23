import type { TrackResponse } from '@/types/api';
import type { DeliveryStatus, Progress } from '@/types/tracking';

type EtaContext = {
  courierName: string;
  deliveryStatus: DeliveryStatus;
  deliveryStatusText: string;
  lastProgressAt: string | null;
  lastLocation: string | null;
  progresses: Progress[];
  postalCode: string;
  baseAddress: string;
};

type EtaPayload = {
  earliestEta: string | null;
  latestEta: string | null;
  reason: string;
};

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

const parseJsonFromContent = (content: string): EtaPayload | null => {
  try {
    const parsed = JSON.parse(content) as EtaPayload;
    if (typeof parsed.reason !== 'string') return null;
    return {
      earliestEta: parsed.earliestEta ?? null,
      latestEta: parsed.latestEta ?? null,
      reason: parsed.reason
    };
  } catch {
    return null;
  }
};

export const generateEtaPrediction = async (
  context: EtaContext
): Promise<TrackResponse['prediction']> => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const model = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';
  const recentProgresses = context.progresses.slice(0, 5);

  const prompt = {
    courierName: context.courierName,
    deliveryStatus: context.deliveryStatus,
    deliveryStatusText: context.deliveryStatusText,
    lastProgressAt: context.lastProgressAt,
    lastLocation: context.lastLocation,
    destination: {
      postalCode: context.postalCode,
      baseAddress: context.baseAddress
    },
    queriedAt: new Date().toISOString(),
    progresses: recentProgresses
  };

  const response = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content:
            '택배 ETA를 추론하는 도우미입니다. 반드시 JSON만 반환하고 키는 earliestEta, latestEta, reason을 사용하세요. 확정형 단정 금지.'
        },
        {
          role: 'user',
          content: JSON.stringify({
            task: '주어진 배송 데이터로 ETA 범위 추정',
            outputSchema: {
              earliestEta: 'ISO 8601 or null',
              latestEta: 'ISO 8601 or null',
              reason: 'Korean one sentence'
            },
            constraints: [
              'reason은 1문장',
              '확정 표현 금지',
              '근거 기반 추정',
              'ETA 불가 시 earliestEta/latestEta null'
            ],
            data: prompt
          })
        }
      ]
    })
  });

  const json = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: string;
      };
    }>;
  };

  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('OPENAI_EMPTY_RESPONSE');
  }

  const parsed = parseJsonFromContent(content);
  if (!parsed) {
    throw new Error('OPENAI_PARSE_FAILED');
  }

  if (!parsed.earliestEta || !parsed.latestEta) {
    return {
      earliestEta: null,
      latestEta: null,
      reason: parsed.reason || '도착 시간 예측이 어려워요.',
      source: 'fallback',
      fallback: true
    };
  }

  return {
    earliestEta: parsed.earliestEta,
    latestEta: parsed.latestEta,
    reason: parsed.reason,
    source: 'gpt',
    fallback: false
  };
};
