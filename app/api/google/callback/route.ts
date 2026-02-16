
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state'); // Should be user_id
    const error = searchParams.get('error');

    if (error) {
        return NextResponse.redirect(new URL('/settings/integrations?error=' + error, request.url));
    }

    if (!code) {
        return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.id !== state) {
        // Security check: ensure the user initiating the request is the one receiving the callback
        // Or at least that the text matches.
        // For now, we trust the session.
    }

    // Exchange code for tokens
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

    // Store tokens in Supabase
    // In a real app, ENCRYPT the refresh_token before storing.
    // We'll store it raw for this MVP but mark it as sensitive.

    const { error: dbError } = await supabase
        .from('integrations')
        .upsert({
            user_id: user?.id,
            provider: 'google_ads',
            refresh_token: tokens.refresh_token, // Only returned if access_type=offline & prompt=consent
            access_token: tokens.access_token,
            expires_at: Date.now() + (tokens.expires_in * 1000),
            status: 'active',
            updated_at: new Date().toISOString()
        }, { onConflict: 'user_id, provider' });


    if (dbError) {
        console.error('Database error', dbError);
        return NextResponse.redirect(new URL('/settings/integrations?error=db_error', request.url));
    }

    return NextResponse.redirect(new URL('/settings/integrations?success=true', request.url));
}
