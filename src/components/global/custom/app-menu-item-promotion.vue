<template>
  <q-card flat>
    <q-img :ratio="11 / 8" :src="getImageURL(item.bannerPath)" />

    <q-card-section>
      <q-item dense class="q-pa-none">
        <q-item-section>
          <q-item-label>{{ translatedTitle }}</q-item-label>
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
        @click="handleClick"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
  import type { BusinessPromotionView } from "@/interfaces/models/views/business-promotion-view";

  // Emits
  const emit = defineEmits(["on-promotion-item"]);

  // Props
  const { item, i18nKey = "" } = defineProps<{
    item: BusinessPromotionView;
    i18nKey?: string;
  }>();

  const { locale } = useI18n({ useScope: "global" });
  const { getImageURL, translate } = useUtilities(locale.value);

  const translatedTitle: any = ref(
    translate(item.businessPromotionName, item.meta, "businessPromotionName")
  );

  function handleClick() {
    emit("on-promotion-item", item);
  }
</script>
