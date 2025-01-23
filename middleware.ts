import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  async function middleware(req) {

    const token = req.nextauth.token;
    const url = req.nextUrl.clone()

    if (!token && url.pathname !== '/login') {
      return NextResponse.redirect(new URL('/login', url.origin));
    }

    if (token && url.pathname === '/login') {
      return NextResponse.redirect(new URL('/home', url.origin));
    }

    if (token && ['/', ''].includes(url.pathname.trim())) {
      return NextResponse.redirect(new URL('/home', url.origin));
    }

    return NextResponse.next(); 
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        return true; 
      },
    },
  }
);

export const config = {
  matcher: ['/home', '/login'], // Middleware hanya aktif di "/home" dan "/login"
};
