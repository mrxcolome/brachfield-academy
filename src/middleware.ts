// Barrera rápida por cookie de sesión para /app/* y /checkout. La
// autorización real la hacen los guards server-side en cada página
// (briefing §39). Se comprueba la cookie por nombre (con y sin prefijo
// __Secure-) para no arrastrar dependencias al Edge Runtime.
import { NextRequest, NextResponse } from 'next/server'

const SESSION_COOKIES = ['better-auth.session_token', '__Secure-better-auth.session_token']

export function middleware(request: NextRequest) {
  const hasSession = SESSION_COOKIES.some((name) => request.cookies.has(name))
  if (!hasSession) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/app/:path*', '/checkout/:path*', '/onboarding'],
}
