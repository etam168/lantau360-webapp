<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    :model-value="isDialogVisible"
    maximized
  >
    <q-layout view="lHh lpr lFf" class="bg-white" style="max-width: 1024px">
      <q-header class="bg-transparent text-dark">
        <app-dialog-title>{{ item.directoryName }}</app-dialog-title>
      </q-header>

      <q-page-container>
        <q-page>
          <div v-if="galleryItems && galleryItems?.length > 0">
            <gallery-image-list :image-list="galleryItems" />
          </div>
          <q-card>
            <q-card-section>
              <q-item class="q-pa-none">
                <div class="text-h5 q-mt-sm q-mb-xs">{{ item.title }}</div>
                <q-space />
                <q-btn @click="repost" v-if="item.isPostExpired" outline color="red">Repost</q-btn>
              </q-item>
              <div class="text-caption text-grey">
                {{ item.postingDescription }}
              </div>
            </q-card-section>
          </q-card>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  // import { TransactionView } from "@/interfaces/models/views/trasaction-view";
  // import { useMoreInput } from "../use-more-input";
  import { PropType } from "vue";

  // Interface files
  import { GalleryImageType } from "@/interfaces/types/gallery-image-types";

  // .ts files
  import { URL } from "@/constants";

  const { dialogRef } = useDialogPluginComponent();
  const isDialogVisible = ref();
  const { t } = useI18n({ useScope: "global" });
  const $q = useQuasar();
  const error = ref<string | null>(null);
  const galleryItems = ref<GalleryImageType[]>([]);

  const props = defineProps({
    item: {
      type: Object as PropType<any>
    }
  });

  const loadData = async () => {
    try {
      const [galleryResponse] = await Promise.all([
        axios.get<GalleryImageType[]>(`${URL.POSTING_GALLERY}/${props.item.postingId}`)
      ]);

      galleryItems.value = galleryResponse.data.filter(
        element => !((1 >> (element.ranking - 1)) & 1)
      );
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response && err.response.status === 404) {
          error.value = t("errors.404");
        } else {
          error.value = t("errors.anErrorOccured");
        }
      } else {
        error.value = t("errors.anErrorOccured");
      }
    }
  };

  const repost = () => {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("./edit-dialog/point-usage-confirmation-dialog.vue")
      ),
      componentProps: {
        item: props.item
      }
    });
  };

  onMounted(() => {
    loadData();
  });
</script>
