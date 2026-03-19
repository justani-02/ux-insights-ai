import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SeverityBadge } from "@/components/SeverityBadge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { HeuristicResult } from "@/lib/api/analysis";
import { cn } from "@/lib/utils";
import { Zap, Target, ClipboardList, ShieldX } from "lucide-react";

type Quadrant = "quick-wins" | "strategic" | "fill-ins" | "avoid";

const quadrantConfig: Record<
  Quadrant,
  { label: string; description: string; icon: typeof Zap; bg: string; border: string; accent: string; dotBg: string }
> = {
  "quick-wins": {
    label: "Quick Wins",
    description: "High Impact · Low Effort",
    icon: Zap,
    bg: "bg-[hsl(var(--severity-low))]/[0.06]",
    border: "border-[hsl(var(--severity-low))]/25",
    accent: "text-[hsl(var(--severity-low))]",
    dotBg: "bg-[hsl(var(--severity-low))]",
  },
  strategic: {
    label: "Strategic",
    description: "High Impact · High Effort",
    icon: Target,
    bg: "bg-[hsl(var(--severity-medium))]/[0.06]",
    border: "border-[hsl(var(--severity-medium))]/25",
    accent: "text-[hsl(var(--severity-medium))]",
    dotBg: "bg-[hsl(var(--severity-medium))]",
  },
  "fill-ins": {
    label: "Fill-ins",
    description: "Low Impact · Low Effort",
    icon: ClipboardList,
    bg: "bg-primary/[0.04]",
    border: "border-primary/20",
    accent: "text-primary",
    dotBg: "bg-primary",
  },
  avoid: {
    label: "Avoid",
    description: "Low Impact · High Effort",
    icon: ShieldX,
    bg: "bg-[hsl(var(--severity-high))]/[0.06]",
    border: "border-[hsl(var(--severity-high))]/25",
    accent: "text-[hsl(var(--severity-high))]",
    dotBg: "bg-[hsl(var(--severity-high))]",
  },
};

function getQuadrant(impact: string, effort: string): Quadrant {
  const highImpact = impact === "High" || impact === "Medium";
  const lowEffort = effort === "Low" || effort === "Medium";
  if (highImpact && lowEffort) return "quick-wins";
  if (highImpact && !lowEffort) return "strategic";
  if (!highImpact && lowEffort) return "fill-ins";
  return "avoid";
}

export function ImpactEffortMatrix({ results }: { results: HeuristicResult[] }) {
  const quadrants: Record<Quadrant, HeuristicResult[]> = {
    "quick-wins": [],
    strategic: [],
    "fill-ins": [],
    avoid: [],
  };

  results.forEach((r) => {
    const q = getQuadrant(r.impact || "Medium", r.effort || "Medium");
    quadrants[q].push(r);
  });

  // Layout order: top-left = quick-wins, top-right = strategic, bottom-left = fill-ins, bottom-right = avoid
  const layout: Quadrant[] = ["quick-wins", "strategic", "fill-ins", "avoid"];

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          Impact vs Effort Matrix
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        {/* Y-axis label */}
        <div className="flex gap-2">
          <div className="flex flex-col items-center justify-center w-6 shrink-0">
            <span className="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase [writing-mode:vertical-lr] rotate-180">
              Impact
            </span>
          </div>

          <div className="flex-1 space-y-1">
            {/* Y-axis markers */}
            <div className="flex justify-start pl-1 mb-0.5">
              <span className="text-[10px] text-muted-foreground font-medium">High ↑</span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 gap-2">
              {layout.map((q) => {
                const config = quadrantConfig[q];
                const Icon = config.icon;
                const count = quadrants[q].length;
                return (
                  <div
                    key={q}
                    className={cn(
                      "rounded-xl border p-3 min-h-[160px] transition-all",
                      config.bg,
                      config.border
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={cn("w-6 h-6 rounded-md flex items-center justify-center", config.dotBg + "/15")}>
                        <Icon className={cn("w-3.5 h-3.5", config.accent)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-xs font-bold", config.accent)}>{config.label}</p>
                        <p className="text-[10px] text-muted-foreground">{config.description}</p>
                      </div>
                      {count > 0 && (
                        <span className={cn(
                          "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                          config.dotBg + "/15",
                          config.accent
                        )}>
                          {count}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <TooltipProvider delayDuration={200}>
                        {quadrants[q].map((r, i) => (
                          <Tooltip key={i}>
                            <TooltipTrigger asChild>
                              <div className="bg-background/90 rounded-lg p-2 text-xs border border-border/40 cursor-default hover:border-border transition-colors">
                                <div className="flex items-center justify-between gap-1.5 mb-0.5">
                                  <span className="font-medium truncate leading-tight">
                                    {r.task_title || r.issue.substring(0, 40)}
                                  </span>
                                  <SeverityBadge severity={r.severity} />
                                </div>
                                {r.kpi_impact && (
                                  <span className="text-[10px] text-muted-foreground leading-tight">{r.kpi_impact}</span>
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="max-w-xs">
                              <p className="font-medium text-xs mb-1">{r.issue}</p>
                              <p className="text-xs text-muted-foreground">{r.recommendation}</p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </TooltipProvider>
                      {count === 0 && (
                        <div className="flex items-center justify-center h-16">
                          <p className="text-[10px] text-muted-foreground italic">No issues</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Y-axis bottom + X-axis */}
            <div className="flex items-center justify-between pl-1 pt-0.5">
              <span className="text-[10px] text-muted-foreground font-medium">Low ↓</span>
              <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-medium">
                <span>← Low Effort</span>
                <span>High Effort →</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
