import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp, Clock } from 'lucide-react';

interface ActionPlanProps {
  actionPlan: Array<{
    priority: number;
    action: string;
    platform: string;
    impact: string;
    effort: 'low' | 'medium' | 'high';
  }>;
}

const effortColors = {
  low: 'bg-green-100 text-green-700 border-green-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
};

const effortLabels = {
  low: 'Quick Win',
  medium: 'Moderate Effort',
  high: 'Major Project',
};

export default function ActionPlan({ actionPlan }: ActionPlanProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Prioritized Action Plan
        </CardTitle>
        <CardDescription>
          Follow these steps in order to maximize impact on your ad performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {actionPlan.map((item) => (
            <div
              key={item.priority}
              className="relative p-6 bg-white border-2 border-slate-200 rounded-lg hover:border-blue-300 transition-colors"
            >
              {/* Priority Badge */}
              <div className="absolute -top-3 -left-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                  {item.priority}
                </div>
              </div>

              <div className="ml-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-2">{item.action}</h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline">{item.platform}</Badge>
                      <Badge className={effortColors[item.effort]}>
                        <Clock className="w-3 h-3 mr-1" />
                        {effortLabels[item.effort]}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Impact */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-green-900 mb-1">Expected Impact</p>
                      <p className="text-sm text-green-800">{item.impact}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">💡 Pro Tip:</span> Start with the top 3 priorities for
            the biggest immediate impact. Low-effort items can typically be completed within a day.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
