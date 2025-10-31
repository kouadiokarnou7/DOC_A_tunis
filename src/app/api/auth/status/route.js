// src/app/api/auth/status/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Minimal placeholder auth status endpoint.
// Replace with real session/token verification as needed.
export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('sessionUser')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ isAuthenticated: false, user: null }, { status: 200 });
    }

    let user = null;
    try {
      user = JSON.parse(sessionCookie);
    } catch {
      // invalid cookie; treat as unauthenticated
      return NextResponse.json({ isAuthenticated: false, user: null }, { status: 200 });
    }

    return NextResponse.json({ isAuthenticated: true, user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ isAuthenticated: false, user: null, error: 'Unable to determine auth status' }, { status: 200 });
  }
}
