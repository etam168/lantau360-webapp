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
    <q-layout view="hHh lpR fFf" class="bg-white" style="max-width: 1024px">
      <q-header class="flex flex-center bg-transparent text-dark">
        <app-dialog-title style="max-width: 1024px">{{
          translate(directory.directoryName, directory.meta, "directoryName")
        }}</app-dialog-title>
      </q-header>

      <q-page-container>
        <q-page>
          <q-item
            clickable
            v-for="item in directoryItems"
            :key="item.siteId"
            @click="onItemClick(item)"
            class="shadow-1 q-mb-md q-pl-sm"
          >
            <q-item-section avatar>
              <q-avatar size="64px" square>
                <q-img ratio="1" :src="computePath(item.iconPath)" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>
                {{ translate(item.title, item.meta, "title") }}
              </q-item-label>

              <q-item-label>
                {{ translate(item.subtitle1, item.meta, "subtitle1") }}
              </q-item-label>
            </q-item-section>
            <q-item-section side v-if="isFavoriteItem(item.siteId)">
              <q-icon name="favorite" size="2em" color="red" />
            </q-item-section>
          </q-item>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import { BLOB_URL, STORAGE_KEYS } from "@/constants";
  import { PropType, computed, defineAsyncComponent, onMounted, ref } from "vue";
  import { useDialogPluginComponent, useQuasar } from "quasar";
  import { LocalStorage } from "quasar";
  import { useUtilities } from "@/composable/use-utilities";
  import { Directory } from "@/interfaces/models/entities/directory";
  import { Site } from "@/interfaces/models/entities/site";
  import eventBus from "@/utils/event-bus";

  const { dialogRef, onDialogHide } = useDialogPluginComponent();
  const favoriteItems = ref<any>(LocalStorage.getItem(STORAGE_KEYS.FAVOURITES) || []);

  const { translate } = useUtilities();

  const $q = useQuasar();

  const isDialogVisible = ref();

  const props = defineProps({
    directoryItemsList: {
      type: Array as () => Site[]
    },
    directory: {
      type: Object as PropType<Directory>,
      required: true
    }
  });

  const directoryItems = computed(() => {
    return props.directoryItemsList;
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

  function onItemClick(item: any) {
    $q.dialog({
      component: defineAsyncComponent(() => import("./dialog/site-detail-dialog.vue")),
      componentProps: {
        query: { siteId: item.siteId }
      }
    });
  }

  const computePath = (path: string) => {
    return path ? `${BLOB_URL}/${path}` : "/no_image_available.jpeg";
  };

  const isFavoriteItem = (siteId: string | number): boolean => {
    return favoriteItems.value.some((item: any) => item.directoryId === siteId);
  };
</script>
