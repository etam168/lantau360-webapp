
export interface FavouriteBusiness  {
  favouriteBusinessId: number;
  businessId: number;
  businessData: Record<string, any>;
  createdAt: Date;
  createdBy: number;
  modifiedAt: Date;
  modifiedBy?: number;
}
