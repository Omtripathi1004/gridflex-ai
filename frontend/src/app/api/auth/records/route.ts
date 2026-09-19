import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const MOCK_LOGIN_RECORDS = [
  {
    id: 101,
    user_id: 1,
    email: 'operator@gridflex.ai',
    full_name: 'Rajesh Sharma',
    role: 'DISCOM Operations Lead',
    login_time: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    ip_address: '103.211.54.18 (Mumbai NOC)',
    status: 'SUCCESS'
  },
  {
    id: 102,
    user_id: 2,
    email: 'judge@gridflex.ai',
    full_name: 'Dr. Priya Sundaram',
    role: 'Hackathon Evaluator & Judge',
    login_time: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    ip_address: '14.139.128.2 (IIT Madras Jury Desk)',
    status: 'SUCCESS'
  },
  {
    id: 103,
    user_id: 3,
    email: 'officer@gridflex.ai',
    full_name: 'Vikram Patel',
    role: 'Grid Resilience Officer',
    login_time: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    ip_address: '115.112.87.10 (NLDC Delhi)',
    status: 'SUCCESS'
  },
  {
    id: 104,
    user_id: 4,
    email: 'community@gridflex.ai',
    full_name: 'Ananya Sen',
    role: 'Microgrid Coordinator',
    login_time: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    ip_address: '122.176.43.91 (Bengaluru BESCOM Node)',
    status: 'SUCCESS'
  }
];

export async function GET() {
  return NextResponse.json({
    total: MOCK_LOGIN_RECORDS.length,
    records: MOCK_LOGIN_RECORDS,
    database: 'SQLite (backend/app/data/gridflex.db) & Vercel Memory Cache'
  });
}
