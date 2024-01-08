import { BaseDirectoryItem } from "../base-entities/base-directory-item";

export interface CommunityEvent extends BaseDirectoryItem {
  communityEventId: number;
  communityEventName: string;
  openTime: string;
  closeTime: string;
  expiryDate: Date;
}
