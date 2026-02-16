import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { Play, ArrowRight, FileText, Calendar } from 'lucide-react'

interface AuditRecord {
    id: string
    created_at: string
    platform: string
    score: number
    project_name?: string
    data: any
}

export default async function DashboardPage() {
    const supabase = await createClient()

    if (!supabase) {
        return (
            <div className="min-h-screen bg-slate-50 py-12">
                <div className="container mx-auto px-4 max-w-6xl">
                    <div className="text-center py-20">
                        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                        <p className="text-slate-600 mb-4">Configure Supabase to view your dashboard</p>
                        <Link href="/">
                            <Button>Go Home</Button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return redirect('/login')
    }

    const { data } = await supabase
        .from('audits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    const audits = (data as AuditRecord[]) || []

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                        <p className="text-slate-600">Manage your advertising audits</p>
                    </div>
                    <Link href="/audit">
                        <Button className="bg-indigo-600 hover:bg-indigo-700">
                            <Play className="w-4 h-4 mr-2" />
                            New Audit
                        </Button>
                    </Link>
                </div>

                {audits.length === 0 ? (
                    <Card className="text-center py-12">
                        <CardContent>
                            <FileText className="w-12 h-12 mx-auto text-slate-400 mb-4" />
                            <h2 className="text-xl font-semibold mb-2">No audits yet</h2>
                            <p className="text-slate-600 mb-6">Start your first advertising audit to see results here</p>
                            <Link href="/audit">
                                <Button>
                                    Start Audit
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {audits.map((audit) => (
                            <Card key={audit.id} className="hover:shadow-md transition-shadow">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${
                                            audit.score >= 90 ? 'bg-green-100 text-green-700' :
                                            audit.score >= 75 ? 'bg-blue-100 text-blue-700' :
                                            audit.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                            {audit.score}
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{audit.project_name || 'Untitled Audit'}</CardTitle>
                                            <CardDescription className="flex items-center gap-2">
                                                <Calendar className="w-3 h-3" />
                                                {formatDistanceToNow(new Date(audit.created_at), { addSuffix: true })}
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <Badge variant="outline" className="capitalize">
                                        {audit.platform}
                                    </Badge>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
