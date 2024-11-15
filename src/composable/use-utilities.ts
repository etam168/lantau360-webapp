// .ts file
import i18n from "@/plugins/i18n/i18n";
import { useChangeCase } from "@vueuse/integrations/useChangeCase";
import { BLOB_URL, EntityURLKey, IMAGES } from "@/constants";
import { date, Notify, Screen } from "quasar";
import { ImageURLKey } from "@/constants/app/image-url";

// const eventBus = new EventBus();
const eventBus = (key: string) => useEventBus<any>(key);

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
    const { locale } = i18n.global;

    switch (locale.value) {
      case "hk":
        return meta?.i18n?.hk?.[key] ?? label;
      case "cn":
        return meta?.i18n?.cn?.[key] ?? label;
      default:
        return label;
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
    groupBy,
    isNotEmptyArray,
    isNthBitSet,
    isSmallScreen,
    isDevelopment,
    resetObject,
    notify,
    translate,
    translateAlt,
    sortDirectoryItems
  };
}
