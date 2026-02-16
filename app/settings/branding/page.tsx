
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { Save, Upload, Loader2, CheckCircle2 } from 'lucide-react'

interface AgencySettings {
    agency_name: string
    agency_website: string
    agency_logo_url: string
    report_footer: string
}

export default function BrandingPage() {
    const [settings, setSettings] = useState<AgencySettings>({
        agency_name: '',
        agency_website: '',
        agency_logo_url: '',
        report_footer: '',
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        loadSettings()
    }, [])

    const loadSettings = async () => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
            setLoading(false)
            return
        }

        const { data } = await supabase
            .from('user_settings')
            .select('*')
            .eq('user_id', user.id)
            .single()

        if (data) {
            setSettings({
                agency_name: data.agency_name || '',
                agency_website: data.agency_website || '',
                agency_logo_url: data.agency_logo_url || '',
                report_footer: data.report_footer || '',
            })
        }
        setLoading(false)
    }

    const handleSave = async () => {
        setSaving(true)
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
            setSaving(false)
            return
        }

        const { error } = await supabase
            .from('user_settings')
            .upsert({
                user_id: user.id,
                ...settings,
            }, { onConflict: 'user_id' })

        setSaving(false)
        if (!error) {
            setSaved(true)
            setTimeout(() => setSaved(false), 2000)
        }
    }

    const handleLogoUpload = () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.onchange = (e: any) => {
            const file = e.target.files[0]
            if (file) {
                const reader = new FileReader()
                reader.onloadend = () => {
                    setSettings({ ...settings, agency_logo_url: reader.result as string })
                }
                reader.readAsDataURL(file)
            }
        }
        input.click()
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-12 max-w-2xl">
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <h1 className="text-3xl font-bold mb-2">Branding Settings</h1>
            <p className="text-slate-600 mb-8">Customize how your reports look when shared with clients.</p>

            <div className="space-y-6">
                {/* Logo Upload */}
                <Card>
                    <CardHeader>
                        <CardTitle>Agency Logo</CardTitle>
                        <CardDescription>Upload your agency logo to appear on reports</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4">
                            <div className="w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center bg-slate-50">
                                {settings.agency_logo_url ? (
                                    <img src={settings.agency_logo_url} alt="Logo" className="w-full h-full object-contain p-2" />
                                ) : (
                                    <Upload className="w-8 h-8 text-slate-400" />
                                )}
                            </div>
                            <Button variant="outline" onClick={handleLogoUpload}>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Logo
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Agency Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Agency Information</CardTitle>
                        <CardDescription>Details that appear on your reports</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="agencyName">Agency Name</Label>
                            <Input
                                id="agencyName"
                                placeholder="Your Agency Name"
                                value={settings.agency_name}
                                onChange={(e) => setSettings({ ...settings, agency_name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="agencyWebsite">Website</Label>
                            <Input
                                id="agencyWebsite"
                                placeholder="https://youragency.com"
                                value={settings.agency_website}
                                onChange={(e) => setSettings({ ...settings, agency_website: e.target.value })}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Report Footer */}
                <Card>
                    <CardHeader>
                        <CardTitle>Report Footer</CardTitle>
                        <CardDescription>Custom text to appear at the bottom of each report page</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <textarea
                            className="w-full p-3 border rounded-md min-h-[100px]"
                            placeholder="e.g., Powered by [Your Agency] | www.youragency.com"
                            value={settings.report_footer}
                            onChange={(e) => setSettings({ ...settings, report_footer: e.target.value })}
                        />
                    </CardContent>
                </Card>

                {/* Preview */}
                <Card className="bg-slate-50">
                    <CardHeader>
                        <CardTitle>Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="border bg-white p-6 rounded-lg">
                            <div className="flex items-center gap-4 mb-4">
                                {settings.agency_logo_url && (
                                    <img src={settings.agency_logo_url} alt="Logo" className="h-12 w-auto" />
                                )}
                                <div>
                                    <div className="font-bold">{settings.agency_name || 'Your Agency Name'}</div>
                                    <div className="text-sm text-slate-500">{settings.agency_website || 'yourwebsite.com'}</div>
                                </div>
                            </div>
                            <div className="text-sm text-slate-400 border-t pt-4 mt-4">
                                {settings.report_footer || 'Default footer text'}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Save Button */}
                <div className="flex items-center gap-4">
                    <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
                        {saving ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : saved ? (
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                        ) : (
                            <Save className="w-4 h-4 mr-2" />
                        )}
                        {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Settings'}
                    </Button>
                </div>
            </div>
        </div>
    )
}
