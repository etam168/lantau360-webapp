export interface CommunityNewsImage {
  imageId?: number;
  communityNewsId: number;
  ranking: number;
  imagePath: string;
  meta: Record<string, any>;
  createdBy: number;
  createdAt: Date;
  modifiedBy: number;
  modifiedAt: Date;
}
