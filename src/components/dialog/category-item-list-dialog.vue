<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
    maximized
  >
    <q-layout view="lHh lpr lFf" class="bg-white" style="max-width: 1024px">
      <q-header class="bg-transparent text-dark">
        <app-dialog-title>{{ dialogTitle }}</app-dialog-title>
      </q-header>

      <q-page-container>
        <q-page>
          <app-directory-item-list
            @item-click="onItemClick"
            :directoryItems="directoryItems"
            :favoriteItems="favoriteItems"
          />
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import { useDialogPluginComponent, useQuasar, LocalStorage } from "quasar";

  import { STORAGE_KEYS } from "@/constants";
  import { Business } from "@/interfaces/models/entities/business";
  import { Directory } from "@/interfaces/models/entities/directory";
  import { Posting } from "@/interfaces/models/entities/posting";
  import { Site } from "@/interfaces/models/entities/site";
  import eventBus from "@/utils/event-bus";

  const { dialogRef, onDialogHide } = useDialogPluginComponent();
  const { translate } = useUtilities();

  type CategoryTypes = Business | Site | Posting;

  const $q = useQuasar();
  const isDialogVisible = ref();

  const favoriteItems = ref<any>(LocalStorage.getItem(STORAGE_KEYS.SAVED.SITE) || []);

  const props = defineProps({
    directoryItemsList: {
      type: Array as PropType<CategoryTypes[]>,
      required: true
    },
    directory: {
      type: Object as PropType<Directory>,
      required: true
    }
  });

  const directoryItems = computed(() => {
    return props.directoryItemsList;
  });

  const dialogTitle = computed(() => {
    return translate(props.directory.directoryName, props.directory.meta, "directoryName");
  });

  onMounted(() => {
    eventBus.on("SiteListDialog", () => {
      isDialogVisible.value = false;
    });
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "SiteListDialog");
  }

  function onItemClick(item: CategoryTypes) {
    debugger;
    if ("siteId" in item) {
      $q.dialog({
        component: defineAsyncComponent(() => import("@/components/dialog/site-item-dialog.vue")),
        componentProps: {
          query: { siteId: (item as Site).siteId }
        }
      });
    } else if ("businessId" in item) {
      $q.dialog({
        component: defineAsyncComponent(
          () => import("@/components/dialog/business-detail-dialog.vue")
        ),
        componentProps: {
          query: { businessId: (item as Business).businessId }
        }
      });
    } else if ("postingId" in item) {
      $q.dialog({
        component: defineAsyncComponent(
          () => import("@/components/dialog/community-detail-dialog.vue")
        ),
        componentProps: {
          query: { postingId: (item as Posting).postingId }
        }
      });
    }
  }
</script>
