import { BaseDirectory } from "../base-entities/base-directory";

export interface Directory extends BaseDirectory {
  directoryId: number;
  displayMask: number;
}
