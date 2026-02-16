import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
        return NextResponse.redirect(new URL('/settings/integrations?error=' + error, request.url));
    }

    if (!code) {
        return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    const supabase = await createClient();
    
    if (!supabase) {
        return NextResponse.redirect(new URL('/settings/integrations?error=supabase_not_configured', request.url));
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.id !== state) {
        return NextResponse.redirect(new URL('/settings/integrations?error=unauthorized', request.url));
    }

    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            code,
            client_id: process.env.GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            redirect_uri: `${new URL(request.url).origin}/api/google/callback`,
            grant_type: 'authorization_code',
        }),
    });

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok) {
        console.error('Failed to exchange token', tokens);
        return NextResponse.redirect(new URL('/settings/integrations?error=token_exchange_failed', request.url));
    }

    const { error: dbError } = await supabase
        .from('integrations')
        .upsert({
            user_id: user?.id,
            provider: 'google_ads',
            refresh_token: tokens.refresh_token,
            access_token: tokens.access_token,
            expires_at: Date.now() + (tokens.expires_in * 1000),
            status: 'active',
            updated_at: new Date().toLocaleDateString()
        }, { onConflict: 'user_id, provider' });

    if (dbError) {
        console.error('Database error', dbError);
        return NextResponse.redirect(new URL('/settings/integrations?error=db_error', request.url));
    }

    return NextResponse.redirect(new URL('/settings/integrations?success=true', request.url));
}
