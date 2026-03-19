import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowRight, ArrowDown } from "lucide-react";

const priorityConfig = {
  High: {
    style: "bg-[hsl(var(--severity-high))]/15 text-[hsl(var(--severity-high))] border-[hsl(var(--severity-high))]/30",
    icon: ArrowUp,
  },
  Medium: {
    style: "bg-[hsl(var(--severity-medium))]/15 text-[hsl(var(--severity-medium))] border-[hsl(var(--severity-medium))]/30",
    icon: ArrowRight,
  },
  Low: {
    style: "bg-[hsl(var(--severity-low))]/15 text-[hsl(var(--severity-low))] border-[hsl(var(--severity-low))]/30",
    icon: ArrowDown,
  },
};

export function PriorityBadge({ priority }: { priority: "High" | "Medium" | "Low" }) {
  const config = priorityConfig[priority];
  const Icon = config.icon;
  return (
    <Badge variant="outline" className={cn("text-xs font-medium gap-1", config.style)}>
      <Icon className="w-3 h-3" />
      {priority}
    </Badge>
  );
}
