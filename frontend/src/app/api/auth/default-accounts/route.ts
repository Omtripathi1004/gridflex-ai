import { NextResponse } from 'next/server';
import { DEFAULT_ACCOUNTS } from '@/lib/auth-constants';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(DEFAULT_ACCOUNTS);
}
