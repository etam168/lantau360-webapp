// entity-url.ts

export const ENTITY_URL = {
  ADVERTISEMENT: `/Advertisement`,
  ATTRACTION: `/Site/ByDirectoryId/1`,
  BUSINESS: `/Business`,
  BUSINESS_DIRECTORIES: `/Directory/DirectoryGroupsData/2`,
  BUSINESS_PROMOTION: `/BusinessPromotion/Datatable`,
  BUSINESS_VOUCHER: `/BusinessVoucher/Datatable`,
  COMMUNITY_EVENT_CURRENT: `/CommunityEvent/CommunityEventCurrent`,
  COMMUNITY_DIRECTORY: `/CommunityDirectory`,
  COMMUNITY_NEWS_CURRENT: `/CommunityNews/CommunityNewsCurrent`,
  COMMUNITY_NOTICE_CURRENT: `/CommunityNotice/CommunityNoticeCurrent`,
  FAVOURITE: `favourite`,
  MEMBER_CONFIG: "/Content/ContentByName/MemberConfig",
  SITE: `/Site`,
  SITE_DIRECTORIES: `/Directory/DirectoryGroupsData/1`,
  WEATHER: `/Weather`,
  COMMUNITY: `/Community`
};

export type EntityURLKey = keyof typeof ENTITY_URL;
