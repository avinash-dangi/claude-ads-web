
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

interface Integration {
    provider: string
    status: string
    expires_at: number
}

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
            if (isConnected) {
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
                className={isConnected ? "" : "bg-blue-600 hover:bg-blue-700"}
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
    const [integrations, setIntegrations] = useState<Record<string, boolean>>({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadIntegrations()
    }, [])

    const loadIntegrations = async () => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
            setLoading(false)
            return
        }

        const { data } = await supabase
            .from('integrations')
            .select('provider, status')
            .eq('user_id', user.id)

        const statusMap: Record<string, boolean> = {}
        if (data) {
            data.forEach((integration: any) => {
                statusMap[integration.provider] = integration.status === 'active'
            })
        }
        setIntegrations(statusMap)
        setLoading(false)
    }

    const handleGoogleConnect = () => {
        window.location.href = '/api/google/auth'
    }

    const handleGoogleDisconnect = async () => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) return

        await supabase
            .from('integrations')
            .delete()
            .eq('user_id', user.id)
            .eq('provider', 'google_ads')

        setIntegrations({ ...integrations, google_ads: false })
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                </div>
            </div>
        )
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
                    isConnected={!!integrations.google_ads}
                    onConnect={handleGoogleConnect}
                    onDisconnect={handleGoogleDisconnect}
                />

                <IntegrationCard
                    title="Meta Ads"
                    description="Connect Facebook and Instagram ad accounts for automated auditing."
                    icon="📱"
                    provider="meta_ads"
                    isConnected={!!integrations.meta_ads}
                    onConnect={() => alert('Meta integration coming soon')}
                    onDisconnect={() => { }}
                />
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Why connect your accounts?</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Automatic data import - no manual entry required</li>
                    <li>• Real-time performance metrics</li>
                    <li>• One-click audits with pre-filled data</li>
                    <li>• Track improvements over time</li>
                </ul>
            </div>
        </div>
    )
}
