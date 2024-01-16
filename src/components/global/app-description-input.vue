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
        <app-editor v-model="item.content" :contentHeight="contentHeight" />
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
</template>

<script setup lang="ts">
  import { Screen } from "@/constants";
  import { Description } from "@/interfaces/models/custom-models/description";

  defineProps({
    contentHeight: {
      type: String,
      default: ""
    }
  });

  const tab = ref("en");
  const description = inject("description") as Ref<Description>;

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
    expansionItems[1].content = description.value.hkDescription;
    expansionItems[2].content = description.value.cnDescription;
  });
</script>
