<template>
  <q-card
    flat
    :style="$q.screen.gt.sm ? Screen.laptopMaxWidth : Screen.tabletMaxWidth"
    class="q-mt-md q-ml-md"
  >
    <q-toolbar class="bg-primary text-white shadow-2 rounded-borders">
      <q-space />

      <q-tabs v-model="tab" shrink stretch>
        <q-tab
          v-for="item in expansionItems"
          :key="item.name"
          :name="item.name"
          :label="item.label"
        />
      </q-tabs>
    </q-toolbar>

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel v-for="item in expansionItems" :key="item.name" :name="item.name">
        <app-text-editor v-model="item.content" :contentHeight="contentHeight" />
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script setup lang="ts">
  import { ref, watch, reactive, Ref, inject, onMounted } from "vue";
  import "vue-json-pretty/lib/styles.css";
  import { Screen } from "@/constants";

  // Composable
  //import { useSiteInput } from "../use-site-input";
  //import { SiteDatatable } from "@/interfaces/datatable/site-datatable";
  import AppTextEditor from "@/components/widgets/app-text-editor.vue";

  // const props = defineProps({
  //   row: {
  //     type: Object as PropType<SiteDatatable>,
  //     required: true
  //   }
  // });

  //const { siteInput, locale } = useSiteInput();

  const contentHeight = ref("calc(100vh - 450px)");
  //const siteData = inject("siteData") as Ref<SiteDatatable>;
  //const tiptap = ref(null);

  const tab = ref("en");
  const description = inject("description") as Ref<any>;

  // const metaDescription = ref<string>("");

  const expansionItems = reactive<any[]>([
    {
      name: "en",
      content: description.value.enDescription,
      label: "English Version"
    },
    {
      name: "hk",
      content: description.value.hkDescription,
      label: "繁體版本"
    },
    {
      name: "cn",
      content: "",
      label: "简体版本"
    }
  ]);

  watch(
    () => expansionItems,
    () => {
      if (tab.value == "hk") {
        description.value.hkDescription = expansionItems[1].content;
      }
      if (tab.value == "cn") {
        description.value.cnDescription = expansionItems[2].content;
      } else {
        description.value.enDescription = expansionItems[0].content;
      }
    },
    { deep: true }
  );

  onMounted(() => {
    expansionItems[0].content = description.value.enDescription;
    // expansionItems[0].content = props?.row?.description;
    // expansionItems[1].content = props?.row?.meta?.i18n?.hk?.description as string;
    // expansionItems[2].content = props?.row?.meta?.i18n?.cn?.description as string;
  });

  // const metaValue = computed(() => {
  //   return {
  //     description: siteInput.value.meta?.i18n?.[locale.value]?.description ?? {}
  //   } as Record<string, unknown>;
  // });
</script>
