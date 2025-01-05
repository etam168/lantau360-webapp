export interface BaseDirectory {
  directoryName: string;
  shortName: string;
  shortNameAlt: string;
  imagePath: string;
  description: string;
  displayMask: number;
  groupId: number;
  rank: number;
  status: number;
  createdAt: Date;
  createdBy: number;
  modifiedBy?: number | null;
  modifiedAt?: Date | null;
  meta: Record<string, any>;
}
