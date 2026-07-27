import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true }, { status: 200 });
  
  // Clear the cookie by setting maxAge to 0
  response.cookies.set({
    name: 'admin_session',
    value: '',
    httpOnly: true,
    path: '/',
    maxAge: 0
  });

  return response;
}
