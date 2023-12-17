<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
    maximized
  >
    <q-layout view="lHh lpr lFf" class="bg-white" style="max-width: 1024px">
      <q-header class="bg-transparent text-dark">
        <app-dialog-title>{{ dialogTitle }}</app-dialog-title>
      </q-header>

      <q-page-container>
        <q-page>
          <app-tab-select
            :tab-items="tabItems"
            :current-tab="tab"
            @update:currentTab="setTab"
            class="items-center justify-center"
          />
          <app-tab-panels v-model="tab">
            <q-tab-panel name="muiwo">
              MUI WO
              <!-- <app-directory-section :data="directoryData" /> -->
            </q-tab-panel>

            <q-tab-panel name="central"> CENTRAL </q-tab-panel>
          </app-tab-panels>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import { onMounted, ref } from "vue";

  import { Directory } from "@/interfaces/models/entities/directory";
  import { useDialogPluginComponent } from "quasar";
  import eventBus from "@/utils/event-bus";
  import { TabItem } from "@/interfaces/tab-item";

  const props = defineProps({
    directory: {
      type: Object as PropType<Directory>,
      required: true
    }
  });

  const isDialogVisible = ref();
  const { t } = useI18n({ useScope: "global" });
  const { dialogRef, onDialogHide } = useDialogPluginComponent();
  const { translate } = useUtilities();
  const setTab = (val: string) => (tab.value = val);
  const tab = ref("muiwo");

  const tabItems = ref<TabItem[]>([
    { name: "muiwo", label: t("home.muiWo") },
    { name: "central", label: t("home.central") }
  ]);

  const dialogTitle = computed(() => {
    return translate(props.directory.directoryName, props.directory.meta, "directoryName");
  });

  onMounted(() => {
    eventBus.on("ConfirmDialog", () => {
      isDialogVisible.value = false;
    });
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "ConfirmDialog");
  }
</script>

<style scoped>
  .button-margin {
    margin-right: 40px;
  }
</style>
