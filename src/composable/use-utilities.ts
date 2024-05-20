// interface files
import { AdvertisementView } from "@/interfaces/models/views/advertisement-view";
import { CommunityDirectory } from "@/interfaces/models/entities/community-directory";
import { Directory } from "@/interfaces/models/entities/directory";
import { DirectoryTypes } from "@/interfaces/types/directory-types";

// .ts file
import i18n from "@/plugins/i18n/i18n";
import { BLOB_URL, PLACEHOLDER_THUMBNAIL } from "@/constants";
import { date, EventBus, Notify, Screen } from "quasar";
import { useUserStore } from "@/stores/user";

const eventBus = new EventBus();

const httpMethods = {
  get: async (path: any, options?: any) => axios.get(path, { params: options }),
  create: (path: any, item: any, config = {}) => axios.post(path, item, config),
  update: (path: any, item: any, config?: any) => axios.put(path, item, config),
  delete: (path: any) => axios.delete(path)
};

export function useUtilities() {
  const { t } = i18n.global;
  const isSmallScreen = computed(() => Screen.lt.sm);

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

  function dateFormatter(value: string | number | Date) {
    return date.formatDate(value, "YYYY-MM-DD");
  }

  function dateTimeFormatter(value: string | number | Date) {
    return date.formatDate(value, "YYYY-MM-DD HH:mm:ss");
  }

  function getImageURL(relativePath: any) {
    if (relativePath != null) {
      return relativePath.includes("http") ? relativePath : `${BLOB_URL}/${relativePath}`;
    } else {
      return PLACEHOLDER_THUMBNAIL;
    }
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

  // Type guard to determine if the item is an Directory
  function isDirectory(item: DirectoryTypes): item is Directory {
    return (item as Directory).directoryId !== undefined;
  }

  // Type guard to determine if the item is an CommunityDirectory
  function isCommunityDirectory(item: DirectoryTypes): item is CommunityDirectory {
    return (item as CommunityDirectory).communityDirectoryId !== undefined;
  }

  function isNotEmptyArray(arr: any) {
    return Array.isArray(arr) && arr.length > 0;
  }

  function isNthBitSet(value: number, n: number): boolean {
    return (value & (1 << (n - 1))) !== 0;
  }

  function notify(message: string, type: string) {
    Notify.create({
      message: message,
      type: type
    });
  }

  // function sleep(ms: number) {
  //   return new Promise(resolve => setTimeout(resolve, ms));
  // }

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

  function translate(label: string, meta: any, key: string) {
    const { locale } = useI18n({ useScope: "global" });
    return meta?.i18n?.[locale.value]?.[key] || label;
  }

  function translateAlt(label: string, altName: any, key: string) {
    const { locale } = useI18n({ useScope: "global" });
    return altName?.i18n?.[locale.value]?.[key] || label;
  }

  // function translateAltName(locale: string, meta: any, key: string) {
  //   switch (locale) {
  //     case "hk":
  //       return meta?.i18n?.hk?.[key] ?? "";
  //     case "cn":
  //       return meta?.i18n?.cn?.[key] ?? "";
  //     default:
  //       return "";
  //   }
  // }

  function navigateToWhatsApp(whatsAppNumber: string) {
    const whatsappURL = `https://wa.me/${whatsAppNumber}?text=Hello,%20Welcome%20to%20Lantau360.`;
    window.open(whatsappURL, "_blank");
  }

  async function refreshToken() {
    const userStore = useUserStore();
    try {
      const response = await axios.post(`/MemberAuth/RefreshToken`, {
        accessToken: userStore.token,
        refreshToken: userStore.refreshToken
      });
      const { accessToken, tokenRefresh } = response.data;
      userStore.token = accessToken;
      userStore.refreshToken = tokenRefresh;
      return accessToken;
    } catch (error) {
      console.error("Error refreshing token:", error);
      throw error;
    }
  }

  return {
    aspectRatio,
    dateFormatter,
    dateTimeFormatter,
    eventBus,
    getImageURL,
    getTimeAgo,
    groupBy,
    httpMethods,
    isAdvertisement,
    isCommunityDirectory,
    isDirectory,
    isNotEmptyArray,
    isNthBitSet,
    isSmallScreen,
    navigateToWhatsApp,
    notify,
    // sleep,
    translate,
    translateAlt,
    // translateAltName,
    refreshToken
  };
}
