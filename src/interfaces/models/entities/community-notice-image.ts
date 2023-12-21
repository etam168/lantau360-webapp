export interface CommunityNoticeImage {
  imageId?: number;
  communityNoticeId: number;
  ranking: number;
  imagePath: string;
  meta: Record<string, any>;
  createdBy: number;
  createdAt: Date;
  modifiedBy: number;
  modifiedAt: Date;
}
