import { createClient } from '@/lib/supabase/server';

interface GoogleTokens {
    access_token: string;
    refresh_token: string;
    expires_at: number;
}

export async function getGoogleAdsTokens(userId: string): Promise<string | null> {
    const supabase = await createClient();

    if (!supabase) return null;

    const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .eq('user_id', userId)
        .eq('provider', 'google_ads')
        .single();

    if (error || !data) return null;

    if (Date.now() > data.expires_at) {
        return await refreshAccessToken(userId, data.refresh_token);
    }

    return data.access_token;
}

async function refreshAccessToken(userId: string, refreshToken: string): Promise<string | null> {
    try {
        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: process.env.GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
            }),
        });

        const tokens = await response.json();

        if (!response.ok) throw new Error(tokens.error_description || 'Failed to refresh token');

        const supabase = await createClient();

        if (!supabase) return null;

        await supabase
            .from('integrations')
            .update({
                access_token: tokens.access_token,
                expires_at: Date.now() + (tokens.expires_in * 1000),
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId)
            .eq('provider', 'google_ads');

        return tokens.access_token;
    } catch (error) {
        console.error('Error refreshing token:', error);
        return null;
    }
}
