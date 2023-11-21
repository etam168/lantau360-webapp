export interface Business {
  businessId: number;
  businessName: string;
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
  imagePath: string;
  iconPath: string;
  bannerPath: string;
  hashKey: string;
  latitude: number;
  longitude: number;
  openTime: string;
  closeTime: string;
  status: number;
  createdAt: Date;
  createdBy: number;
  modifiedAt: Date;
  modifiedBy: number;
  meta: Record<string, any>;
}
