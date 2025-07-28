import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)']); 

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // If route is protected and user not logged in, redirect to sign-in
  if (isProtectedRoute(req) && !userId) {
    const signInUrl = new URL('/sign-in', req.url);
    signInUrl.searchParams.set('redirect_url', req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Allow all other requests
  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)'], 
  
};
