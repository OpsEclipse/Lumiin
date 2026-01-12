"use client";

import { Lightbulb } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

interface AIRecommendationProps {
  recommendation: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function AIRecommendation({
  recommendation,
  actionLabel = "Set Smart Timer",
  onAction,
}: AIRecommendationProps): React.ReactElement {
  return (
    <div className="border border-border bg-gradient-to-r from-primary/10 to-transparent p-6 flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
          <Lightbulb size={24} weight="fill" />
        </div>
        <div>
          <h3 className="font-bold text-lg mb-1">AI Recommendation</h3>
          <p className="text-sm text-muted-foreground max-w-xl">
            {recommendation}
          </p>
        </div>
      </div>
      <Button
        onClick={onAction}
        className="whitespace-nowrap px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium text-sm uppercase tracking-wide"
      >
        {actionLabel}
      </Button>
    </div>
  );
}
