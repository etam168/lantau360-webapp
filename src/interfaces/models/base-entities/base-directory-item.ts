export interface BaseDirectoryItem {
  contactWhatsApp: string;
  contactPhone: string;
  contactOther: string;
  customSubtitle1: string;
  customSubtitle2: string;
  buttonText: string;
  title: string;
  mapLabel: string;
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
  status?: number;
  latitude: number;
  longitude: number;
  createdAt: Date;
  createdBy: number;
  modifiedAt: Date;
  modifiedBy: number;
  meta: Record<string, any>;
  rank: number;
}
