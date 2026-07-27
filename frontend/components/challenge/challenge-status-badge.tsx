import React from "react";
import { ChallengeStatus } from "@/types/challenge";
import { Badge } from "@/components/ui/badge";

interface ChallengeStatusBadgeProps {
  status: ChallengeStatus;
}

export function ChallengeStatusBadge({ status }: ChallengeStatusBadgeProps) {
  switch (status) {
    case ChallengeStatus.Created:
      return <Badge variant="default">Pending Acceptance</Badge>;
    case ChallengeStatus.Active:
      return <Badge variant="active">Active</Badge>;
    case ChallengeStatus.ProofSubmitted:
      return <Badge variant="completed">Proof Submitted</Badge>;
    case ChallengeStatus.Completed:
      return <Badge variant="completed">Completed & Paid</Badge>;
    case ChallengeStatus.ProofRejected:
      return <Badge variant="rejected">Proof Rejected</Badge>;
    case ChallengeStatus.Cancelled:
      return <Badge variant="expired">Cancelled</Badge>;
    case ChallengeStatus.Rejected:
      return <Badge variant="rejected">Invitation Rejected</Badge>;
    case ChallengeStatus.Expired:
      return <Badge variant="expired">Expired</Badge>;
    default:
      return <Badge variant="default">{status}</Badge>;
  }
}
