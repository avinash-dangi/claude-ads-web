import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap } from 'lucide-react';

interface QuickWinsProps {
  quickWins: string[];
}

export default function QuickWins({ quickWins }: QuickWinsProps) {
  if (quickWins.length === 0) return null;

  return (
    <Card className="mb-8 bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
            <Zap className="w-6 h-6 text-yellow-900" />
          </div>
          <div>
            <CardTitle>Quick Wins</CardTitle>
            <CardDescription className="text-yellow-800">
              Easy fixes that can be implemented today
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickWins.map((win, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-4 bg-white rounded-lg border border-yellow-200 hover:border-yellow-400 transition-colors"
            >
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-yellow-400 text-yellow-900 rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
              </div>
              <p className="text-sm font-medium text-slate-900">{win}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
