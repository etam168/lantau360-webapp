// .ts file
import i18n from "@/plugins/i18n/i18n";
import { useChangeCase } from "@vueuse/integrations/useChangeCase";
import { BLOB_URL, EntityURLKey, IMAGES, ImageURLKey } from "@/constants";
import { date, Notify, Screen } from "quasar";

const eventBus = (key: string) => useEventBus<any>(key);

export function useUtilities() {
  const { t } = i18n.global;
  const isSmallScreen = computed(() => Screen.lt.sm);
  const isDevelopment = import.meta.env.NODE_ENV === "development";

  function aspectRatio() {
    switch (Screen.name) {
      case "xs":
      case "sm":
      case "md":
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

  function getEntityId(row: Record<string, any>, entityName: string): number {
    return row[`${entityName}Id`] as number;
  }

  function getEntityName(entityKey: EntityURLKey): string {
    return useChangeCase(entityKey, "camelCase").value;
  }

  function getImageURL(imagePath: string | null | undefined): string {
    return imagePath ? `${BLOB_URL}/${imagePath}` : IMAGES.NO_IMAGE_AVAILABLE_PLACEHOLDER;
  }

  function getImageUrlKey(entityKey: EntityURLKey): ImageURLKey {
    return `${entityKey}_IMAGE` as ImageURLKey;
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

    switch (locale) {
      case "hk":
      case "cn":
        return meta?.i18n?.[locale]?.[key] ?? label;
      default:
        return label;
    }
  }

  function translateAlt(label: string, altName: any, key: string) {
    const { locale } = i18n.global;
    return altName?.i18n?.[locale]?.[key] || label;
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
    isSmallScreen,
    isDevelopment,
    aspectRatio,
    dateFormatter,
    dateTimeFormatter,
    eventBus,
    getEntityId,
    getEntityName,
    getImageURL,
    getImageUrlKey,
    groupBy,
    notify,
    resetObject,
    translate,
    translateAlt
  };
}
