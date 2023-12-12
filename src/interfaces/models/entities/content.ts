export interface Content {
  contentId: number;
  contentName: string;
  contentData: string;
  createdBy: number;
  createdAt: Date;
  modifiedBy: number;
  modifiedAt: Date;
  meta: Record<string, any>;
}
