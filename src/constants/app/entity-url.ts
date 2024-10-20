// entity-url.ts

export const ENTITY_URL = {
  ADVERTISEMENT: `/Advertisement`,
  ATTRACTION: `/Site/ByDirectoryId/1`,
  BUSINESS: `/Business`,
  BUSINESS_DIRECTORIES: `/Directory/DirectoryGroupsData/2`,
  BUSINESS_PROMOTION: `/BusinessPromotion/Datatable`,
  BUSINESS_VOUCHER: `/BusinessVoucher/Datatable`,
  CHECKIN: `/CheckIn`,
  CHECKIN_BY_MEMBER: `/CheckIn/GetByMemberId`,
  COMMUNITY: `/Community`,
  COMMUNITY_EVENT_CURRENT: `/CommunityEvent/CommunityEventCurrent`,
  COMMUNITY_DIRECTORY: `/CommunityDirectory`,
  COMMUNITY_NEWS_CURRENT: `/CommunityNews/CommunityNewsCurrent`,
  COMMUNITY_NOTICE_CURRENT: `/CommunityNotice/CommunityNoticeCurrent`,
  CONTENT_NAME: `/Content/ContentByName`,
  FAVOURITE: `posting`,
  MEMBER: "/Member",
  MEMBER_IMAGE: `/MemberImage`,
  MEMBER_BY_ID: `/Member/MemberById`,
  MEMBER_CONFIG: "/Content/ContentByName/MemberConfig",
  MEMBER_TRANSACTIONS: `/Transactoin/MemberTransactions`,
  MEMBER_RECENT_TRANSACTIONS: `/Transactoin/MemberRecentTransactions`,
  POSTING: `favourite`,
  SITE: `/Site`,
  SITE_DIRECTORIES: `/Directory/DirectoryGroupsData/1`,
  WEATHER: `/Weather`,
  ACCOUNT:"Account"
};

export type EntityURLKey = keyof typeof ENTITY_URL;
