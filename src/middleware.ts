// Barrera rápida por cookie de sesión para /app/*. La autorización real
// (sesión válida + suscripción + rol) la hacen los guards server-side en
// cada página — esto solo evita renders inútiles (briefing §39).
import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

export function middleware(request: NextRequest) {
  const cookie = getSessionCookie(request)
  if (!cookie) {
    const login = new URL('/login', request.url)
    return NextResponse.redirect(login)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/app/:path*', '/checkout/:path*'],
}
