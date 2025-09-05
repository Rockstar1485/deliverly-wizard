import React from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface JobProgressProps {
  state: string;
  processed: number;
  total: number | null;
}

export default function JobProgress({ state, processed, total }: JobProgressProps) {
  const getStateVariant = (state: string) => {
    switch (state) {
      case "finished":
        return "default";
      case "error":
      case "cancelled":
        return "destructive";
      case "processing":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getProgressPercentage = () => {
    if (!total || total === 0) return 0;
    return Math.round((processed / total) * 100);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Badge variant={getStateVariant(state)} className="capitalize">
          {state}
        </Badge>
        {total && (
          <span className="text-sm text-muted-foreground">
            {processed} / {total}
          </span>
        )}
      </div>
      
      {total && (
        <div className="space-y-1">
          <Progress value={getProgressPercentage()} className="h-2" />
          <div className="text-xs text-muted-foreground text-right">
            {getProgressPercentage()}% complete
          </div>
        </div>
      )}
      
      {state === "queued" && (
        <p className="text-sm text-muted-foreground">
          Your job is queued and will start processing shortly...
        </p>
      )}
      
      {state === "processing" && (
        <p className="text-sm text-muted-foreground">
          Processing your CSV file...
        </p>
      )}
      
      {state === "finished" && (
        <p className="text-sm text-success">
          Validation completed successfully!
        </p>
      )}
      
      {state === "error" && (
        <p className="text-sm text-destructive">
          An error occurred during processing.
        </p>
      )}
    </div>
  );
}