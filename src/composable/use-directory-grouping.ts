// Types
import type { CategoryTypes } from "@/interfaces/types/category-types";
import type { DirectoryTypes } from "@/interfaces/types/directory-types";
import type { TabItem } from "@/interfaces/tab-item";

import { AREA_NAME, NONE } from "@/constants";

export function useDirectoryGrouping(
  categoryItems: Ref<CategoryTypes[]>,
  directory: DirectoryTypes
) {
  const { locale } = useI18n({ useScope: "global" });
  const { groupBy, translate } = useUtilities(locale.value);

  const tab = ref<string>("");

  const directoryTemplate = computed<number>(() => directory.meta.template ?? 0);

  const groupBykey = computed<string | null>(() =>
    directory.meta?.groupByKey === NONE ? null : (directory.meta?.groupByKey ?? null)
  );

  const hasGroup = computed(() => {
    return groupBykey.value !== null;
  });

  const groupedArray = computed(() => {
    if (groupBykey.value == null) {
      return [];
    }

    const key = groupBykey.value;
    const getTranslatedKey = (item: CategoryTypes): string | number => {
      if (!(key in item)) {
        return "Invalid!";
      }

      const itemValue = item[key as keyof CategoryTypes] as string;
      const metaData = key === AREA_NAME ? (item as any).areaNameAlt : item.meta;
      return translate(itemValue, metaData, key);
    };

    const validItems = categoryItems.value.filter(
      (item: CategoryTypes) => key in item && item[key as keyof CategoryTypes] !== undefined
    );

    return groupBy(validItems, getTranslatedKey);
  });

  const tabItems = computed(() => {
    return groupedArray.value
      .filter(group => typeof group.group === "string" && group.group.trim() !== "")
      .map(group => ({ name: group.group, label: group.group })) as TabItem[];
  });

  function filterGroupedArray(groupName: string) {
    const items = groupedArray.value.find(group => group.group === groupName)?.items || [];
    return items.sort((a: any, b: any) => a.rank - b.rank);
  }

  const rows = computed(() => {
    switch (true) {
      case hasGroup.value:
        return filterGroupedArray(tab.value);
      default:
        return categoryItems.value;
    }
  });

  const setTab = (val: string) => (tab.value = val);

  // Set initial tab value
  watchEffect(() => {
    if (categoryItems.value.length > 0 && groupBykey.value) {
      tab.value = tabItems.value.length > 0 ? tabItems.value[0].name : "";
    }
  });

  return {
    tab,
    directoryTemplate,
    hasGroup,
    tabItems,
    rows,
    setTab
  };
}
