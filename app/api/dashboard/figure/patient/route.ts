import { getFigurePatientToday } from '@/lib/actions/dashboard.action';
import { NextResponse } from 'next/server';

export async function GET() {
  const result = await getFigurePatientToday();
  return NextResponse.json(result);
}