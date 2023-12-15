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
        <q-page class="relative-position">
          <q-list padding class="q-pa-md">
            <q-item
              clickable
              v-for="item in directoryItems"
              :key="item.postingId"
              @click="onItemClick(item)"
              class="shadow-1 q-pa-sm q-mb-md"
            >
              <q-item-section avatar>
                <q-avatar size="64px" square>
                  <q-img ratio="1" :src="computePath(item.imagePath)" />
                  <template v-slot:error>
                    <div class="absolute-full flex flex-center bg-negative text-white">
                      Cannot load image
                    </div>
                  </template>
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
            </q-item>
          </q-list>
          <q-page-sticky class="absolute-bottom-right q-pa-md">
            <q-btn fab icon="add" color="primary" @click="addPosting('login')" />
          </q-page-sticky>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import { LocalStorage } from "quasar";

  //import { PLACEHOLDER_THUMBNAIL } from "@/constants";
  import { Posting } from "@/interfaces/models/entities/posting";
  import { Directory } from "@/interfaces/models/entities/directory";
  import { PropType, computed, defineAsyncComponent, onMounted, ref } from "vue";
  import { useDialogPluginComponent, useQuasar } from "quasar";
  import { useUtilities } from "@/composable/use-utilities";
  import eventBus from "@/utils/event-bus";
  import { STORAGE_KEYS } from "@/constants";
  // import { useRouter } from "vue-router";
  // const router = useRouter();
  const $q = useQuasar();
  const { translate } = useUtilities();
  const isLogon = ref<any>(LocalStorage.getItem(STORAGE_KEYS.IsLogOn));

  const isDialogVisible = ref();

  const { dialogRef, onDialogHide } = useDialogPluginComponent();

  const props = defineProps({
    directoryItemsList: {
      type: Array as () => Posting[]
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
    eventBus.on("PostListDialog", () => {
      isDialogVisible.value = false;
    });
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "PostListDialog");
  }

  function addPosting(tabValue: string) {
    if (!isLogon.value) {
      $q.dialog({
        component: defineAsyncComponent(() => import("@/components/dialog/confirm-dialog.vue"))
      });
    } else {
      $q.dialog({
        component: defineAsyncComponent(() => import("@/views/auth/login-dialog.vue")),
        componentProps: {
          tabValue: tabValue
        }
      });
    }
  }

  function onItemClick(item: any) {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/community-detail-dialog.vue")
      ),
      componentProps: {
        query: { postingId: item.postingId }
      }
    });
  }

  const computePath = (path: string) => {
    return path ? `${path}` : "/no_image_available.jpeg";
  };
</script>

<style scoped>
  .button-margin {
    margin-right: 40px;
  }
</style>
