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
    <q-card style="max-width: 1024px">
      <q-layout view="hHh lpR fFf">
        <q-card-actions align="center" class="button-margin">
          <q-btn dense flat icon="arrow_back" v-close-popup> </q-btn>
          <q-space />
          <div class="text-h6 text-weight-medium">
            {{ translate(directory.directoryName, directory.meta, "directoryName") }}
          </div>
          <q-space />
        </q-card-actions>

        <q-page-container class="q-mx-md q-my-md">
          <q-item
            clickable
            v-for="item in directoryItems"
            :key="item.businessId"
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

            <q-item-section side v-if="isFavoriteItem(item.businessId)">
              <q-icon name="favorite" size="2em" color="red" />
            </q-item-section>
          </q-item>
        </q-page-container>
      </q-layout>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  import { BLOB_URL, STORAGE_KEYS } from "@/constants";
  import { Business } from "@/interfaces/models/entities/business";
  import { PropType, computed, defineAsyncComponent, onMounted, ref } from "vue";
  import { useDialogPluginComponent, useQuasar } from "quasar";
  import { Directory } from "@/interfaces/models/entities/directory";
  import { useUtilities } from "@/composable/use-utilities";
  import { LocalStorage } from "quasar";
  import eventBus from "@/utils/event-bus";

  const favoriteItems = ref<any>(LocalStorage.getItem(STORAGE_KEYS.FAVOURITES) || []);

  const $q = useQuasar();
  const { translate } = useUtilities();

  const isDialogVisible = ref();

  const { dialogRef, onDialogHide } = useDialogPluginComponent();

  const props = defineProps({
    directoryItemsList: {
      type: Array as () => Business[]
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
    eventBus.on("BusinessListDialog", () => {
      isDialogVisible.value = false;
    });
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "BusinessListDialog");
  }

  function onItemClick(item: any) {
    $q.dialog({
      component: defineAsyncComponent(() => import("./dialog/business-detail-dialog.vue")),
      componentProps: {
        query: { businessId: item.businessId }
      }
    });
  }

  const computePath = (path: string) => {
    return path ? `${BLOB_URL}/${path}` : "/no_image_available.jpeg";
  };

  const isFavoriteItem = (businessId: string | number): boolean => {
    return favoriteItems.value.some((item: any) => item.directoryId === businessId);
  };
</script>

<style scoped>
  .button-margin {
    margin-right: 40px;
  }
</style>
