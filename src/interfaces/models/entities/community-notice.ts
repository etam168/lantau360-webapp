import { BaseDirectoryItem } from "../base-entities/base-directory-item";

export interface CommunityNotice extends BaseDirectoryItem {
  communityNoticeId: number;
  communityNoticeName: string;
  openTime: string;
  closeTime: string;
  expiryDate: Date;
}
