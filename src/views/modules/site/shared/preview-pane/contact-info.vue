<template>
  <suspense>
    <template #default>
      <q-card flat class="q-mt-md">
        <q-list>
          <q-item>
            <q-item-section avatar top>
              <q-avatar color="primary" text-color="white" icon="fa-solid fa-user-tie" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Contact Info:</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>{{ $t("site.columns.contactOther") }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-item-label>{{ previewData.contactOther }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator inset color="primary" size="2px" />

          <q-item>
            <q-item-section>
              <q-item-label>{{ $t("site.columns.contactPhone") }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-item-label @click="navigateToWhatsApp">{{
                previewData.contactPhone
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator inset color="primary" size="2px" />

          <q-item>
            <q-item-section>
              <q-item-label>{{ $t("site.columns.contactWhatsApp") }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-item-label @click="navigateToWhatsApp">{{
                previewData.contactWhatsApp
              }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </template>

    <template #fallback>
      <div class="row justify-center items-center" style="height: 500px">
        <app-spinner size="1em" />
      </div>
    </template>
  </suspense>
</template>

<script setup lang="ts">
  // Vue Import
  import { inject, Ref } from "vue";

  // .ts file
  import { SiteInput } from "@/interfaces/input/site-input";

  // Custom Components
  import AppSpinner from "@/components/widgets/app-spinner.vue";

  const previewData = inject("previewData") as Ref<SiteInput>;

  function navigateToWhatsApp() {
    const whatsappURL = `https://wa.me/${previewData.value?.contactPhone}?text=Hello,%20Welcome%20to%20Lantau360.`;
    window.open(whatsappURL, "_blank");
  }
</script>
