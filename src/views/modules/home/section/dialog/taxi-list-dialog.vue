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
          <div v-for="(items, groupName) in groupedItems" :key="groupName" class="q-pa-md">
            <q-item-label class="text-weight-medium text-h6">{{ groupName }}</q-item-label>

            <q-list padding class="q-pa-md">
              <q-item
                clickable
                v-for="item in directoryItems"
                :key="item.siteId"
                @click="onItemClick(item)"
                class="shadow-1 q-pa-sm q-mb-md"
              >
                <q-item-section avatar>
                  <q-avatar size="64px" square>
                    <q-img :src="computePath(item.iconPath)">
                      <template v-slot:error>
                        <div class="absolute-full flex flex-center bg-negative text-white">
                          Cannot load image
                        </div>
                      </template>
                    </q-img>
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label> {{ translate(item.title, item.meta, "title") }} </q-item-label>

                  <q-item-label>
                    {{ translate(item.subtitle1, item.meta, "subtitle1") }}
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-icon
                    v-if="isFavoriteItem(item.siteId)"
                    name="favorite"
                    size="2em"
                    color="red"
                    class="favorite-icon"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import { BLOB_URL, STORAGE_KEYS } from "@/constants";
  import { Directory } from "@/interfaces/models/entities/directory";
  import { Site } from "@/interfaces/models/entities/site";
  import { PropType, computed, defineAsyncComponent, onMounted, ref } from "vue";
  import { useDialogPluginComponent, useQuasar } from "quasar";
  import { LocalStorage } from "quasar";
  import { useUtilities } from "@/composable/use-utilities";
  import eventBus from "@/utils/event-bus";

  const { dialogRef, onDialogHide } = useDialogPluginComponent();
  const { translate } = useUtilities();

  const $q = useQuasar();
  const isDialogVisible = ref();

  const favoriteItems = ref<any>(LocalStorage.getItem(STORAGE_KEYS.FAVOURITES) || []);
  const groupedItems = ref<Record<string, Site[]>>({});

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

  const dialogTitle = computed(() => {
    return translate(props.directory.directoryName, props.directory.meta, "directoryName");
  });

  onMounted(() => {
    groupItemsByDirectory();
    eventBus.on("SiteListDialog", () => {
      isDialogVisible.value = false;
    });
  });

  eventBus.on("favoriteUpdated", ({ itemId, isFavorite }) => {
    const itemIndex = favoriteItems.value.findIndex((item: any) => item.directoryId === itemId);

    if (itemIndex !== -1) {
      if (!isFavorite) {
        // Remove the item if it's no longer a favorite
        favoriteItems.value.splice(itemIndex, 1);
      }
    } else {
      if (isFavorite) {
        // Add the item if it's newly favorited
        favoriteItems.value.push({
          directoryId: itemId
          // other properties as needed
        });
      }
    }
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "SiteListDialog");
  }

  function onItemClick(item: any) {
    $q.dialog({
      component: defineAsyncComponent(() => import("./site-detail-dialog.vue")),
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

  function groupItemsByDirectory() {
    groupedItems.value = (directoryItems.value ?? []).reduce(
      (acc: any, item: any) => {
        const { title } = item;
        if (!acc[title]) {
          acc[title] = [];
        }
        acc[title].push(item);
        return acc;
      },
      {} as Record<string, Site[]>
    );
  }
</script>
