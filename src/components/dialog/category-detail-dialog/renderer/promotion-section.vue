<template>
  <q-list padding class="q-mx-sm q-pa-none">
    <q-item v-if="category.subtitle1">
      <q-item-section top>
        <q-item-label v-if="category.subtitle1" class="text-caption text-weight-light"
          >{{ translate(category.title, category.meta, "title") }}
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-label> <div v-html="translatedContent"></div></q-item-label>
    </q-item>
    <q-item>
      <q-item-section>
        <div class="q-gutter-md">
          <app-button-rounded
            v-if="category.contactPhone"
            :icon="fasPhone"
            @click="navigateToPhone(category.contactPhone)"
          />
          <app-button-rounded
            v-if="category.contactWhatsApp"
            icon="fa-brands fa-whatsapp"
            @click="navigateToWhatsApp(category.contactWhatsApp)"
          />
        </div>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  // Third party imports
  import { fasPhone } from "@quasar/extras/fontawesome-v6";

  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";

  // Props
  const { category } = defineProps<{
    category: CategoryTypes;
  }>();

  // Composable function calls
  const { locale } = useI18n({ useScope: "global" });

  const { eventBus, translate } = useUtilities(locale.value);
  const { navigateToPhone, navigateToWhatsApp } = useCommunication();

  // Reactive variables
  const isDialogVisible = ref();
  const translatedContent: any = ref(category.description);

  // Lifecycle hooks
  onMounted(() => {
    eventBus("BusinessPromotionDialog").on(() => {
      isDialogVisible.value = false;
    });
  });
</script>
