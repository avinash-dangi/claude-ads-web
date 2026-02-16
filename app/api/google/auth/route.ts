
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const redirectUri = `${new URL(request.url).origin}/api/google/callback`;
    const scope = 'https://www.googleapis.com/auth/adwords';

    if (!clientId) {
        return NextResponse.json({ error: 'Google Client ID not configured' }, { status: 500 });
    }

    // Construct the Google Authorization URL
    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: scope,
        access_type: 'offline', // Important: to get a refresh token
        prompt: 'consent', // Force consent prompt to ensure we get a refresh token
        state: user.id // Pass user ID as state to verify on callback
    });

    const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

    return NextResponse.redirect(url);
}
