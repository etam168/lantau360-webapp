<template>
  <q-list padding class="q-mx-sm q-pa-none">
    <q-item>
      <q-item-section top>
        <q-item-label v-if="item.subtitle1" class="text-caption text-weight-light"
          >{{ translate(item.subtitle1, item.meta, "subtitle1") }}
        </q-item-label>
      </q-item-section>

      <q-item-section side>
        <div class="q-gutter-md">
          <app-button-rounded v-if="item.contactPhone" icon="phone" @click="navigateToPhone" />
          <app-button-rounded
            v-if="item.contactWhatsApp"
            icon="fab fa-whatsapp"
            @click="navigateToWhatsApp(item.contactWhatsApp)"
          />
        </div>
      </q-item-section>
    </q-item>

    <q-item>
      <app-text-editor v-model="translatedContent" />
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  import { MarketingType } from "@/interfaces/types/marketing-types";

  const { eventBus, navigateToWhatsApp, translate } = useUtilities();

  const props = defineProps({
    item: {
      type: Object as PropType<MarketingType>,
      required: true
    }
  });

  const isDialogVisible = ref();

  const navigateToPhone = () => {
    if (props?.item.contactPhone) {
      const phoneURL = `tel:${props?.item.contactPhone}`;
      window.location.href = phoneURL;
    }
  };

  onMounted(() => {
    eventBus.on("BusinessPromotionDialog", () => {
      isDialogVisible.value = false;
    });
  });
  const translatedContent: any = computed(() => {
    return props.item.description;
  });
</script>
<style scoped>
  .button-margin {
    margin-right: 40px;
  }
</style>
