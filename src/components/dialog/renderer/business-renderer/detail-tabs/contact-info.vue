<template>
  <q-card flat class="q-ma-md">
    <q-card-section
      class="q-pa-none"
      :class="{ 'row no-wrap': $q.screen.gt.xs, column: !$q.screen.gt.xs }"
    >
      <q-list class="q-pa-none">
        <q-item v-if="siteItem.contactPhone" class="q-pa-none">
          <q-item-section avatar @click="navigateToPhone">
            <q-avatar>
              <q-icon name="phone" color="primary" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-caption">{{
              siteItem.contactPhone == undefined ? "N/A" : siteItem.contactPhone
            }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="siteItem.contactWhatsApp" class="q-pa-none">
          <q-item-section avatar @click="navigateToWhatsApp(siteItem.contactWhatsApp)">
            <q-avatar>
              <q-icon name="fab fa-whatsapp" color="primary" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-caption">{{
              siteItem.contactWhatsApp == undefined ? "N/A" : siteItem.contactWhatsApp
            }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>
<script setup lang="ts">
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { SiteView } from "@/interfaces/models/views/site-view";

  const { navigateToWhatsApp } = useUtilities();

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });

  const siteItem = computed(() => props?.item as SiteView);
  const $q = useQuasar();

  const navigateToPhone = () => {
    if (siteItem.value.contactPhone) {
      const phoneURL = `tel:${siteItem.value.contactPhone}`;
      window.location.href = phoneURL;
    }
  };
</script>
