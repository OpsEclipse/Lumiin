import {
	clerkMiddleware,
	createRouteMatcher,
} from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isPublicRoute = createRouteMatcher([
	'/',
	'/sign-in(.*)',
	'/sign-up(.*)',
	'/api/webhooks(.*)',
]);

const isOnboardingRoute = createRouteMatcher(['/onboarding(.*)']);
const isApiRoute = createRouteMatcher(['/api(.*)']);

export default clerkMiddleware(async (auth, request) => {
	const { userId, sessionClaims } = await auth();

	// Public routes - no auth required
	if (isPublicRoute(request)) {
		return NextResponse.next();
	}

	// Redirect /session to /dashboard (legacy route cleanup)
	if (request.nextUrl.pathname === '/session') {
		return NextResponse.redirect(
			new URL('/dashboard', request.url)
		);
	}

	// Protect non-public routes
	if (!userId) {
		await auth.protect();
		return NextResponse.next();
	}

	// Skip onboarding check for API routes and onboarding page itself
	if (isApiRoute(request) || isOnboardingRoute(request)) {
		return NextResponse.next();
	}

	// Check if user has completed onboarding via Clerk public metadata
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const publicMetadata =
		(sessionClaims as any)?.public_metadata ??
		(sessionClaims as any)?.publicMetadata;
	const onboarded = publicMetadata?.onboarded === true;

	// If not onboarded, redirect to onboarding
	if (!onboarded) {
		const onboardingUrl = new URL('/onboarding', request.url);
		return NextResponse.redirect(onboardingUrl);
	}

	return NextResponse.next();
});

export const config = {
	matcher: [
		// Skip Next.js internals and static files
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		// Always run for API routes
		'/(api|trpc)(.*)',
	],
};
