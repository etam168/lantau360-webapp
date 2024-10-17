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
      <app-text-editor v-model="translatedContent" />
    </q-item>
    <q-item>
      <q-item-section>
        <div class="q-gutter-md">
          <app-button-rounded
            v-if="category.contactPhone"
            icon="fa-solid fa-phone"
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
  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";

  // Props
  const { category } = defineProps<{
    category: CategoryTypes;
  }>();

  const { navigateToPhone, navigateToWhatsApp } = useCommunication();
  const { eventBus, translate } = useUtilities();

  const isDialogVisible = ref();

  onMounted(() => {
    eventBus.on("BusinessPromotionDialog", () => {
      isDialogVisible.value = false;
    });
  });
  const translatedContent: any = ref(category.description);
</script>
