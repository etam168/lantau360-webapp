// Types
import type { CategoryTypes } from "@/interfaces/types/category-types";
import type { Transaction } from "@/interfaces/models/entities/transaction";

import { EntityURLKey } from "@/constants";

export function useTransactionGrouping(
  transactionItems: Ref<Transaction[]>,
  entityKey: EntityURLKey
) {
  const { t } = useI18n({ useScope: "global" });
  const { groupBy, getEntityName, translate } = useUtilities();
  const i18nKeyMoreDialog = "more.mainMenuDialog";
  const tab = ref<string>("");

  const entityName = getEntityName(entityKey);

  const hasGroup = computed(() => {
    return true;
  });

  // Define an interface for the group object
  interface GroupedItems {
    group: string | number;
    items: CategoryTypes[];
  }

  const groupedArray = computed<GroupedItems[]>(() => {
    // Filter the history for the last 3 months for 'recent'
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const recentItems = transactionItems.value.filter(
      (item: Transaction) => new Date(item.createdAt) >= threeMonthsAgo
    );

    const historyItems = transactionItems.value;
    return [
      { group: "recent", items: recentItems },
      { group: "history", items: historyItems }
    ];
  });

  const tabItems = computed(() => {
    return [
      { name: "recent", label: t(`${i18nKeyMoreDialog}.${entityName}.recent`) },
      { name: "history", label: t(`${i18nKeyMoreDialog}.${entityName}.history`) }
    ];
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
        return transactionItems.value;
    }
  });

  const setTab = (val: string) => (tab.value = val);

  // Set initial tab value
  watchEffect(() => {
    if (transactionItems.value.length > 0) {
      tab.value = tabItems.value.length > 0 ? tabItems.value[0].name : "";
    }
  });

  return {
    tab,
    hasGroup,
    tabItems,
    rows,
    setTab
  };
}
