import { BaseDirectoryItem } from "../base-entities/base-directory-item";

export interface Site extends BaseDirectoryItem {
  siteId: number;
  siteName: string;
}
