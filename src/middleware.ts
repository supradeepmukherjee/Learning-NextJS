import { NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
export { default } from 'next-auth/middleware'

export async function middleware(request: NextRequest) {//request
    const token = await getToken({ req: request })
    const url = request.nextUrl
    if (token && (
        url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/verify') ||
        url.pathname.startsWith('/') ||
        url.pathname.startsWith('/sign-up')
    )) return NextResponse.redirect(new URL('/dashboard', request.url))
}

export const config = {
    matcher: ['/sign-in', '/sign-up', '/', '/dashboard/:path*', '/verify/:path*']
}