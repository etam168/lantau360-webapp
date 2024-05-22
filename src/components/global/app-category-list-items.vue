<template>
  <q-list :class="[template === TEMPLATE.DAYTRIP.value ? ($q.screen.gt.xs ? 'row' : '') : '']">
    <q-item
      clickable
      v-for="item in directoryItems"
      :key="item.directoryId"
      @click="handleItemClick(item)"
      class="shadow-1 q-pa-sm q-mb-md"
    >
      <daytrip-renderer
        :style="{ width: $q.screen.lt.sm ? '100%' : '300px' }"
        v-if="template === TEMPLATE.DAYTRIP.value"
        :item="item"
      />

      <community-renderer
        v-else-if="isCommunityDirectory(directory)"
        :item="item"
        :directory="directory"
      />
      <directory-renderer
        v-else
        :item="item"
        :favorite-items="favoriteItems"
        :directory-check-ins="directoryCheckIns"
      /> </q-item
  ></q-list>

  <q-card
    v-if="directoryItems.length == 0"
    flat
    style="min-height: calc(100vh - 228px)"
    class="row justify-center items-center"
  >
    <q-card-section class="text-center">
      <div class="text-h6 text-weight-regular q-mt-md text-grey-6 text-weight-bold">
        {{ $t("errors.noRecord") }}
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";

  // Components
  import DaytripRenderer from "../dialog/renderer/category-item-list/daytrip-renderer.vue";
  import DirectoryRenderer from "../dialog/renderer/category-item-list/directory-renderer.vue";
  import CommunityRenderer from "../dialog/renderer/category-item-list/community-renderer.vue";

  // .ts files
  import { TEMPLATE } from "@/constants";
  import { CheckIn } from "@/interfaces/models/entities/checkin";
  import { DirectoryTypes } from "@/interfaces/types/directory-types";
  import { BusinessView } from "@/interfaces/models/views/business-view";
  import { SiteView } from "@/interfaces/models/views/site-view";
  import { Directory } from "@/interfaces/models/entities/directory";

  // others import
  import { LocalStorage } from "quasar";
  import { STORAGE_KEYS, URL } from "@/constants";
  import { useUserStore } from "@/stores/user";

  const props = defineProps({
    directoryItems: {
      type: Array as PropType<CategoryTypes[]>,
      required: true,
      default: () => []
    },
    directory: {
      type: Object as PropType<DirectoryTypes>,
      required: true
    },
    directoryCheckIns: {
      type: Array as PropType<CheckIn[]>,
      required: true
    }
  });

  const { isSiteView, isBusinessView } = useUtilities();
  const favoriteItems = ref<any>(getFavItem() || []);
  const checkInItems = ref<any>(props?.directoryCheckIns ?? []);
  const { eventBus, isCommunityDirectory } = useUtilities();
  const userStore = useUserStore();
  const $q = useQuasar();

  const template = computed(() => props.directory.meta?.template);

  onMounted(() => {
    eventBus.on("favoriteUpdated", () => {
      favoriteItems.value = getFavItem();
    });

    eventBus.on("refresh-directory-checkin-items", () => {
      refreshCheckInItems();
    });
  });

  function getFavItem() {
    if (props.directoryItems.length === 0) {
      return [];
    }

    const item = props.directoryItems[0];
    switch (true) {
      case isSiteView(item):
        return (LocalStorage.getItem(STORAGE_KEYS.SAVED.SITE) || []) as SiteView[];
      case isBusinessView(item):
        return (LocalStorage.getItem(STORAGE_KEYS.SAVED.BUSINESS) || []) as BusinessView[];
      default:
        return [];
    }
  }

  const refreshCheckInItems = async () => {
    try {
      const memberDirectoryCheckInUrl = `${URL.MEMBER_DIRECTORY_CHECK_IN}?memberId=${userStore.userId}&directoryId=${(props.directory as Directory).directoryId}`;
      const response = await axios.get(memberDirectoryCheckInUrl);
      checkInItems.value = response.status == 200 ? response.data : [];
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  function handleItemClick(item: CategoryTypes) {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/category-detail-dialog.vue")
      ),
      componentProps: {
        item: item
      }
    });
  }
</script>
