// entity-url.ts

export const ENTITY_URL = {
  ADVERTISEMENT: `/Advertisement`,
  ATTRACTION: `/Site/ByDirectoryId/1`,
  BUSINESS: `/Business`,
  BUSINESS_DIRECTORIES: `/Directory/DirectoryGroupsData/2`,
  BUSINESS_PROMOTION: `/BusinessPromotion/Datatable`,
  BUSINESS_VOUCHER: `/BusinessVoucher/Datatable`,
  SITE: `/Site`,
  SITE_DIRECTORIES: `/Directory/DirectoryGroupsData/1`,
  WEATHER: `/Weather`
};

export type EntityURLKey = keyof typeof ENTITY_URL;
