import { BaseDirectory } from "../base-entities/base-directory";

export interface CommunityDirectory extends BaseDirectory {
  communityDirectoryId: number;
  directoryNameAlt: string;
  shortNameAlt: string;
  ranking: number;
}
