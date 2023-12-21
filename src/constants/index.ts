export const ageGroups = ["13-18", "19-29", "30-39", "40-49", "50-59", "51-60", "Above 60"];

export const FetchStatus = {
  IDLE: "IDLE",
  RUNNING: "RUNNING",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR"
};

export const ButtonOption = {
  CREATE: 1,
  EXCEL: 2,
  NOCREATE: 4,
  LISTING_REQUEST_MODE: 8
};

export const ActionButton = {
  EDIT: 1,
  GALLERY: 2,
  DETAIL: 4
};

export const CrudActionSlot = {
  YES: true,
  NO: false
};

export const PropertyStatus = {
  RENT: 1,
  BUY: 2
};

export const DateFormat = {
  ISO: "YYYY-MM-DD",
  ISO1: "YYYY-MM-DD mm:ss",
  YMD: "YYYY/MM/DD"
};

export const ContentOption = {
  ABOUT: "about_us",
  PRIVACY: "privacy_policy",
  TERMS: "tnc"
};

export const FabOption = {
  EDIT: 1,
  DELETE: 2,
  CHANGE_PASSWORD: 4
};

export const Role = {
  ADMIN: "admin",
  CS_ADMIN: "cs_admin",
  FRONT_DESK: "front_desk",
  SALES_TEAM: "sales_team",
  AGENT: "agent"
};

export const State = {
  NORMAL: 0,
  SELECTED: 1,
  UNAVAILABLE: 2
};

export const COL_WIDTH = {
  ID: "90",
  ACTIONS: "120",
  ALIAS: "150",
  DATE: "160",
  POINTS: "100",
  STATUS: "120"
};

export const DATATABLE_MIN_WIDTH = 640;
export const INPUT_PANE_WIDTH = 480;

export const Screen = {
  laptopMaxWidth: "max-width: 800px;",
  tabletMaxWidth: "max-width: 100vw;",
  laptopHeight: "height: 90vh;",
  tabletHeight: "height: auto;"
};

export const splitterStyle = {
  laptop: "min-height: 390px; min-width: 100%;; max-width: 100%;",
  tablet: "height: auto; min-width: 100%; max-width: 100%;"
};

export const BASE_WEBSITE_URL = import.meta.env.VITE_WEBSITE_URL;
export const BASE_URL = import.meta.env.VITE_API_URL;
export const BLOB_URL = import.meta.env.VITE_BLOB_URL;
export const AGENTS_URL = `${BASE_URL}/Agent`;
export const AREA_URL = `${BASE_URL}/Area/Area`;
export const AVAILABLE_AREA_URL = `${BASE_URL}/Area/GetAvailableAreas`;

export const DIRECTORY_GROUPS = {
  HOME: [1, 3],
  BUSINESS: [2, 4],
  PROMOTIONS: 108,
  LATEST_OFFERS: 100,
  COMMUNITY: 7,
  TIMETABLE: 24,
  TAXI: 26
};

export const RENDERER = {
  SITE: "Site",
  TAXI: "Taxi",
  TIMETABLE: "Timetable",
  BUSINESS: "business",
  POSTING: "posting",
  ADVERTISEMENT: "advertisement",
  ATTRACTION: "attraction",
  PROMOTION: "promotion",
  VOUCHER: "voucher",
  EVENT: "event",
  NEWS: "news",
  NOTICE: "notice"
};

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
  COMMUNITY_NOTICE_GALLERY: `${BASE_URL}/CommunityNoticeImage/GetCommunityNoticeImages`,
  POSTING_GALLERY: `${BASE_URL}/PostingImage/GetPostingImages`,
  SITE_DIRECTORIES: `${BASE_URL}/Directory/DirectoryGroupsData/1`,
  SITE_GALLERY: `${BASE_URL}/SiteImage/GetSiteImages`,
  WEATHER_URL: `${BASE_URL}/Weather`,
  ADVERTISEMENT_GALLERY: `${BASE_URL}/AdvertisementImage/GetAdvertisementImages`,
  BUSINESS_VOUCHER_GALLERY_URL: `${BASE_URL}/BusinessVoucherImage/GetBusinessVoucherImages`,
  BUSINESS_PROMOTION_GALLERY_URL: `${BASE_URL}/BusinessPromotionImage/GetBusinessPromotionImages`,

  DIRECTORY_LIST: {
    BUSINESS: `${BASE_URL}/Business/ByDirectoryId`,
    POSTING: `${BASE_URL}/Posting/ByDirectoryId`,
    SITE: `${BASE_URL}/Site/ByDirectoryId`
  }
};

export const DIRECTORY_SITES_URL = `${BASE_URL}/Site/ByDirectoryId`;
export const SITE_URL = `${BASE_URL}/Site/SiteById`;
export const DIRECTORY_URL = `${BASE_URL}/Directory`;

export const COMMUNITY_NEWS_GALLERY_URL = `${BASE_URL}/CommunityNewsImage/GetCommunityNewsImages`;
export const COMMUNITY_NOTICE_GALLERY_URL = `${BASE_URL}/CommunityNoticeImage/GetCommunityNoticeImages`;
export const POSTING_URL = `${BASE_URL}/Posting/PostingById`;
export const COMMUNITY_NEWS_URL = `${BASE_URL}/CommunityNews/CommunityNewsById`;
export const COMMUNITY_NOTICE_URL = `${BASE_URL}/CommunityNotice/CommunityNoticeById`;

export const DIRECTORY_BUSINESS_URL = `${BASE_URL}/Business/ByDirectoryId`;
export const ADVERTISEMENT_DETAIL_URL = `${BASE_URL}/Advertisement/AdvertisementById`;

export const BUSINESS_URL = `${BASE_URL}/Business/BusinessById`;
export const BUSINESS_PROMOTION_URL_BY_ID = `${BASE_URL}/BusinessPromotion/BusinessPromotionById`;
export const BUSINESS_VOUCHER_URL_BY_ID = `${BASE_URL}/BusinessVoucher/BusinessVoucherById`;
export const DIRECTORY_POST_URL = `${BASE_URL}/Posting/ByDirectoryId`;

export const COMMUNITY_EVENT_URL = `${BASE_URL}/CommunityEvent/CommunityEventById`;
export const COMMUNITY_EVENT_GALLERY_URL = `${BASE_URL}/CommunityEventImage/GetCommunityEventImages`;

export const ADVERTISEMENT_URL = `${BASE_URL}/Advertisement`;

export const AMENITY_URL = `${BASE_URL}/Amenity`;
export const PROPERTY_TYPE_URL = `${BASE_URL}/PropertyType`;
export const PROPERTY_VIEW_URL = `${BASE_URL}/PropertyView`;
export const PROPERTY_FEATURE_URL = `${BASE_URL}/PropertyFeature`;
export const PROPERTY_USAGE_URL = `${BASE_URL}/PropertyUsage`;
export const USER_CREDIT_URL = `${BASE_URL}/UserCredit/ViewedRecordIds`;

export const BUILDING_URL = `${BASE_URL}/Building/Datatable`;
export const BUILDING_BY_NAME_URL = `${BASE_URL}/Building/ByName`;
export const BUILDING_BY_DISTRICT_URL = `${BASE_URL}/Building/ByDistrict`;

export const DISTRICT_URL = `${BASE_URL}/District`;
export const SEARCH_OPTION_DATA_URL = `${BASE_URL}/PropertyListing/GetSearchOptionData`;
export const BASE_IMAGE_URL = import.meta.env.VITE_BLOB_URL;

export const SETTINGS_URL = `${BASE_URL}/Content/ContentByName/Settings`;

export const UPDATE_CONTENT_URL = `${BASE_URL}/Content/CreateOrUpdateContent`;

export const COLOR_PATTERN = ["#546bfa", "#3a9688", "#546bfa", "#3a9688"];

export const DMY = "DD/MM/YYYY";

export const STORAGE_KEYS = {
  BUSINESSFAVOURITES: "businessFavourites",
  SITEFAVOURITES: "siteFavourites",
  POSTINGFAVOURITES: "postingFavourites",
  IsLogOn: "IsLogin",

  SAVED: {
    BUSINESS: "businessFavourites",
    SITE: "siteFavourites",
    POSTING: "postingFavourites"
  }
};

export const PLACEHOLDER_AVATAR =
  "data:image/jpeg;base64,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";

export const PLACEHOLDER_WORD_DOCUMENT =
  "data:image/png;base64,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";
export const PLACEHOLDER_THUMBNAIL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJYAAACWBAMAAADOL2zRAAAAG1BMVEXMzMyWlpaqqqq3t7fFxcW+vr6xsbGjo6OcnJyLKnDGAAAACXBIWXMAAA7EAAAOxAGVKw4bAAABAElEQVRoge3SMW+DMBiE4YsxJqMJtHOTITPeOsLQnaodGImEUMZEkZhRUqn92f0MaTubtfeMh/QGHANEREREREREREREtIJJ0xbH299kp8l8FaGtLdTQ19HjofxZlJ0m1+eBKZcikd9PWtXC5DoDotRO04B9YOvFIXmXLy2jEbiqE6Df7DTleA5socLqvEFVxtJyrpZFWz/pHM2CVte0lS8g2eDe6prOyqPglhzROL+Xye4tmT4WvRcQ2/m81p+/rdguOi8Hc5L/8Qk4vhZzy08DduGt9eVQyP2qoTM1zi0/uf4hvBWf5c77e69Gf798y08L7j0RERERERERERH9P99ZpSVRivB/rgAAAABJRU5ErkJggg==";
