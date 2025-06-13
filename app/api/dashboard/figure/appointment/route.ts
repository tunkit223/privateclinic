import { getFigureAppointmentToday } from '@/lib/actions/dashboard.action';
import { NextResponse } from 'next/server';

export async function GET() {
  const result = await getFigureAppointmentToday();
  return NextResponse.json(result);
}