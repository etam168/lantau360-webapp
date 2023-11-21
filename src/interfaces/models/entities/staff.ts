export interface Staff {
  staffId: number;
  password: string;
  supplierId: number;
  userName: string;
  email: string;
  imagePath: string;
  staffAlias: string;
  staffAliasAlt: Record<string, any>;
  firstName: string;
  lastName: string;
  roleCode: string;
  status: number;
  createdAt: Date;
  createdBy: number;
  modifiedAt: Date;
  modifiedBy: number;
  meta: Record<string, any>;
}
