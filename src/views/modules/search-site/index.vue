<template>
  <suspense>
    <template #default>
      <q-dialog
        ref="dialogRef"
        @hide="onDialogHide"
        transition-show="slide-up"
        transition-hide="slide-down"
        @update:model-value="updateDialogState"
        :model-value="isDialogVisible"
        maximized
      >
        <main-datatable :query="query" />
      </q-dialog>
    </template>
    <template #fallback>
      <div class="row justify-center items-center" style="height: 500px">
        <app-spinner size="10em" />
      </div>
    </template>
  </suspense>
</template>

<script setup lang="ts">
  import { PropType, onMounted, ref } from "vue";

  // Custom Components
  import { useDialogPluginComponent } from "quasar";
  import MainDatatable from "./main-datatable.vue";
  import eventBus from "@/utils/event-bus";

  defineProps({
    query: {
      type: Object as PropType<any>,
      required: true
    }
  });

  const { dialogRef, onDialogHide } = useDialogPluginComponent();
  const isDialogVisible = ref();

  onMounted(() => {
    eventBus.on("SiteSearchDialog", () => {
      isDialogVisible.value = false;
    });
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "SiteSearchDialog");
  }
</script>
