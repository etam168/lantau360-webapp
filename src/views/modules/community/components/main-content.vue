<template>
  <q-table v-bind="$attrs" flat grid hide-header hide-pagination :rows="rows" :row-key="rowKey">
    <template v-slot:top>
      <q-banner :inline-actions="!isSmallScreen" class="full-width">
        <q-toolbar-title :class="titleClass">{{ $t(`${i18nKey}.title`) }}</q-toolbar-title>

        <template v-slot:action>
          <app-tab-select
            :tab-items="tabItems"
            :current-tab="tab"
            @update:currentTab="setTab"
            :class="$q.screen.lt.sm ? 'justify-center' : ''"
          />
        </template>
      </q-banner>

      <q-card-actions v-if="hasSearchBar" class="full-width" align="center">
        <app-search-bar v-model:keyword="keyword" @on-search="handleSearchDialog" />
      </q-card-actions>
    </template>

    <template v-slot:item="{ row }">
      <div class="col-xs-4 col-md-3 q-pa-xs">
        <app-menu-item-event v-if="tab === 'events'" :item="row" :entity-key="'COMMUNITY_EVENT'" />

        <app-menu-item-notice
          v-else-if="tab === 'notice'"
          :item="row"
          :entity-key="'COMMUNITY_NOTICE'"
        />

        <app-menu-item-directory v-else :item="row" @on-directory-item="handleDirectoryItem" />
      </div>
    </template>
  </q-table>
</template>

<script setup lang="ts">
  // Types
  import type { CommunityDirectory } from "@/interfaces/models/entities/community-directory";
  import type { CommunityEventView } from "@/interfaces/models/views/community-event-view";
  import type { CommunityNoticeView } from "@/interfaces/models/views/community-notice-view";
  import type { TabItem } from "@/interfaces/tab-item";

  // Constants
  import type { EntityURLKey } from "@/constants";

  // Props
  const {
    events,
    notices,
    directoryData,
    entityKey,
    i18nKey = ""
  } = defineProps<{
    events: CommunityEventView[];
    notices: CommunityNoticeView[];
    directoryData: CommunityDirectory[];
    entityKey: EntityURLKey;
    i18nKey?: string;
  }>();

  const { t, locale } = useI18n({ useScope: "global" });
  const { isSmallScreen, getEntityKeyName } = useUtilities(locale.value);

  const $q = useQuasar();
  const keyword = ref("");
  const tab = ref("events");

  const titleClass = computed(() => (isSmallScreen.value ? "text-center" : ""));
  const isDialogOpen = ref(false);

  const tabItems = ref<TabItem[]>([
    { name: "events", label: t(`${i18nKey}.tabItem.events`) },
    { name: "notice", label: t(`${i18nKey}.tabItem.notice`) },
    { name: "directory", label: t(`${i18nKey}.tabItem.directory`) }
  ]);

  const hasSearchBar = computed(() => {
    return tab.value === "directory";
  });

  const rows = computed(() => {
    switch (tab.value) {
      case "events":
        return events;
      case "notice":
        return notices;
      default:
        return directoryData;
    }
  });

  const rowKey = computed(() => {
    const entityKeyName = getEntityKeyName(entityKey);
    switch (tab.value) {
      case "events":
        return `${entityKeyName}EventId`;
      case "notice":
        return `${entityKeyName}NoticeId`;
      default:
        return `${entityKeyName}DirectoryId`;
    }
  });

  const setTab = (val: string) => (tab.value = val);

  const { openCommunityItemDialog } = useCommunityDialogService(entityKey);

  function handleSearchDialog() {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/catergory-items-search-dialog/index.vue")
      ),
      componentProps: {
        entityKey: entityKey,
        i18nKey: i18nKey,
        keyword: keyword.value
      }
    }).onDismiss(() => {
      keyword.value = "";
    });
  }

  async function handleDirectoryItem(directory: CommunityDirectory) {
    if (!isDialogOpen.value) {
      const dialogName = "PostingListDialog";
      openCommunityItemDialog(isDialogOpen, "POSTING", directory, dialogName);
    }
  }
</script>

<style lang="scss">
  .q-table__top {
    padding: 0 !important;
  }
</style>
