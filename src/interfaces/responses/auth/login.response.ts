import { IMember } from "@/interfaces/models/custom-models";

export interface ILoginResponse extends IMember {
  token: string;
  expiry: string;
  refreshToken: string;
  refreshTokenExpiry: string;
  avatar: string;
}
