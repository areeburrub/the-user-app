import { NextRequest, NextResponse } from 'next/server';
import { decryptAccessToken } from '@/lib/session';
import { cookies } from 'next/headers';

// Specify protected and public routes
const protectedRoutes = ['/profile'];
const adminRoutes = ['/admin'];
const publicRoutes = ['/login', '/signup', '/'];

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(path);
    const isAdminRoute = adminRoutes.includes(path);

    let session; // Will store session if access token is valid
    const response = NextResponse.next();

    const accessToken = cookies().get('falcon-assignment-access-token')?.value;

    if (accessToken) {
        // Attempt to decrypt the access token from the cookie
        session = await decryptAccessToken(accessToken);
    }

    // Redirect to /login if it is admin routes
    if (isAdminRoute && !session?.isAdmin && !session?.userId) {
        return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    // Redirect to /login if the user is not authenticated and route is protected
    if (isProtectedRoute && !session?.userId) {
        return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    // Redirect to /dashboard if the user is authenticated and on a login page
    if (path === '/login' && session?.userId) {
        return NextResponse.redirect(new URL('/profile', req.nextUrl));
    }

    return response;
}

// Routes Middleware should not run on
export const config = {
    matcher: [
        {
            source: '/((?!api|_next/static|_next/image|.*\\.png$).*)',
            missing: [
                { type: "header", key: "next-router-prefetch" },
                { type: "header", key: "next-action" },
                { type: "header", key: "purpose", value: "prefetch" },
            ],
        }
    ]
};
