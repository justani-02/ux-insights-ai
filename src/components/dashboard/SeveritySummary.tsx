import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, ExternalLink } from "lucide-react";
import type { AnalysisResult } from "@/lib/api/analysis";

export function SeveritySummary({ analysis }: { analysis: AnalysisResult }) {
  const highCount = analysis.heuristic_results.filter((v) => v.severity === "High").length;
  const medCount = analysis.heuristic_results.filter((v) => v.severity === "Medium").length;
  const lowCount = analysis.heuristic_results.filter((v) => v.severity === "Low").length;

  return (
    <div className="grid md:grid-cols-2 gap-6 mb-8">
      {analysis.summary && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-primary" /> UX Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">{analysis.summary}</p>
            <div className="flex gap-4 mt-4 text-sm">
              <span className="text-[hsl(var(--severity-high))] font-medium">{highCount} High</span>
              <span className="text-[hsl(var(--severity-medium))] font-medium">{medCount} Medium</span>
              <span className="text-[hsl(var(--severity-low))] font-medium">{lowCount} Low</span>
            </div>
          </CardContent>
        </Card>
      )}
      {analysis.screenshot_url && (
        <Card className="border-border/50 overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Screenshot</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <img
              src={analysis.screenshot_url}
              alt={`Screenshot of ${analysis.url}`}
              className="w-full h-auto max-h-64 object-cover object-top"
              loading="lazy"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
