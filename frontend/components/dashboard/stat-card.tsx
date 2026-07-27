import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  iconBgColor?: string;
}

export function StatCard({ title, value, subtitle, icon, iconBgColor = "bg-amber-500/10 text-amber-400" }: StatCardProps) {
  return (
    <Card className="border-slate-800 bg-slate-900/70 shadow-lg hover:border-slate-700 transition-all">
      <CardHeader className="p-0 mb-3 flex flex-row items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBgColor}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight">{value}</CardTitle>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}
