<template>
  <q-card class="q-mt-md">
    <q-card-section class="q-pa-sm">
      <q-expansion-item
        :label="'Contact Info'"
        group="itemGroup"
        dense
        dense-toggle
        header-class="text-h6"
      >
        <q-separator />
        <q-card>
          <q-card-section
            class="q-pa-none"
            :class="{ 'row no-wrap': $q.screen.gt.xs, column: !$q.screen.gt.xs }"
            v-if="item.contactPhone || item.contactWhatsApp"
          >
            <q-list class="q-pa-none">
              <q-item v-if="businessItem.contactPhone" class="q-pa-none">
                <q-item-section avatar @click="navigateToPhone(businessItem.contactPhone)">
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
          </q-card-section>
          <q-card-section v-else>
            <q-item-label class="text-caption">{{
              $t(`${i18nKey}.contactnotavailable`)
            }}</q-item-label>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-card-section>
  </q-card>
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

  const i18nKey = "home";
  const { navigateToPhone, navigateToWhatsApp } = useCommunication();
  const businessItem = computed(() => props?.item as BusinessView);
</script>
