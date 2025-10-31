import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ success: true }, { status: 200 });
  // clear session cookie
  res.cookies.set('sessionUser', '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    expires: new Date(0),
  });
  return res;
}


