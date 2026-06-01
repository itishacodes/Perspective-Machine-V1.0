import { clerkMiddleware } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Env-guarded: Clerk only intercepts requests once BOTH keys are present.
// Until then the app runs normally (session-scoped) so nothing breaks.
const enabled = !!process.env.CLERK_SECRET_KEY && !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

export default enabled ? clerkMiddleware() : function () { return NextResponse.next() }

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for Clerk's auto-proxy path
    '/__clerk/(.*)',
    '/(api|trpc)(.*)',
  ],
}
