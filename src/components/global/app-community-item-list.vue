<template>
  <div>
    <q-card class="q-mb-md">
      <q-item clickable v-ripple @click="createPosting">
        <q-item-section avatar>
          <q-avatar color="green-1" text-color="primary" icon="add" />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{
            $t("action.createDirectory", { directoryName: directoryName })
          }}</q-item-label>
          <q-item-label caption>{{
            $t("community.createPost.addGalleryDescription")
          }}</q-item-label></q-item-section
        >
      </q-item>
    </q-card>

    <app-tab-select
      :tab-items="tabItems"
      :current-tab="tab"
      @update:currentTab="setTab"
      class="q-pl-none"
    />

    <q-tab-panels v-model="tab" style="width: 100%; height: 100%">
      <q-tab-panel name="allDirectory" class="q-pa-none">
        <app-community-tab-item-list
          :directoryItems="directoryItems"
          :directory="directory"
          @item-click="handleItemClick"
        />
      </q-tab-panel>
      <q-tab-panel name="myDirectory" class="q-pa-none">
        <app-community-tab-item-list
          :directoryItems="myDirectoryItems"
          :directory="directory"
          @item-click="handleItemClick"
        />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
<script setup lang="ts">
  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { CommunityDirectory } from "@/interfaces/models/entities/community-directory";
  import { Posting } from "@/interfaces/models/entities/posting";

  // .ts files
  import { useUserStore } from "@/stores/user";

  const $q = useQuasar();

  const emit = defineEmits(["item-click", "create-posting"]);
  const { eventBus } = useUtilities();

  const props = defineProps({
    directoryItems: {
      type: Array as PropType<CategoryTypes[]>,
      required: true,
      default: () => []
    },
    directory: {
      type: Object as PropType<CommunityDirectory>,
      required: false
    },
    template: {
      type: Number,
      required: false
    }
  });

  const { translateAlt, translate } = useUtilities();
  const { t } = useI18n({ useScope: "global" });

  const userStore = useUserStore();

  const directoryName = computed(() => {
    const { directoryName, directoryNameAlt } = props.directory as CommunityDirectory;

    // Check if directoryNameAlt exists and is not null
    if (directoryNameAlt !== undefined && directoryNameAlt !== null) {
      return translateAlt(directoryName, directoryNameAlt, "directoryName");
    } else {
      return translate(directoryName, props?.directory?.meta, "directoryName");
    }
  });

  const myDirectoryItems = computed(() => {
    return props.directoryItems.filter(item => userStore.userId === (item as Posting).memberId);
  });

  const setTab = (val: string) => (tab.value = val);
  const tab = ref("allDirectory");
  const tabItems = ref([
    {
      name: "allDirectory",
      label: t("community.tabItems.allDirectory", { directory: directoryName.value })
    },
    {
      name: "myDirectory",
      label: t("community.tabItems.myDirectory", { directory: directoryName.value })
    }
  ]);

  function handleItemClick(item: CategoryTypes) {
    emit("item-click", item);
  }

  function createPosting() {
    if (!userStore.isUserLogon()) {
      $q.dialog({
        component: defineAsyncComponent(
          () => import("@/components/dialog/app-login-dialog-widget.vue")
        )
      });
    } else {
      emit("create-posting");
    }
  }

  onMounted(() => {
    eventBus.on("on-login-success", () => {
      emit("create-posting");
    });
  });
</script>
