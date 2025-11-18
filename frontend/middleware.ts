import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
	// Check if route requires authentication
	const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || 
		request.nextUrl.pathname.startsWith('/register')
	const isProtectedRoute = request.nextUrl.pathname.startsWith('/notes') ||
		request.nextUrl.pathname.startsWith('/shared') ||
		request.nextUrl.pathname.startsWith('/categories') ||
		request.nextUrl.pathname.startsWith('/search')

	// Allow access to auth routes without authentication
	if (isAuthRoute) {
		return NextResponse.next()
	}

	// For protected routes, check for token in cookie or header
	// In a real app, you'd verify the JWT token here
	// For now, we'll let the client-side handle auth checks
	// The API will return 401 if token is invalid

	return NextResponse.next()
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico).*)',
	],
}

