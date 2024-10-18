// interface files
import { AdvertisementView } from "@/interfaces/models/views/advertisement-view";
import { BulletinTypes } from "@/interfaces/types/bulletin-types";
import { BusinessPromotionView } from "@/interfaces/models/views/business-promotion-view";
import { BusinessView } from "@/interfaces/models/views/business-view";
import { BusinessVoucherView } from "@/interfaces/models/views/business-voucher-view";
import { CategoryTypes } from "@/interfaces/types/category-types";
import { CommunityDirectory } from "@/interfaces/models/entities/community-directory";
import { CommunityEventView } from "@/interfaces/models/views/community-event-view";
import { CommunityNewsView } from "@/interfaces/models/views/community-news-view";
import { CommunityNoticeView } from "@/interfaces/models/views/community-notice-view";
import { Directory } from "@/interfaces/models/entities/directory";
import { DirectoryTypes } from "@/interfaces/types/directory-types";
import { MarketingType } from "@/interfaces/types/marketing-types";
import { PostingView } from "@/interfaces/models/views/posting-view";
import { SiteView } from "@/interfaces/models/views/site-view";

// .ts file
import i18n from "@/plugins/i18n/i18n";
import { useChangeCase } from "@vueuse/integrations/useChangeCase";
import { BLOB_URL, EntityURLKey, IMAGES, STORAGE_KEYS } from "@/constants";
import { date, EventBus, LocalStorage, Notify, Screen } from "quasar";
import { ImageURLKey } from "@/constants/app/image-url";

const eventBus = new EventBus();
// const eventBus = (key: string) => useEventBus<any>(key);


export function useUtilities() {
  const { t } = i18n.global;
  const isSmallScreen = computed(() => Screen.lt.sm);
  const isDevelopment = import.meta.env.NODE_ENV === "development";

  function aspectRatio() {
    switch (Screen.name) {
      case "xs":
        return 16 / 9;
      case "sm":
        return 16 / 9;
      case "md":
        return 16 / 9;
      case "lg":
        return 16 / 9;
      default:
        return 2 / 1;
    }
  }
  
  function getEntityId(row: Record<string, any>, entityName: string): number {
    return row[`${entityName}Id`] as number;
  }

  function dateFormatter(value: string | number | Date) {
    return date.formatDate(value, "YYYY-MM-DD");
  }

  function dateTimeFormatter(value: string | number | Date) {
    return date.formatDate(value, "YYYY-MM-DD HH:mm:ss");
  }

  function getEntityName(entityKey: EntityURLKey): string {
    return useChangeCase(entityKey, "camelCase").value;
  }

  function getImageURL(imagePath: any) {
    return imagePath != null ? `${BLOB_URL}/${imagePath}` : IMAGES.NO_IMAGE_AVAILABLE_PLACEHOLDER;
  }

  function getImageUrlKey(entityKey: EntityURLKey): ImageURLKey {
    return `${entityKey}_IMAGE` as ImageURLKey;
  }

  const getTimeAgo = (dateTime: Date) => {
    const currentDate = new Date();
    const postDate = new Date(dateTime);
    const timeDifference = currentDate.getTime() - postDate.getTime();
    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30); // assuming 30 days per month
    const years = Math.floor(days / 365); // assuming 365 days per year

    if (years > 0) {
      return `${years} ${years === 1 ? "y" : "y"} ago`;
    } else if (months > 0) {
      return `${months} ${months === 1 ? "m" : "m"} ago`;
    } else if (days > 0) {
      return `${days} ${days === 1 ? "d" : "d"} ago`;
    } else if (hours > 0) {
      return `${hours} ${hours === 1 ? "h" : "h"} ago`;
    } else if (minutes > 0) {
      return `${minutes} ${minutes === 1 ? "min" : "min"} ago`;
    } else {
      return "Just now";
    }
  };

  // Type guard to determine if the item is an Advertisement
  function isAdvertisement(item: any): item is AdvertisementView {
    return (item as AdvertisementView).advertisementId !== undefined;
  }

  // Type guard to determine if the item is an BusinessPromotionView
  function isBusinessPromotion(item: MarketingType): item is BusinessPromotionView {
    return (item as BusinessPromotionView).businessPromotionId !== undefined;
  }

  // Type guard to determine if the item is an BusinessView
  function isBusinessView(item: CategoryTypes): item is BusinessView {
    return (item as BusinessView).businessId !== undefined;
  }

  // Type guard to determine if the item is an BusinessVoucherView
  function isBusinessVoucher(item: MarketingType): item is BusinessVoucherView {
    return (item as BusinessVoucherView).businessVoucherId !== undefined;
  }

  // Type guard to determine if the item is an Directory
  function isDirectory(item: DirectoryTypes): item is Directory {
    return (item as Directory).directoryId !== undefined;
  }

  // Type guard to determine if the item is an CommunityEvent
  function isCommunityEvent(item: BulletinTypes): item is CommunityEventView {
    return (item as CommunityEventView).communityEventId !== undefined;
  }

  // Check favaorite status of item
  function isFavouriteItem(item: CategoryTypes): boolean {
    if (isSiteView(item)) {
      const favItems = (LocalStorage.getItem(STORAGE_KEYS.SAVED.SITE) || []) as SiteView[];
      return useArraySome(favItems, fav => fav.siteId == item.siteId).value;
    } else if (isBusinessView(item)) {
      const favItems = (LocalStorage.getItem(STORAGE_KEYS.SAVED.BUSINESS) || []) as BusinessView[];
      return useArraySome(favItems, fav => fav.businessId == item.businessId).value;
    }
    return false;
  }

  function isCommunityNews(item: BulletinTypes): item is CommunityNewsView {
    return (item as CommunityNewsView).communityNewsId !== undefined;
  }

  function isCommunityNotice(item: BulletinTypes): item is CommunityNoticeView {
    return (item as CommunityNoticeView).communityNoticeId !== undefined;
  }

  function isCommunityDirectory(item: DirectoryTypes): item is CommunityDirectory {
    return (item as CommunityDirectory).communityDirectoryId !== undefined;
  }

  function isNotEmptyArray(arr: any) {
    return Array.isArray(arr) && arr.length > 0;
  }

  function isNthBitSet(value: number, n: number): boolean {
    return (value & (1 << (n - 1))) !== 0;
  }

  // Type guard to determine if the item is an isPostingView
  function isPostingView(item: CategoryTypes): item is PostingView {
    return (item as PostingView).postingId !== undefined;
  }

  // Type guard to determine if the item is an SiteView
  function isSiteView(item: CategoryTypes): item is SiteView {
    return (item as SiteView).siteId !== undefined;
  }

  function notify(message: string, type: string) {
    Notify.create({
      message: message,
      type: type
    });
  }

  function groupBy<T, K extends string | number>(
    array: T[],
    keyGetter: (item: T) => K
  ): Array<{ group: K; items: T[] }> {
    const grouped: Record<K, T[]> = {} as Record<K, T[]>;
    array.forEach(item => {
      const key = keyGetter(item);
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(item);
    });

    const sortedGroups = Object.keys(grouped).sort((a, b) => {
      if (a === "null") return 1;
      if (b === "null") return -1;
      return a.localeCompare(b);
    });

    return sortedGroups.map(key => ({
      group: (key === "null" ? t("home.other") : key) as K,
      items: grouped[key as K] // Type assertion here
    }));
  }

  // function translate(label: string, meta: any, key: string) {
  //   const { locale } = useI18n({ useScope: "global" });
  //   return meta?.i18n?.[locale.value]?.[key] || label;
  // }

  function translate(label: string, meta: any, key: string) {
    const { locale } = i18n.global;
    switch (locale) {
      case "hk":
        return meta?.i18n?.hk?.[key] ?? label;
      case "cn":
        return meta?.i18n?.cn?.[key] ?? label;
      default:
        return label;
    }
  }

  function translateAltName(locale: string, meta: any, key: string) {
    switch (locale) {
      case "hk":
        return meta?.i18n?.hk?.[key] ?? "";
      case "cn":
        return meta?.i18n?.cn?.[key] ?? "";
      default:
        return "";
    }
  }

  function translateAlt(label: string, altName: any, key: string) {
    const { locale } = i18n.global;
    return altName?.i18n?.[locale]?.[key] || label;
  }

  function sortDirectoryItems(items: any, sortByKey: any, hasSortByKey: boolean) {
    const { locale } = useI18n({ useScope: "global" });

    return items.sort((a: any, b: any) => {
      const rankingDifference = a.rank - b.rank;

      if (hasSortByKey) {
        let sortByKeyComparison;
        if (locale.value == "en") {
          sortByKeyComparison = String(a[sortByKey]).localeCompare(String(b[sortByKey]));
        } else {
          sortByKeyComparison = String(
            a?.meta?.i18n[locale.value]?.[sortByKey] ?? sortByKey
          ).localeCompare(String(b?.meta?.i18n[locale.value]?.[sortByKey] ?? b[sortByKey]));
          // If sortByKey comparison is not equal, return it; otherwise, use ranking difference
        }
        return sortByKeyComparison !== 0 ? sortByKeyComparison : rankingDifference;
      }
      // If sortByKey doesn't exist, fall back to ranking difference
      return rankingDifference || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  function toggleItemFavStatus(item: CategoryTypes, favStatus: boolean) {
    const isBusiness = isBusinessView(item);
    const id = isBusiness ? (item as BusinessView).businessId : (item as SiteView).siteId;
    const storageKey = isBusiness ? STORAGE_KEYS.SAVED.BUSINESS : STORAGE_KEYS.SAVED.SITE;

    const favItems = (LocalStorage.getItem(storageKey) || []) as (BusinessView | SiteView)[];
    const index = favItems.findIndex(
      fav => (isBusiness ? (fav as BusinessView).businessId : (fav as SiteView).siteId) === id
    );

    if (favStatus && index !== -1) {
      favItems.splice(index, 1);
    } else if (!favStatus) {
      favItems.push(item as BusinessView | SiteView);
    }

    LocalStorage.set(storageKey, favItems);
  }
  function resetObject<T>(obj: T): T {
    if (typeof obj !== "object" || obj === null) {
      return obj;
    }

    const resetObj = { ...obj };
    for (const key in resetObj) {
      if (Object.prototype.hasOwnProperty.call(resetObj, key)) {
        const value = resetObj[key];
        switch (typeof value) {
          case "string":
            resetObj[key] = "" as any;
            break;
          case "number":
            resetObj[key] = 0 as any;
            break;
          case "boolean":
            resetObj[key] = false as any;
            break;
          case "object":
            if (value instanceof Date) {
              resetObj[key] = new Date() as any;
            } else if (value !== null) {
              resetObj[key] = resetObject(value) as any;
            }
            break;
        }
      }
    }
    return resetObj;
  }

  return {
    aspectRatio,
    dateFormatter,
    dateTimeFormatter,
    eventBus,
    getEntityId,
    getEntityName,
    getImageURL,
    getImageUrlKey,
    getTimeAgo,
    groupBy,
    isAdvertisement,
    isBusinessPromotion,
    isBusinessView,
    isBusinessVoucher,
    isCommunityDirectory,
    isCommunityEvent,
    isCommunityNews,
    isCommunityNotice,
    isDirectory,
    isFavouriteItem,
    isNotEmptyArray,
    isNthBitSet,
    isPostingView,
    isSiteView,
    isSmallScreen,
    isDevelopment,
    resetObject,
    notify,
    translate,
    translateAlt,
    sortDirectoryItems,
    toggleItemFavStatus
  };
}
