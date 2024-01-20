export const BASE_WEBSITE_URL = import.meta.env.VITE_WEBSITE_URL;
export const BASE_URL = import.meta.env.VITE_API_URL;
export const BLOB_URL = import.meta.env.VITE_BLOB_URL;

export const URL = {
  ADVERTISEMENT: `${BASE_URL}/Advertisement`,
  ATTRACTION_URL: `${BASE_URL}/Site/ByDirectoryId/1`,
  BUSINESS_DIRECTORIES: `${BASE_URL}/Directory/DirectoryGroupsData/2`,
  BUSINESS_GALLERY: `${BASE_URL}/BusinessImage/GetBusinessImages`,
  BUSINESS_PROMOTION: `${BASE_URL}/BusinessPromotion/Datatable`,
  BUSINESS_VOUCHER: `${BASE_URL}/BusinessVoucher/Datatable`,
  COMMUNITY_DIRECTORY: `${BASE_URL}/CommunityDirectory`,
  COMMUNITY_EVENT: `${BASE_URL}/CommunityEvent`,
  COMMUNITY_EVENT_GALLERY: `${BASE_URL}/CommunityEventImage/GetCommunityEventImages`,
  COMMUNITY_NEWS: `${BASE_URL}/CommunityNews`,
  COMMUNITY_NEWS_GALLERY: `${BASE_URL}/CommunityNewsImage/GetCommunityNewsImages`,
  COMMUNITY_NOTICE: `${BASE_URL}/CommunityNotice`,
  COMMUNITY_NOTICE_CURRENT: `${BASE_URL}/CommunityNotice/CommunityNoticeCurrent`,
  COMMUNITY_NOTICE_GALLERY: `${BASE_URL}/CommunityNoticeImage/GetCommunityNoticeImages`,
  POSTING_GALLERY: `${BASE_URL}/PostingImage/GetPostingImages`,
  SITE_DIRECTORIES: `${BASE_URL}/Directory/DirectoryGroupsData/1`,
  SITE_GALLERY: `${BASE_URL}/SiteImage/GetSiteImages`,
  WEATHER_URL: `${BASE_URL}/Weather`,
  ADVERTISEMENT_GALLERY: `${BASE_URL}/AdvertisementImage/GetAdvertisementImages`,
  BUSINESS_VOUCHER_GALLERY_URL: `${BASE_URL}/BusinessVoucherImage/GetBusinessVoucherImages`,
  BUSINESS_PROMOTION_GALLERY_URL: `${BASE_URL}/BusinessPromotionImage/GetBusinessPromotionImages`,
  MEMBER_IMAGE_URL: `${BASE_URL}/MemberImage`,

  DIRECTORY_LIST: {
    BUSINESS: `${BASE_URL}/Business/ByDirectoryId`,
    POSTING: `${BASE_URL}/Posting/ByDirectoryId`,
    SITE: `${BASE_URL}/Site/ByDirectoryId`
  }
};
