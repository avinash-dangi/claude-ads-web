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
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row items-center gap-8 justify-center">
          {/* Score Circle */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Background Circle */}
            <div className="absolute inset-0 rounded-full border-[12px] border-slate-100"></div>
            {/* Progress Circle (simplified representation) */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                stroke={getColor(grade)}
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={`${score * 2.76} 276`}
                className="transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>

            <div className="text-center z-10">
              <div className="text-5xl font-bold tracking-tighter text-slate-900">{score}</div>
              <div className={`text-lg font-medium mt-1 uppercase tracking-wide ${getTextColor(grade)}`}>
                {grade}
              </div>
            </div>
          </div>

          {/* Findings Breakdown */}
          <div className="space-y-3 min-w-[200px]">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100">
              <span className="text-sm font-medium text-red-700">Critical Issues</span>
              <Badge variant="secondary" className="bg-white text-red-700 shadow-sm">{findings.critical}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-xl border border-orange-100">
              <span className="text-sm font-medium text-orange-700">High Priority</span>
              <Badge variant="secondary" className="bg-white text-orange-700 shadow-sm">{findings.high}</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl border border-yellow-100">
              <span className="text-sm font-medium text-yellow-700">Warnings</span>
              <Badge variant="secondary" className="bg-white text-yellow-700 shadow-sm">{findings.medium}</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function getColor(grade: string) {
  if (['A+', 'A', 'A-'].includes(grade)) return '#22c55e'; // Green-500
  if (['B+', 'B', 'B-'].includes(grade)) return '#3b82f6'; // Blue-500
  if (['C+', 'C', 'C-'].includes(grade)) return '#eab308'; // Yellow-500
  if (['D+', 'D', 'D-'].includes(grade)) return '#f97316'; // Orange-500
  return '#ef4444'; // Red-500
}

function getTextColor(grade: string) {
  if (['A+', 'A', 'A-'].includes(grade)) return 'text-green-600';
  if (['B+', 'B', 'B-'].includes(grade)) return 'text-blue-600';
  if (['C+', 'C', 'C-'].includes(grade)) return 'text-yellow-600';
  if (['D+', 'D', 'D-'].includes(grade)) return 'text-orange-600';
  return 'text-red-600';
}
