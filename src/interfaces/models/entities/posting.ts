import { BaseDirectoryItem } from "../base-entities/base-directory-item";

export interface Posting extends BaseDirectoryItem {
  postingId: number;
  postingName: string;
  memberId: number;
}
