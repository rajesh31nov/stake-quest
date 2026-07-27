"use client";

import React, { useEffect, useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { formatTimeRemaining } from "@/utils/formatters";

interface ChallengeTimerProps {
  deadlineTimestamp: number;
  isExpired?: boolean;
}

export function ChallengeTimer({ deadlineTimestamp, isExpired }: ChallengeTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (deadlineTimestamp <= 0) return;

    const updateTimer = () => {
      setTimeLeft(formatTimeRemaining(deadlineTimestamp));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 10000); // refresh every 10 sec

    return () => clearInterval(interval);
  }, [deadlineTimestamp]);

  if (deadlineTimestamp <= 0) {
    return (
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
        <Clock className="w-3.5 h-3.5" />
        <span>Timer Starts Upon Acceptance</span>
      </div>
    );
  }

  const isEnded = timeLeft === "Expired" || isExpired;

  return (
    <div className={`flex items-center gap-1.5 text-xs font-bold ${isEnded ? "text-rose-400" : "text-amber-400"}`}>
      {isEnded ? <AlertTriangle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5 animate-pulse" />}
      <span>{timeLeft}</span>
    </div>
  );
}
