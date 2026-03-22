import { NextResponse } from 'next/server';
import { MOCK_COURIERS } from '@/lib/mock-data';

export async function GET() {
  return NextResponse.json({
    couriers: MOCK_COURIERS,
    updatedAt: new Date().toISOString()
  });
}
