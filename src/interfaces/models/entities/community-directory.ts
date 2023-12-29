export interface CommunityDirectory {
  communityDirectoryId: number;
  directoryName: string;
  shortName: string;
  directoryNameAlt: string;
  shortNameAlt: string;
  rank: number;
  imagePath: string;
  description: string;
  groupId: number;
  ranking: number;
  status: number;
  createdAt: Date;
  createdBy: number;
  modifiedBy?: number | null;
  modifiedAt?: Date | null;
  meta: Record<string, any>;
}
