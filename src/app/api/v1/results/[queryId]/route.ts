import { NextResponse } from 'next/server';
import { ERROR_MESSAGES } from '@/lib/constants';
import { getResultById } from '@/lib/result-store';

type Params = {
  params: Promise<{ queryId: string }>;
};

export async function GET(_request: Request, { params }: Params) {
  const { queryId } = await params;
  const data = getResultById(queryId);

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
