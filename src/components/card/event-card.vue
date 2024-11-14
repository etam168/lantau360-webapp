<template>
  <q-card class="my-card">
    <q-img :ratio="11 / 8" :src="getImageURL(eventItem.bannerPath)" />

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
  import { CategoryTypes } from "@/interfaces/types/category-types";

  // .ts files
  import { CommunityEventView } from "@/interfaces/models/views/community-event-view";
  import { EntityURLKey } from "@/constants";

  const { item } = defineProps<{ item: CategoryTypes }>();

  const $q = useQuasar();
  const { translate, getImageURL } = useUtilities();
  const entityKey: EntityURLKey = "COMMUNITY_EVENT";

  const eventItem = computed(() => item as CommunityEventView);

  const translatedTitle: any = ref(translate(eventItem.value.title, eventItem.value.meta, "title"));

  const onItemClick = () => {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/category-detail-dialog/index.vue")
      ),
      componentProps: {
        category: item,
        entityKey: entityKey
      }
    });
  };

  const throttledHandleDialog = throttle(onItemClick, 2000);
</script>
