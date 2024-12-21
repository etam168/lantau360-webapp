import { BaseDirectory } from "../base-entities/base-directory";

export interface BusinessDirectory extends BaseDirectory {
  businessDirectoryId: number;
  displayMask: number;
}
