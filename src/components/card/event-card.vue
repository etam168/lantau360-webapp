<template>
  <q-card class="my-card">
    <q-img :ratio="11 / 8" :src="imagePath" />

    <q-card-section class="q-pa-sm">
      <q-item dense class="q-py-none">
        <q-item-section>
          <q-item-label style="font-family: Baloo; font-size: 1rem">{{
            translatedTitle
          }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-card-section>

    <q-card-actions>
      <q-btn
        outline
        dense
        color="primary"
        :label="$t('business.moreDetail')"
        class="full-width"
        @click="throttledHandleDialog"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
  // Quasar Import
  import { throttle, useQuasar } from "quasar";

  // Interface files
  import { BulletinTypes } from "@/interfaces/types/bulletin-types";

  // .ts files
  import { BLOB_URL } from "@/constants";
  import { CommunityEventView } from "@/interfaces/models/views/community-event-view";

  const props = defineProps({
    item: {
      type: Object as PropType<BulletinTypes>,
      required: true
    }
  });

  const $q = useQuasar();
  const { translate } = useUtilities();

  const eventItem = computed(() => props.item as CommunityEventView);

  const translatedTitle: any = ref(translate(eventItem.value.title, eventItem.value.meta, "title"));

  const onItemClick = () => {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/bulletin-detail-dialog.vue")
      ),
      componentProps: {
        item: props.item
      }
    });
  };

  const imagePath = computed(() => {
    return eventItem.value.bannerPath
      ? `${BLOB_URL}/${eventItem.value.bannerPath}`
      : "./img/icons/no_image_available.jpeg";
  });

  const throttledHandleDialog = throttle(onItemClick, 2000);
</script>
