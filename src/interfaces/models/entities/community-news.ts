import { BaseDirectoryItem } from "../base-entities/base-directory-item";

export interface CommunityNews extends BaseDirectoryItem {
  communityNewsId: number;
  communityNewsName: string;
  openTime: string;
  closeTime: string;
  expiryDate: Date;
}
