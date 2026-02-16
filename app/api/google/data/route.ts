import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { fetchGoogleAdsData } from '@/lib/google-ads/fetcher';

export async function POST(request: NextRequest) {
    const supabase = await createClient();
    
    if (!supabase) {
        return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { customerId } = body;

    if (!customerId) {
        return NextResponse.json({ error: 'Customer ID required' }, { status: 400 });
    }

    try {
        const data = await fetchGoogleAdsData(user.id, customerId);
        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching Google Ads data:', error);
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
}
