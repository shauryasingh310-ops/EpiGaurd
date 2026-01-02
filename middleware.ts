import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const middleware = (request) => {
  const langCookie = request.cookies.get('language')?.value
  const lang = langCookie || 'en'
  const response = NextResponse.next()
  response.headers.set('x-language', lang)
  return response
}

export default middleware

export const config = {
  matcher: ['/((?!_next|static|favicon.ico).*)'],
}
