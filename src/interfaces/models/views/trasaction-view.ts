export interface TransactionView {
  postingId: number;
  title: string;
  createdByUsername: string;
  directoryName: string;
  postingDescription: string;
  isPostExpired: boolean;
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
