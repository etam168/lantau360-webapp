<template>
  <q-list padding class="q-pa-none q-pb-md">
    <!-- Contact section -->
    <contact-section class="q-mx-sm" :item="item" />
  </q-list>
</template>

<script setup lang="ts">
  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";

  //UI Component
  import ContactSection from "@/components/dialog/renderer/common/contact-section.vue";

  defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });
</script>
