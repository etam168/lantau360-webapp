import { BaseDirectoryItem } from "../base-enities/directory-item";

export interface Site extends BaseDirectoryItem {
  siteId: number;
  siteName: string;
}
