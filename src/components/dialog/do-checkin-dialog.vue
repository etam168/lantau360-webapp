<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    :model-value="isDialogVisible"
    maximized
  >
    <q-layout view="lHh lpr lFf" class="bg-white" style="max-width: 1024px">
      <q-header class="bg-transparent text-dark">
        <app-dialog-title>{{ "CheckIn" }}</app-dialog-title>
      </q-header>

      <q-page-container>
        <q-page>
          <!-- Content here -->
          <check-in-tab :item="item" @on-cancel="handleCancel" />
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { useDialogPluginComponent } from "quasar";
  import { ref } from "vue";
  // import { useGeolocation } from "@vueuse/core";

  // const { coords } = useGeolocation();
  // provide("userPosition", coords);

  import CheckInTab from "@/components/dialog/renderer/site-renderer/detail-tabs/check-in-tab/index.vue";

  defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });

  const { dialogRef, onDialogCancel } = useDialogPluginComponent();
  const isDialogVisible = ref();

  function handleCancel() {
    onDialogCancel();
  }
</script>
