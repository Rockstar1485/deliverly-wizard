import React from "react";
import { Badge } from "@/components/ui/badge";

interface SummaryCardProps {
  total: number;
  deliverable: number;
  undeliverable: number;
  risky: number;
  unknown: number;
}

export default function SummaryCard({
  total,
  deliverable,
  undeliverable,
  risky,
  unknown,
}: SummaryCardProps) {
  const getPercentage = (value: number) => {
    if (total === 0) return "0%";
    return `${Math.round((value / total) * 100)}%`;
  };

  const summaryItems = [
    {
      label: "Total",
      value: total,
      percentage: "100%",
      variant: "outline" as const,
    },
    {
      label: "Deliverable",
      value: deliverable,
      percentage: getPercentage(deliverable),
      variant: "default" as const,
    },
    {
      label: "Undeliverable",
      value: undeliverable,
      percentage: getPercentage(undeliverable),
      variant: "destructive" as const,
    },
    {
      label: "Risky",
      value: risky,
      percentage: getPercentage(risky),
      variant: "secondary" as const,
    },
    {
      label: "Unknown",
      value: unknown,
      percentage: getPercentage(unknown),
      variant: "outline" as const,
    },
  ];

  return (
    <div className="space-y-3">
      {summaryItems.map((item) => (
        <div key={item.label} className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant={item.variant} className="text-xs">
              {item.label}
            </Badge>
            <span className="text-sm text-muted-foreground">
              {item.percentage}
            </span>
          </div>
          <span className="font-medium text-sm">
            {item.value.toLocaleString()}
          </span>
        </div>
      ))}

      {total > 0 && (
        <div className="mt-4 pt-3 border-t">
          <div className="text-xs text-muted-foreground">
            Validation Summary
          </div>
          <div className="mt-1 space-y-1">
            <div className="flex justify-between text-xs">
              <span>Success Rate:</span>
              <span className="font-medium">
                {getPercentage(deliverable)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span>Risk Rate:</span>
              <span className="font-medium">
                {getPercentage(risky + undeliverable)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}