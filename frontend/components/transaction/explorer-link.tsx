import React from "react";
import { ExternalLink } from "lucide-react";
import { explorerService } from "@/services/explorer-service";
import { truncateAddress } from "@/utils/formatters";

interface ExplorerLinkProps {
  hash: string;
  className?: string;
}

export function ExplorerLink({ hash, className }: ExplorerLinkProps) {
  const url = explorerService.getTxUrl(hash);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 underline font-mono ${className}`}
    >
      <span>{truncateAddress(hash, 6)}</span>
      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
    </a>
  );
}
