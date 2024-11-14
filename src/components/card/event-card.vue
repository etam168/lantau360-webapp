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
        :label="$t(`${i18nKey}.moreDetail`)"
        class="full-width"
        @click="onItemClick"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
  // Interface files
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { CommunityEventView } from "@/interfaces/models/views/community-event-view";

  // .ts files
  import { EntityURLKey } from "@/constants";

  // Props
  const { item } = defineProps<{ item: CategoryTypes }>();

  const i18nKey = "business";
  const entityKey: EntityURLKey = "COMMUNITY_EVENT";

  const { eventBus, translate, getImageURL } = useUtilities();
  const { openCategoryDetailDialog } = useCategoryDialogService(entityKey);

  const eventItem = computed(() => item as CommunityEventView);

  const translatedTitle: any = ref(translate(eventItem.value.title, eventItem.value.meta, "title"));

  const onItemClick = () => {
    const dialogName = "EventDetail";
    eventBus("DialogStatus").emit(true, dialogName);
    openCategoryDetailDialog(item, dialogName);
  };
</script>
