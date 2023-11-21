export interface IMember {
  name: string;
  email: string;
  phone?: string;
  user: string;
  memberId: number;
  status?: number;
  avatar?: string;
  roles?: string[];
}
