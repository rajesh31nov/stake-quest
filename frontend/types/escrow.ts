export enum EscrowStatus {
  Locked = "Locked",
  Released = "Released",
  Refunded = "Refunded",
}

export interface EscrowRecordModel {
  challengeId: number;
  challenger: string;
  amountStroops: bigint;
  amountXlm: string;
  status: EscrowStatus;
}
