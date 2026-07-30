"use client";

import React from "react";
import { usePathname } from "next/navigation";

export function MainContainer({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  if (isLandingPage) {
    return <main className="flex-1 w-full">{children}</main>;
  }

  return (
    <main className="lg:pl-72 flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {children}
    </main>
  );
}
