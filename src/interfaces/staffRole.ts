export interface StaffRole {
  modifiedBy: number;
  modifiedAt: Date;
  roleCode: string;
  roleName: string;
  createdAt: Date;
  createdBy: number;
  meta: Record<string, unknown>;
}
