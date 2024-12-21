<template>
  <q-card class="q-ma-md">
    <q-card-section class="q-pa-sm">
      <q-expansion-item group="itemGroup" dense dense-toggle :expand-icon="fasAngleDown">
        <template v-slot:header>
          <q-item-section class="text-h6">
            {{ $t(`${i18nKey}.tripDetail`) }}
          </q-item-section>
        </template>
        <q-separator />

        <q-card>
          <q-card-section class="q-pa-sm">
            <div v-html="translatedContent"></div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  // Third party imports
  import { fasAngleDown } from "@quasar/extras/fontawesome-v6";

  // Interface files
  import type { Directory } from "@/interfaces/models/entities/directory";
  import { DirectoryTypes } from "@/interfaces/types/directory-types";

  // Props
  const { directory } = defineProps<{
    directory: DirectoryTypes;
  }>();

  // Composable function calls
  const { locale } = useI18n({ useScope: "global" });

  const { translate } = useUtilities(locale.value);

  // Reactive variables
  const i18nKey = "home.dialog";
  const translatedContent = ref(translate(directory.description, directory.meta, "description"));
</script>
