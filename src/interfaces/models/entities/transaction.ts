export interface Transaction {
  transactionId: number;
  postingId: number;
  memberId: number;
  title: string;
  amount: number;
  points: number;
  transactionType: number;
  status?: number;
  createdByUsername: string;
  createdAt: Date;
  createdBy: number;
  modifiedAt: Date;
  modifiedBy: number;
  meta: Record<string, unknown>;
}
