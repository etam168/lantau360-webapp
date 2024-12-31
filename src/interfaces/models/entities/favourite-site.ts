
export interface FavouriteSite  {
  favouriteSiteId: number;
  siteId: number;
  siteData: Record<string, any>;
  createdAt: Date;
  createdBy: number;
  modifiedAt: Date;
  modifiedBy?: number;
}
