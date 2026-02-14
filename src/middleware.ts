import { type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { updateSession } from '@/utils/supabase/middleware';

const intlMiddleware = createMiddleware({
    locales: ['en', 'es'],
    defaultLocale: 'en'
});

export async function middleware(request: NextRequest) {
    // 1. Run i18n middleware first to handle locale routing
    const response = intlMiddleware(request);

    // 2. Pass the response to Supabase to handle session management
    return await updateSession(request, response);
}

export const config = {
    matcher: [
        // Enable a comprehensive matcher for i18n routing
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
