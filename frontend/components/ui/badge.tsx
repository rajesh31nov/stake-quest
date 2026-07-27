import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./button";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
        active: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
        completed: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
        rejected: "bg-rose-500/20 text-rose-400 border border-rose-500/30",
        expired: "bg-slate-700/50 text-slate-400 border border-slate-600/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
