
'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface IntegrationCardProps {
    title: string
    description: string
    icon: React.ReactNode
    provider: 'google_ads' | 'meta_ads'
    isConnected: boolean
    onConnect: () => void
    onDisconnect: () => void
}

function IntegrationCard({
    title,
    description,
    icon,
    provider,
    isConnected,
    onConnect,
    onDisconnect
}: IntegrationCardProps) {
    const [loading, setLoading] = useState(false)

    const handleAction = async () => {
        setLoading(true)
        try {
            if (isConnected) {
                await onDisconnect()
            } else {
                await onConnect()
            }
        } catch (error) {
            console.error('Integration action failed:', error)
        } finally {
            // Keep loading true if we're redirecting to prevent multi-clicks
            if (!isConnected) {
                // for connect actions that redirect, we might not want to stop loading
            } else {
                setLoading(false)
            }
        }
    }

    return (
        <div className="border rounded-lg p-6 flex items-start justify-between bg-white shadow-sm">
            <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-2xl">
                    {icon}
                </div>
                <div>
                    <h3 className="font-semibold text-lg">{title}</h3>
                    <p className="text-slate-500 text-sm mb-2">{description}</p>
                    {isConnected ? (
                        <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                            <CheckCircle2 className="w-4 h-4" />
                            Connected
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            Not Connected
                        </div>
                    )}
                </div>
            </div>
            <Button
                variant={isConnected ? "outline" : "default"}
                onClick={handleAction}
                disabled={loading}
            >
                {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : isConnected ? (
                    'Disconnect'
                ) : (
                    'Connect'
                )}
            </Button>
        </div>
    )
}

export default function IntegrationsPage() {
    const [integrations, setIntegrations] = useState<{ google_ads: boolean }>({ google_ads: false })
    const supabase = createClient()

    // In a real app, fetch initial state from DB

    const handleGoogleConnect = () => {
        // Redirect to our API route that starts the Google OAuth flow
        window.location.href = '/api/google/auth'
    }

    const handleGoogleDisconnect = async () => {
        // Call API to remove integration
        alert('Disconnect logic to be implemented')
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-3xl font-bold mb-2">Integrations</h1>
            <p className="text-slate-600 mb-8">Connect your ad accounts to automatically import performance data.</p>

            <div className="grid gap-6">
                <IntegrationCard
                    title="Google Ads"
                    description="Import campaigns, ad groups, and performance metrics directly from Google."
                    icon="🔍"
                    provider="google_ads"
                    isConnected={integrations.google_ads}
                    onConnect={handleGoogleConnect}
                    onDisconnect={handleGoogleDisconnect}
                />

                <IntegrationCard
                    title="Meta Ads"
                    description="Connect Facebook and Instagram ad accounts for automated auditing."
                    icon="📱"
                    provider="meta_ads"
                    isConnected={false}
                    onConnect={() => alert('Meta integration coming soon')}
                    onDisconnect={() => { }}
                />
            </div>
        </div>
    )
}
