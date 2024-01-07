<template>
  <q-item>
    <app-text-editor v-model="translatedContent" />
  </q-item>
</template>

<script setup lang="ts">
  // Interface files
  import { Advertisement } from "@/interfaces/models/entities/advertisement";
  import { MarketingType } from "@/interfaces/types/marketing-types";

  const props = defineProps({
    item: {
      type: Object as PropType<MarketingType>,
      required: true
    }
  });

  const advertisementItem = computed(() => props.item as Advertisement);

  const { translate, eventBus } = useUtilities();

  const isDialogVisible = ref();
  const translatedContent: any = computed(() => {
    return translate(
      advertisementItem.value["description"],
      advertisementItem.value.meta,
      "description"
    );
  });
  onMounted(() => {
    eventBus.on("CategoryDetailDialog", () => {
      isDialogVisible.value = false;
    });
  });
</script>
