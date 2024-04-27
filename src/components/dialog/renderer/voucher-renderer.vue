<template>
  <q-list padding class="q-mx-sm q-pa-none">
    <q-item v-if="item.subtitle1">
      <q-item-section>
        <app-button-rounded icon="location_on" />
      </q-item-section>
    </q-item>
    <q-separator class="q-mt-sm" />

    <q-item>
      <q-item-section>
        <q-item-label class="q-mt-sm"
          >{{ translate(voucherItem.subtitle1, voucherItem.meta, "subtitle1") }}
        </q-item-label>
        <q-item-label class="q-mt-sm" caption>{{ $t("business.subtitle1") }} </q-item-label>
      </q-item-section>
    </q-item>
    <q-separator class="q-mt-sm" />

    <q-item v-if="translatedContent != null && translatedContent != ''">
      <app-text-editor v-model="translatedContent" />
    </q-item>
    <q-separator class="q-mt-sm" />
    <q-item>
      <q-item-section>
        <div class="q-gutter-md">
          <app-button-rounded v-if="item.contactPhone" icon="phone" @click="navigateToPhone" />

          <app-button-rounded v-if="item.contactWhatsApp" icon="phone" />
        </div>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  // Interface files
  import { BusinessVoucherView } from "@/interfaces/models/views/business-voucher-view";
  import { MarketingType } from "@/interfaces/types/marketing-types";

  const { translate, eventBus } = useUtilities();

  const props = defineProps({
    item: {
      type: Object as PropType<MarketingType>,
      required: true
    }
  });

  const voucherItem = computed(() => props.item as BusinessVoucherView);

  const isDialogVisible = ref();

  onMounted(() => {
    eventBus.on("BusinessVoucherDialog", () => {
      isDialogVisible.value = false;
    });
  });

  const translatedContent: any = ref(voucherItem.value.description);
  const navigateToPhone = () => {
    if (voucherItem.value.contactPhone) {
      const phoneURL = `tel:${voucherItem.value.contactPhone}`;
      window.location.href = phoneURL;
    }
  };
</script>
<style scoped>
  .button-margin {
    margin-right: 40px;
  }
</style>
