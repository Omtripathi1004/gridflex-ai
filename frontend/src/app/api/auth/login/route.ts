import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_ACCOUNTS } from '@/lib/auth-constants';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body || {};

    if (!email) {
      return NextResponse.json({ detail: 'Email is required' }, { status: 400 });
    }

    // Match against default accounts
    const matched = DEFAULT_ACCOUNTS.find(
      (acc) => acc.email.toLowerCase() === email.toLowerCase()
    );

    if (matched) {
      // If demo account, check password (or accept if demo quick login)
      if (matched.password === password || password === 'demo' || !password) {
        const user = {
          id: matched.email === 'operator@gridflex.ai' ? 1 : 2,
          email: matched.email,
          full_name: matched.name,
          role: matched.role,
          organization: matched.organization,
        };
        const session_token = `gfx_jwt_${Buffer.from(JSON.stringify({ sub: user.email, role: user.role, exp: Date.now() + 86400000 })).toString('base64url')}`;
        return NextResponse.json({
          status: 'success',
          user,
          session_token,
          message: `Authenticated as ${user.full_name}`,
        });
      }
    }

    // Allow custom login for operator / researcher testing
    if (password && password.length >= 4) {
      const user = {
        id: 101,
        email,
        full_name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
        role: 'Authorized Grid Operator',
        organization: 'National Grid Operations',
      };
      const session_token = `gfx_jwt_${Buffer.from(JSON.stringify({ sub: user.email, role: user.role, exp: Date.now() + 86400000 })).toString('base64url')}`;
      return NextResponse.json({
        status: 'success',
        user,
        session_token,
        message: 'Authentication successful',
      });
    }

    return NextResponse.json(
      { detail: 'Invalid credentials. Use preset demo accounts or a valid password.' },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json({ detail: err?.message || 'Authentication error' }, { status: 500 });
  }
}
