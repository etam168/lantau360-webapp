<template>
  <q-card flat bordered style="min-height: 584px">
    <q-card-section>
      <app-img :ratio="16 / 9" :image-link="rowData.bannerPath" style="border-radius: 8px" />
    </q-card-section>

    <q-card-section class="q-pt-none">
      <app-item icon="location_on" :label="rowData.subtitle1" />
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pr-none">
      <q-scroll-area style="height: calc(100vh - 450px)" class="q-ma-none q-pr-md">
        <app-editor v-model="description" />
      </q-scroll-area>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
  import { computed, defineComponent } from "vue";
  import { useI18n } from "vue-i18n";

  import AppEditor from "@/components/widgets/app-editor-readonly.vue";
  import AppItem from "@/components/widgets/app-item.vue";
  import AppImg from "@/components/widgets/app-img.vue";

  export default defineComponent({
    name: "SiteCard",
    inheritAttrs: false,

    components: {
      AppEditor,
      AppItem,
      AppImg
    },

    props: {
      rowData: {
        type: Object
      }
    },

    setup(props) {
      const { locale } = useI18n({ useScope: "global" });

      const description = computed(() => {
        if (locale.value != "en") {
          const lang = locale.value as string;
          return props.rowData.meta?.i18n?.[lang]?.description;
        }

        return props.rowData.description;
      });

      return {
        description
      };
    }
  });
</script>
