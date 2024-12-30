import { BaseDirectory } from "../base-entities/base-directory";

export interface SiteDirectory extends BaseDirectory {
  siteDirectoryId: number;
  displayMask: number;
}
