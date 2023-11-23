export interface FavoriteItem {
  directoryId: number;
  directoryName: string;
  itemName: string;
  itemId: number;
  groupId: number;
  iconPath: string;
  subTitle: string;
  meta: Record<string, unknown> | null;
  directoryMeta: Record<string, unknown> | null;
}
