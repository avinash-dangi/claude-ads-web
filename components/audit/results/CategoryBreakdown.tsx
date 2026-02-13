import { AuditReport } from '@/types/audit';
import { googleAdsAudit } from '@/data/checklists/google-ads';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface CategoryBreakdownProps {
  report: AuditReport;
}

export default function CategoryBreakdown({ report }: CategoryBreakdownProps) {
  // Group results by category
  const categoryStats = googleAdsAudit.categories.map((category) => {
    const categoryChecks = googleAdsAudit.checks.filter((c) => c.category === category.name);
    const categoryResults = report.results.filter((r) =>
      categoryChecks.some((c) => c.id === r.checkId)
    );

    const passed = categoryResults.filter((r) => r.status === 'pass').length;
    const warnings = categoryResults.filter((r) => r.status === 'warning').length;
    const failed = categoryResults.filter((r) => r.status === 'fail').length;
    const total = categoryResults.length;

    // Calculate score (pass = 100%, warning = 50%, fail = 0%)
    const score = total > 0
      ? Math.round(((passed * 100 + warnings * 50) / (total * 100)) * 100)
      : 0;

    return {
      category,
      passed,
      warnings,
      failed,
      total,
      score,
    };
  });

  // Sort by score (lowest first to prioritize)
  const sortedStats = [...categoryStats].sort((a, b) => a.score - b.score);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-green-600';
    if (score >= 75) return 'bg-blue-600';
    if (score >= 60) return 'bg-yellow-600';
    if (score >= 40) return 'bg-orange-600';
    return 'bg-red-600';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Category Performance</CardTitle>
          <CardDescription>
            Performance breakdown by audit category (sorted by priority)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {sortedStats.map((stat) => (
              <div key={stat.category.name} className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-semibold">{stat.category.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {stat.category.weight * 100}% weight
                      </Badge>
                    </div>
                    {stat.category.description && (
                      <p className="text-sm text-slate-600">{stat.category.description}</p>
                    )}
                  </div>
                  <div className={`text-3xl font-bold ${getScoreColor(stat.score)}`}>
                    {stat.score}%
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <Progress value={stat.score} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>
                      {stat.passed} passed • {stat.warnings} warnings • {stat.failed} failed
                    </span>
                    <span>
                      {stat.passed + stat.warnings} / {stat.total} checks
                    </span>
                  </div>
                </div>

                {/* Visual Breakdown */}
                <div className="flex gap-2">
                  {stat.passed > 0 && (
                    <div className="flex items-center gap-1 text-xs">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>{stat.passed} pass</span>
                    </div>
                  )}
                  {stat.warnings > 0 && (
                    <div className="flex items-center gap-1 text-xs">
                      <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                      <span>{stat.warnings} warning</span>
                    </div>
                  )}
                  {stat.failed > 0 && (
                    <div className="flex items-center gap-1 text-xs">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span>{stat.failed} fail</span>
                    </div>
                  )}
                </div>

                {/* Divider */}
                {stat !== sortedStats[sortedStats.length - 1] && (
                  <div className="border-b border-slate-200 mt-2"></div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {sortedStats.filter((s) => s.score >= 75).length}
              </div>
              <div className="text-sm text-slate-600">Categories Performing Well</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {sortedStats.filter((s) => s.score >= 50 && s.score < 75).length}
              </div>
              <div className="text-sm text-slate-600">Need Improvement</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {sortedStats.filter((s) => s.score < 50).length}
              </div>
              <div className="text-sm text-slate-600">Critical Attention Required</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
