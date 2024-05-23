<template>
  <q-list class="q-pa-none">
    <q-item v-if="businessItem.contactPhone" class="q-pa-none">
      <q-item-section avatar @click="navigateToPhone">
        <q-avatar>
          <q-icon name="phone" color="primary" />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-caption">{{
          businessItem.contactPhone == undefined ? "N/A" : businessItem.contactPhone
        }}</q-item-label>
      </q-item-section>
    </q-item>

    <q-item v-if="businessItem.contactWhatsApp" class="q-pa-none">
      <q-item-section avatar @click="navigateToWhatsApp(businessItem.contactWhatsApp)">
        <q-avatar>
          <q-icon name="fab fa-whatsapp" color="primary" />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-caption">{{
          businessItem.contactWhatsApp == undefined ? "N/A" : businessItem.contactWhatsApp
        }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  import { BusinessView } from "@/interfaces/models/views/business-view";
  import { CategoryTypes } from "@/interfaces/types/category-types";

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });

  const { navigateToWhatsApp } = useUtilities();
  const businessItem = computed(() => props?.item as BusinessView);

  const navigateToPhone = () => {
    if (businessItem.value.contactPhone) {
      const phoneURL = `tel:${businessItem.value.contactPhone}`;
      window.location.href = phoneURL;
    }
  };
</script>
