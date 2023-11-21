<template>
  <q-list>
    <q-expansion-item
      class="bg-white q-mt-lg"
      expand-icon="fas fa-arrow-circle-up"
      default-opened
      expand-icon-toggle
      expand-separator
    >
      <template v-slot:header>
        <q-item-section class="q-px-md text-subtitle1 text-weight-medium">
          <q-item-label> {{ $t("site.expansion.description") }} </q-item-label>
        </q-item-section>
      </template>

      <q-item>
        <q-item-section class="q-px-md">
          <q-item-label>
            <!-- <q-card-section class="q-pr-none">
              <q-scroll-area style="height: calc(100vh - 450px)" class="q-ma-none q-pr-md"
                ><app-editor v-model="description"
              /></q-scroll-area>
            </q-card-section> -->
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-expansion-item>
  </q-list>
</template>

<script setup lang="ts">
  // import { computed, PropType } from "vue";
  // import { useI18n } from "vue-i18n";
  //import AppEditor from "@/components/widgets/app-editor-readonly.vue";

  // const props = defineProps({
  //   rowData: {
  //     type: Object as PropType<any>,
  //     required: true
  //   }
  // });
  //const { locale } = useI18n({ useScope: "global" });

  // const description = computed(() => {
  //   if (locale.value != "en") {
  //     const lang = locale.value as string;
  //     return props.rowData.meta?.i18n?.[lang]?.description;
  //   }

  //   return props.rowData.description;
  // });
</script>
