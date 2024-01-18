// useUtilities.ts
import { date, EventBus, Notify, useQuasar } from "quasar";
import i18n from "@/plugins/i18n/i18n";
import { BLOB_URL, PLACEHOLDER_THUMBNAIL } from "@/constants";

const eventBus = new EventBus();
const httpMethods = {
  get: async (path: any, options?: any) => axios.get(path, { params: options }),
  create: (path: any, item: any, config = {}) => axios.post(path, item, config),
  update: (path: any, item: any, config?: any) => axios.put(path, item, config),
  delete: (path: any) => axios.delete(path)
};

export function useUtilities() {
  const $q = useQuasar();
  const { t } = i18n.global;
  const isSmallScreen = computed(() => $q.screen.lt.sm);

  function aspectRatio() {
    switch ($q.screen.name) {
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

  function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

  function translate(label: string, meta: any, key: string) {
    const { locale } = useI18n({ useScope: "global" });
    return meta?.i18n?.[locale.value]?.[key] || label;
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

  function navigateToWhatsApp(whatsAppNumber: string) {
    const whatsappURL = `https://wa.me/${whatsAppNumber}?text=Hello,%20Welcome%20to%20Lantau360.`;
    window.open(whatsappURL, "_blank");
  }

  function getImageURL(relativePath: any) {
    return relativePath ? `${BLOB_URL}/${relativePath}` : PLACEHOLDER_THUMBNAIL;
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
      return `${years} ${years === 1 ? "year" : "years"} ago`;
    } else if (months > 0) {
      return `${months} ${months === 1 ? "month" : "months"} ago`;
    } else if (days > 0) {
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    } else if (hours > 0) {
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    } else if (minutes > 0) {
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    } else {
      return "Just now";
    }
  };

  return {
    aspectRatio,
    dateFormatter,
    eventBus,
    groupBy,
    isNotEmptyArray,
    isNthBitSet,
    isSmallScreen,
    navigateToWhatsApp,
    notify,
    sleep,
    translate,
    translateAltName,
    httpMethods,
    getImageURL,
    getTimeAgo
  };
}
