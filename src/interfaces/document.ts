export interface Document {
  documentId: number;
  documentName: string;
  fileType: string;
  filePath: string;
  createdAt: Date;
  createdBy: number;
  modifiedAt: Date;
  modifiedBy: number;
  meta: Record<string, unknown>;
}
