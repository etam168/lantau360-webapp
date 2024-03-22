export interface TransactionView {
  postingId: number;
  title: string;
  createdByUsername: string;
  transactionId: number;
  memberId: number;
  amount: number;
  points: number;
  transactionType: number;
  status: number;
  createdAt: Date;
  createdBy: number;
  modifiedAt: Date;
  modifiedBy: number;
  meta: Record<string, any>;
}
