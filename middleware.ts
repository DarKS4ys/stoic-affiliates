import {
  authMiddleware,
  clerkClient,
  redirectToSignIn,
} from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export default authMiddleware({
  debug: false,

  publicRoutes: ['/sign-in', '/sign-up', '/api/webhooks/clerk'],

  afterAuth: async (auth, req, evt) => {
    // ? handle unauthenticated users
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    // ? handle users that havent finished onboarding
    if (auth.userId) {
      const user = await clerkClient.users.getUser(auth.userId);

      if (
        user?.privateMetadata.onboarding !== 4 &&
        !req.url.includes('?onboarding=true')
      ) {
        const currentUrl = new URL(req.url);
        currentUrl.searchParams.append('onboarding', 'true');
        return NextResponse.redirect(currentUrl.href);
      } else if (
        user?.privateMetadata.onboarding === 4 &&
        req.url.includes('?onboarding=true')
      ) {
        const currentUrl = new URL(req.url);
        currentUrl.searchParams.delete('onboarding', 'true');
        return NextResponse.redirect(currentUrl.href);
      }
    }

    // ? block access to public routes for signed-in users
    if (auth.userId && !auth.isPublicRoute) {
      return NextResponse.next();
    }

    // ? default behaviour (lets the operation happen)
    return NextResponse.next();
  },
});

// ? default matcher from clerk
export const config = {
  matcher: ['/((?!.+.[w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
