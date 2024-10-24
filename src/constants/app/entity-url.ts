// entity-url.ts

export const ENTITY_URL = {
  ACCOUNT: "Account",
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
  MEMBER_TRANSACTIONS: `/Transaction/MemberTransactions`,
  MEMBER_RECENT_TRANSACTIONS: `/Transaction/MemberRecentTransactions`,
  MEMBER_SITE_CHECK_IN: "/CheckIn/GetByMemberAndSiteId",
  SITE: `/Site`,
  SITE_DIRECTORIES: `/Directory/DirectoryGroupsData/1`,
  TRANSACTION: `/Transactoin/MemberTransactions`,
  WEATHER: `/Weather`,
  SIGN_IN: "/MemberAuth/SignIn",
  SIGN_UP: "/MemberAuth/SignUp",
  RESET_PASSWORD: "/MemberAuth/RecoverPassword",
  POSTING: "/Posting",
  SEND_OTP: "/MemberAuth/SendOtp"
};

export type EntityURLKey = keyof typeof ENTITY_URL;
