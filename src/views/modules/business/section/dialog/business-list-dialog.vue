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
          <q-list padding class="q-pa-md">
            <q-item
              clickable
              v-for="item in directoryItems"
              :key="item.businessId"
              @click="onItemClick(item)"
              class="shadow-1 q-pa-sm q-mb-md"
            >
              <q-item-section avatar>
                <q-avatar size="64px" square>
                  <q-img ratio="1" :src="computePath(item.iconPath)">
                    <template v-slot:error>
                      <div class="absolute-full flex flex-center bg-negative text-white">
                        Cannot load image
                      </div>
                    </template>
                  </q-img>
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
          </q-list>
        </q-page>
      </q-page-container>
    </q-layout>
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

  const dialogTitle = computed(() => {
    return translate(props.directory.directoryName, props.directory.meta, "directoryName");
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
      component: defineAsyncComponent(() => import("./business-detail-dialog.vue")),
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
