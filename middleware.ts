import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAuth } from "@/lib/actions/admin.actions";

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    if (path.startsWith('/admin')) {
        const hasSession = await checkAdminAuth();
        if(!hasSession) {
            const url = new URL('/login', request.url);
            return NextResponse.redirect(url);
        }
    } else if(path.startsWith('/login')) {
        const hasSession = await checkAdminAuth();
        if(hasSession) {
            const url = new URL('/admin', request.url);
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

// Configure which paths this middleware will run on
export const config = {
    matcher: [
        '/admin/:path*',
        '/login/:path*',
    ],
};