<template>
  <q-card>
    <q-expansion-item group="itemGroup" dense-toggle expand-icon-toggle :expand-icon="fasAngleDown">
      <template v-slot:header>
        <q-item-section class="text-h6">
          <!-- Conditional rendering for Washroom -->
          <template v-if="isWashroom">
            {{ $t(`${i18nKey}.info`) }}
          </template>
          <template v-else>
            {{ $t(`${i18nKey}.description`) }}
          </template>
        </q-item-section>
      </template>
      <q-separator />

      <q-card
        :style="{
          height: $q.screen.gt.xs ? '350px' : '100%'
        }"
      >
        <q-card-section class="q-pa-md">
          <div v-html="translatedContent"></div>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-card>
</template>

<script setup lang="ts">
  // Third party imports
  import { fasAngleDown } from "@quasar/extras/fontawesome-v6";

  // Interface files
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import { EntityURLKey } from "@/constants";

  // Props
  const { category, entityKey } = defineProps<{
    category: CategoryTypes;
    entityKey: EntityURLKey;
  }>();

  // Composable function calls
  const { locale } = useI18n({ useScope: "global" });

  const { translate } = useUtilities(locale.value);

  // Reactive variables
  const i18nKey = "home.dialog";
  const translatedContent = ref(translate(category.description, category.meta, "description"));

  // Check if directoryName is Washroom (case-insensitive)
  const isWashroom = computed(() => ["Washroom", "washroom"].includes(category.directoryName));
</script>
