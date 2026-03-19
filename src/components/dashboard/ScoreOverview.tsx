import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreRing } from "@/components/ScoreRing";
import type { AnalysisResult } from "@/lib/api/analysis";

export function ScoreOverview({ analysis }: { analysis: AnalysisResult }) {
  return (
    <div className="grid md:grid-cols-6 gap-6 mb-8">
      <Card className="md:col-span-2 border-border/50">
        <CardContent className="p-6 flex flex-col items-center justify-center">
          <ScoreRing score={analysis.overall_score || 0} size={140} strokeWidth={10} />
          <p className="mt-3 text-sm font-semibold">Overall UX Score</p>
        </CardContent>
      </Card>
      <Card className="md:col-span-4 border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Sub-Scores</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <ScoreRing score={analysis.navigation_clarity_score || 0} size={72} strokeWidth={5} label="Navigation" />
            <ScoreRing score={analysis.information_hierarchy_score || 0} size={72} strokeWidth={5} label="Hierarchy" />
            <ScoreRing score={analysis.feedback_visibility_score || 0} size={72} strokeWidth={5} label="Feedback" />
            <ScoreRing score={analysis.error_prevention_score || 0} size={72} strokeWidth={5} label="Error Prev." />
            <ScoreRing score={analysis.interaction_efficiency_score || 0} size={72} strokeWidth={5} label="Efficiency" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
