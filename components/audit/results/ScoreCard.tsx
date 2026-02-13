import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getGradeColor, getGradeBgColor } from '@/lib/scoring/calculate-score';
import { Progress } from '@/components/ui/progress';

interface ScoreCardProps {
  score: number;
  grade: string;
  findings: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

const gradeDescriptions = {
  A: 'Excellent - Minor optimizations only',
  B: 'Good - Some improvement opportunities',
  C: 'Fair - Notable issues need attention',
  D: 'Poor - Significant problems present',
  F: 'Critical - Urgent intervention required',
};

export default function ScoreCard({ score, grade, findings }: ScoreCardProps) {
  const description = gradeDescriptions[grade as keyof typeof gradeDescriptions] || '';

  return (
    <Card className="mb-8 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Ads Health Score</h2>
            <p className="text-blue-100">{description}</p>
          </div>
          <div className={`text-center ${getGradeBgColor(grade)} rounded-2xl px-8 py-6`}>
            <div className={`text-6xl font-bold ${getGradeColor(grade)}`}>{grade}</div>
            <div className={`text-sm font-medium ${getGradeColor(grade)} mt-1`}>Grade</div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex-1">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-6xl font-bold">{score}</span>
              <span className="text-2xl text-blue-100">/ 100</span>
            </div>
            <Progress value={score} className="h-3 bg-blue-400" />
          </div>
        </div>
      </div>

      <CardContent className="p-8">
        <div className="grid grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-1">{findings.critical}</div>
            <div className="text-sm text-slate-600">Critical Issues</div>
            <Badge variant="destructive" className="mt-2">
              Urgent
            </Badge>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-1">{findings.high}</div>
            <div className="text-sm text-slate-600">High Priority</div>
            <Badge className="mt-2 bg-orange-500">Important</Badge>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-1">{findings.medium}</div>
            <div className="text-sm text-slate-600">Medium Priority</div>
            <Badge className="mt-2 bg-yellow-500">Moderate</Badge>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">{findings.low}</div>
            <div className="text-sm text-slate-600">Low Priority</div>
            <Badge variant="secondary" className="mt-2">
              Minor
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
