<template>
  <q-card flat v-if="category?.meta?.showContact">
    <q-separator />
    <q-card-section class="text-body1"> {{ $t(`${i18nKey}.contactInfo`) }}</q-card-section>

    <q-card-section
      class="q-pa-none"
      :class="{ 'row no-wrap': $q.screen.gt.xs, column: !$q.screen.gt.xs }"
      v-if="category.contactPhone || category.contactWhatsApp"
    >
      <q-list class="q-pa-none" dense>
        <q-item v-if="businessItem.contactPhone" class="q-pa-none" dense>
          <q-item-section avatar @click="navigateToPhone(businessItem.contactPhone)">
            <q-avatar>
              <q-icon :name="fasPhone" color="primary" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-caption">{{
              businessItem.contactPhone == undefined ? "N/A" : businessItem.contactPhone
            }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-item v-if="businessItem.contactWhatsApp" class="q-pa-none" dense>
          <q-item-section avatar @click="navigateToWhatsApp(businessItem.contactWhatsApp)">
            <q-avatar>
              <q-icon :name="fabSquareWhatsapp" color="primary" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-caption">{{
              businessItem.contactWhatsApp == undefined ? "N/A" : businessItem.contactWhatsApp
            }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
    <q-card-section v-else>
      <q-item-label class="text-caption">{{ $t(`${i18nKey}.contactnotavailable`) }}</q-item-label>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  // Third party imports
  import { fasPhone, fabSquareWhatsapp } from "@quasar/extras/fontawesome-v6";

  // Interface files
  import type { BusinessView } from "@/interfaces/models/views/business-view";
  import type { CategoryTypes } from "@/interfaces/types/category-types";

  // Props
  const { category } = defineProps<{
    category: CategoryTypes;
  }>();

  const i18nKey = "home.dialog";

  // Composable function calls
  const { navigateToPhone, navigateToWhatsApp } = useCommunication();

  // Reactive variables
  const businessItem = computed(() => category as BusinessView);
</script>
