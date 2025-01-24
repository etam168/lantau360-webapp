<template>
  <q-card>
    <q-expansion-item
      group="itemGroup"
      dense-toggle
      expand-icon-toggle
      :expand-icon="fasAngleDown"
      :label="$t(`${i18nKey}.contactInfo`)"
      header-class="text-h6"
    >
      <q-separator />
      <q-card>
        <q-card-section
          class="q-pa-none"
          :class="{ 'row no-wrap': $q.screen.gt.xs, column: !$q.screen.gt.xs }"
          v-if="category.contactPhone || category.contactWhatsApp"
        >
          <q-list class="q-pa-none" dense>
            <q-item v-if="businessItem.contactPhone" class="q-pa-none" clickable v-ripple>
              <q-item-section
                avatar
                @click="navigateToPhone(businessItem.contactPhone)"
                class="items-center"
              >
                <q-icon :name="fasPhone" color="primary" size="xs" />
              </q-item-section>

              <q-item-section class="text-caption">
                {{ businessItem.contactPhone == undefined ? "N/A" : businessItem.contactPhone }}
              </q-item-section>
            </q-item>

            <q-item v-if="businessItem.contactWhatsApp" class="q-pa-none">
              <q-item-section
                avatar
                @click="navigateToWhatsApp(businessItem.contactWhatsApp)"
                class="items-center"
              >
                <q-icon :name="fabSquareWhatsapp" color="primary" />
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
          <q-item-label class="text-caption">{{
            $t(`${i18nKey}.contactnotavailable`)
          }}</q-item-label>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-card>
</template>

<script setup lang="ts">
  // Third party imports
  import { fasAngleDown, fasPhone, fabSquareWhatsapp } from "@quasar/extras/fontawesome-v6";

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
