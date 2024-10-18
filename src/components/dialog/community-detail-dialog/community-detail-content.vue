<template>
  <q-page>
    <create-posting-section :community />
    <tabs-section :community />
  </q-page>
</template>

<script setup lang="ts">
  // Interface files
  import type { DirectoryTypes } from "@/interfaces/types/directory-types";

  import CreatePostingSection from "./section/create-posting-section.vue";
  import TabsSection from "./section/tabs-section.vue";
  // .ts files
  import { EntityURLKey } from "@/constants";

  // Props
  const { community, entityKey } = defineProps<{
    community: DirectoryTypes;
    entityKey: EntityURLKey;
  }>();

  interface RenderItem {
    name: string;
    type: "";
  }

  // const renderItems = computed((): RenderItem[] => {
  //   switch (community) {
  //     case MENU.ACCOUNT:
  //       return [{ name: "account", type: "account" }];

  //     default:
  //       return [];
  //   }
  // });
</script>
