// useUtilities.ts
import { date, EventBus, Notify, useQuasar } from "quasar";

const eventBus = new EventBus();
const httpMethods = {
  get: async (path: any, options?: any) => axios.get(path, { params: options }),
  create: (path: any, item: any, config = {}) => axios.post(path, item, config),
  update: (path: any, item: any, config?: any) => axios.put(path, item, config),
  delete: (path: any) => axios.delete(path)
};
export function useUtilities() {
  const $q = useQuasar();

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
    return Object.keys(grouped).map(key => ({
      group: (key === "null" ? "Other" : key) as K,
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

  function formatPrice(price: number) {
    if (price <= 0) {
      return "0";
    } else if (price >= 1e8) {
      return (price / 1e6).toFixed(0).replace(/\.0$/, "") + " M";
    } else if (price >= 1e7) {
      return (price / 1e6).toFixed(1).replace(/\.0$/, "") + " M";
    } else if (price >= 1e6 && price < 1e7) {
      return (price / 1e6).toFixed(2).replace(/\.0$/, "") + " M";
    } else if (price >= 1e3) {
      return (price / 1e3).toFixed(1).replace(/\.0$/, "") + " K";
    } else {
      return price.toFixed(2).replace(/\.0$/, "");
    }
  }

  function navigateToWhatsApp(whatsAppNumber: string) {
    const whatsappURL = `https://wa.me/${whatsAppNumber}?text=Hello,%20Welcome%20to%20Lantau360.`;
    window.open(whatsappURL, "_blank");
  }

  return {
    aspectRatio,
    dateFormatter,
    eventBus,
    groupBy,
    isNotEmptyArray,
    isNthBitSet,
    navigateToWhatsApp,
    notify,
    sleep,
    translate,
    formatPrice,
    translateAltName,
    httpMethods
  };
}
