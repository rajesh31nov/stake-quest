"use client";

import React, { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RetryButtonProps {
  onRetry: () => Promise<void>;
  className?: string;
}

export function RetryButton({ onRetry, className }: RetryButtonProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await onRetry();
    } catch (err) {
      console.error("Retry execution failed:", err);
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleRetry}
      disabled={isRetrying}
      className={`gap-1.5 text-xs border-amber-500/30 text-amber-400 hover:bg-amber-500/10 ${className}`}
    >
      <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? "animate-spin" : ""}`} />
      {isRetrying ? "Retrying..." : "Retry Transaction"}
    </Button>
  );
}
