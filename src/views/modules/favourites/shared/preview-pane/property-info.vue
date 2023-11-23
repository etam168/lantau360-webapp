<template>
  <q-card flat>
    <q-list>
      <template v-for="item in items" :key="item">
        <q-item>
          <q-item-section>
            <q-item-label>{{ item.label }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-item-label>{{ item.value }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator inset color="primary" size="2px" />
      </template>
    </q-list>
  </q-card>

  <q-card flat class="q-mt-md">
    <q-item>
      <q-item-section>
        <q-item-label>{{ $t("business.columns.subtitle1") }}</q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-item-label>{{ previewData.subtitle1 }}</q-item-label>
      </q-item-section>
    </q-item>
  </q-card>
</template>
<script setup lang="ts">
  // Vue Import
  import { Ref, computed, inject } from "vue";
  import { useI18n } from "vue-i18n";

  // .ts file
  import { BusinessDatatable } from "@/interfaces/datatable/business-datatable";

  const { t } = useI18n({ useScope: "global" });

  // const { allFeatures } = useAllFeatures();

  const previewData = inject("previewData") as Ref<BusinessDatatable>;

  const items = computed(() => {
    return [
      { label: t("business.columns.title"), value: previewData.value.title },
      { label: t("business.columns.latitude"), value: previewData.value.latitude },
      { label: t("business.columns.longitude"), value: previewData.value.longitude }
    ];
  });
</script>
