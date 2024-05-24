<template>
  <q-list padding class="q-mx-sm q-pa-none">
    <q-item v-if="item.subtitle1">
      <q-item-section top>
        <q-item-label v-if="item.subtitle1" class="text-caption text-weight-light"
          >{{ translate(item.title, item.meta, "title") }}
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item>
      <app-text-editor v-model="translatedContent" />
    </q-item>
    <q-item>
      <q-item-section>
        <div class="q-gutter-md">
          <app-button-rounded
            v-if="item.contactPhone"
            icon="phone"
            @click="navigateToPhone(item.contactPhone)"
          />
          <app-button-rounded
            v-if="item.contactWhatsApp"
            icon="fab fa-whatsapp"
            @click="navigateToWhatsApp(item.contactWhatsApp)"
          />
        </div>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  // Interface files
  import { MarketingType } from "@/interfaces/types/marketing-types";

  const props = defineProps({
    item: {
      type: Object as PropType<MarketingType>,
      required: true
    }
  });

  const { navigateToPhone, navigateToWhatsApp } = useCommunication();
  const { eventBus, translate } = useUtilities();

  const isDialogVisible = ref();

  onMounted(() => {
    eventBus.on("BusinessPromotionDialog", () => {
      isDialogVisible.value = false;
    });
  });
  const translatedContent: any = ref(props.item.description);
</script>
