
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
                        <h1 className="text-3xl font-bold mb-2">Audit Dashboard</h1>
                        <p className="text-slate-600">Welcome back, {user.user_metadata.full_name}</p>
                    </div>
                    <Link href="/audit">
                        <Button className="gap-2">
                            <Play className="w-4 h-4" />
                            New Audit
                        </Button>
                    </Link>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Total Audits</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{audits?.length || 0}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Average Score</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {audits?.length
                                    ? Math.round(audits.reduce((acc, curr) => acc + curr.score, 0) / audits.length)
                                    : '-'}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-slate-500">Latest Platform</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold capitalize">
                                {audits?.[0]?.platform || '-'}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Audits */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Audits</CardTitle>
                        <CardDescription>History of your ad account analyses</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!audits?.length ? (
                            <div className="text-center py-12">
                                <FileText className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                                <h3 className="text-lg font-medium text-slate-900 mb-2">No audits yet</h3>
                                <p className="text-slate-500 mb-6">Start your first audit to see results here.</p>
                                <Link href="/audit">
                                    <Button>Start Audit</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {audits.map((audit) => (
                                    <div
                                        key={audit.id}
                                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-slate-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold
                        ${audit.score >= 90 ? 'bg-green-100 text-green-700' :
                                                    audit.score >= 75 ? 'bg-blue-100 text-blue-700' :
                                                        audit.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'}`}
                                            >
                                                {audit.score}
                                            </div>
                                            <div>
                                                <div className="font-semibold capitalize flex items-center gap-2">
                                                    {audit.platform} Audit
                                                    {audit.project_name && (
                                                        <Badge variant="outline" className="font-normal">
                                                            {audit.project_name}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="text-sm text-slate-500 flex items-center gap-2">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDistanceToNow(new Date(audit.created_at), { addSuffix: true })}
                                                </div>
                                            </div>
                                        </div>

                                        <Link href={`/results/${audit.id}`}>
                                            <Button variant="ghost" size="sm" className="gap-2">
                                                View Report
                                                <ArrowRight className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
