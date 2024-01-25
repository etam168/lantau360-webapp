export interface BaseImage {
  imageId: number;
  ranking: number;
  imagePath: string;
  meta: Record<string, unknown>;
  createdAt: Date;
  createdBy: number;
  modifiedAt: Date;
  modifiedBy: number;
}
