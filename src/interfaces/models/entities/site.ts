export interface Site {
  siteId: number;
  siteName: string;
  contactWhatsApp: string;
  contactPhone: string;
  contactOther: string;
  buttonText: string;
  title: string;
  subtitle1: string;
  subtitle2: string;
  subtitle3: string;
  displayMask: number;
  description: string;
  directoryId: number;
  directoryName: string;
  imagePath: string;
  iconPath: string;
  bannerPath: string;
  hashKey: string;
  status?: number;
  latitude: number;
  longitude: number;
  createdAt: Date;
  createdBy: number;
  modifiedAt: Date;
  modifiedBy: number;
  meta: Record<string, any>;
}
