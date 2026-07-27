import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "./button";

interface LoadingSpinnerProps {
  label?: string;
  className?: string;
}

export function LoadingSpinner({ label = "Loading...", className }: LoadingSpinnerProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 space-y-3", className)}>
      <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      {label && <p className="text-sm font-medium text-slate-400">{label}</p>}
    </div>
  );
}
