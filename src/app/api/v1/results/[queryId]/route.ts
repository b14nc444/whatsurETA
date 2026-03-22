import { NextResponse } from 'next/server';
import { ERROR_MESSAGES } from '@/lib/constants';
import { getResultById } from '@/lib/result-store';

export const runtime = 'nodejs';

type Params = {
  params: Promise<{ queryId: string }>;
};

export async function GET(_request: Request, { params }: Params) {
  const { queryId } = await params;
  let data = null;
  try {
    data = await getResultById(queryId);
  } catch {
    return NextResponse.json(
      {
        error: {
          code: 'SYSTEM_ERROR',
          message: ERROR_MESSAGES.SYSTEM_ERROR
        }
      },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      {
        error: {
          code: 'NOT_FOUND',
          message: ERROR_MESSAGES.NOT_FOUND
        }
      },
      { status: 404 }
    );
  }

  return NextResponse.json(data);
}
