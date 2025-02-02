<template>
  <q-list padding class="q-pa-none">
    <q-item v-if="category.subtitle1" class="no-padding">
      <q-item-section top>
        <q-item-label v-if="category.subtitle1" class="text-caption text-weight-light"
          >{{ translate(category.title, category.meta, "title") }}
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item class="no-padding">
      <q-item-label> <div v-html="translatedContent"></div></q-item-label>
    </q-item>
    <q-item class="no-padding">
      <q-item-section>
        <div class="q-gutter-md">
          <app-button-rounded
            v-if="category.contactPhone"
            :icon="fasPhone"
            @click="navigateToPhone(category.contactPhone)"
          />
          <app-button-rounded
            v-if="category.contactWhatsApp"
            :icon="fabWhatsapp"
            @click="navigateToWhatsApp(category.contactWhatsApp)"
          />
        </div>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  // Third party imports
  import { fasPhone, fabWhatsapp } from "@quasar/extras/fontawesome-v6";

  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";

  // Props
  const { category } = defineProps<{
    category: CategoryTypes;
  }>();

  // Composable function calls
  const { locale } = useI18n({ useScope: "global" });

  const { translate } = useUtilities(locale.value);
  const { navigateToPhone, navigateToWhatsApp } = useCommunication();

  // Reactive variables
  const translatedContent: any = ref(category.description);
</script>
