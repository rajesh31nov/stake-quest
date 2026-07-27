import * as React from "react";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "./button";

interface ToastBannerProps {
  type?: "error" | "success" | "info";
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

export function ToastBanner({
  type = "info",
  title,
  message,
  className,
}: ToastBannerProps) {
  const styles = {
    error: "bg-rose-950/80 border-rose-800 text-rose-200",
    success: "bg-emerald-950/80 border-emerald-800 text-emerald-200",
    info: "bg-slate-900/90 border-slate-800 text-slate-200",
  };

  const icons = {
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />,
    info: <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />,
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-2xl border p-4 shadow-lg backdrop-blur-md transition-all",
        styles[type],
        className
      )}
    >
      {icons[type]}
      <div className="flex-1 text-sm">
        {title && <h4 className="font-semibold mb-0.5">{title}</h4>}
        <p className="opacity-90">{message}</p>
      </div>
    </div>
  );
}
