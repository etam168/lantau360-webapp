export const BASE_WEBSITE_URL = import.meta.env.VITE_WEBSITE_URL;
export const BASE_URL = import.meta.env.VITE_API_URL;
export const BLOB_URL = import.meta.env.VITE_BLOB_URL;
export const BASE_WEBAPP_LITE_URL = import.meta.env.VITE_WEBAPP_LITE_URL;

export const URL = {
  ADVERTISEMENT: `${BASE_URL}/Advertisement`,
  ATTRACTION_URL: `${BASE_URL}/Site/ByDirectoryId/1`,
  BUSINESS_DIRECTORIES: `${BASE_URL}/Directory/DirectoryGroupsData/2`,
  BUSINESS_GALLERY: `${BASE_URL}/BusinessImage/GetBusinessImages`,
  BUSINESS_PROMOTION: `${BASE_URL}/BusinessPromotion/Datatable`,
  BUSINESS_VOUCHER: `${BASE_URL}/BusinessVoucher/Datatable`,
  CHECKIN_BY_MEMBER: `${BASE_URL}/CheckIn/GetByMemberId`,
  COMMUNITY_DIRECTORY: `${BASE_URL}/CommunityDirectory`,
  COMMUNITY_EVENT_CURRENT: `${BASE_URL}/CommunityEvent/CommunityEventCurrent`,
  COMMUNITY_EVENT_GALLERY: `${BASE_URL}/CommunityEventImage/GetCommunityEventImages`,
  COMMUNITY_NEWS_CURRENT: `${BASE_URL}/CommunityNews/CommunityNewsCurrent`,
  COMMUNITY_NEWS_GALLERY: `${BASE_URL}/CommunityNewsImage/GetCommunityNewsImages`,
  COMMUNITY_NOTICE_CURRENT: `${BASE_URL}/CommunityNotice/CommunityNoticeCurrent`,
  COMMUNITY_NOTICE_GALLERY: `${BASE_URL}/CommunityNoticeImage/GetCommunityNoticeImages`,
  POSTING_GALLERY: `${BASE_URL}/PostingImage/GetPostingImages`,
  SITE_DIRECTORIES: `${BASE_URL}/Directory/DirectoryGroupsData/1`,
  SITE_GALLERY: `${BASE_URL}/SiteImage/GetSiteImages`,
  WEATHER_URL: `${BASE_URL}/Weather`,
  ADVERTISEMENT_GALLERY: `${BASE_URL}/AdvertisementImage/GetAdvertisementImages`,
  BUSINESS_VOUCHER_GALLERY_URL: `${BASE_URL}/BusinessVoucherImage/GetBusinessVoucherImages`,
  BUSINESS_PROMOTION_GALLERY_URL: `${BASE_URL}/BusinessPromotionImage/GetBusinessPromotionImages`,
  CONTENT_NAME_URL: `${BASE_URL}/Content/ContentByName`,
  MEMBER_URL: `${BASE_URL}/Member`,
  MEMBER_TRANSACTIONS_URL: `${BASE_URL}/Transactoin/MemberTransactions`,
  MEMBER_RECENT_RANSACTIONS_URL: `${BASE_URL}/Transactoin/MemberRecentTransactions`,
  MEMBER_PURCHASE_TRANSACTIONS_URL: `${BASE_URL}/Transactoin/InsertPurchasePointTransaction`,
  MEMBER_CONFIG: "/Content/ContentByName/MemberConfig",
  MEMBER_SITE_CHECK_IN: "/CheckIn/GetByMemberAndSiteId",
  MEMBER_DIRECTORY_CHECK_IN: "/CheckIn/GetMemberDirectoryCheckIn",
  DIRECTORY_LIST: {
    BUSINESS: `${BASE_URL}/Business/ByDirectoryId`,
    POSTING: `${BASE_URL}/Posting/Active/ByDirectoryId`,
    SITE: `${BASE_URL}/Site/ByDirectoryId`,
    MEMBER_CHECKED_IN_SITES: `${BASE_URL}/Site/Directory/Member`
  },
  EMAIL_CONFIRMATION: {
    SEND_LINK: "/MemberAuth/SendEmailConfirmationLink",
    RESEND_LINK: "/MemberAuth/ReSendEmailConfirmationLink",
    CONFIRM_EMAIL: "/MemberAuth/VerifyEmail"
  }
};
