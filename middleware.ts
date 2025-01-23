// middleware.ts
import { NextResponse } from 'next/server'

import { withAuth } from 'next-auth/middleware'

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token
    const url = req.nextUrl.clone()

    if (!token) {
      return NextResponse.redirect(new URL('/', url.origin))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return !!token
      }
    }
  }
)

export const config = {
  matcher: ['/home']
}