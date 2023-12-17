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
              <q-item class="text-center">
                <q-item-section>
                  <q-item-label>From Mui Wo</q-item-label>
                  <q-item-label caption lines="2">
                    Mondays to Saturdays (Except Public Holidays)</q-item-label
                  >
                </q-item-section>
              </q-item>
              <q-item class="q-pa-none">
                <q-item-section>
                  <q-btn
                    v-for="time in muiWoTocCentralTimeDeparture"
                    :key="time"
                    class="btn-fixed-width button-margin"
                    :label="time"
                  />
                </q-item-section>
                <q-item-section>
                  <q-btn
                    v-for="time in muiWoTocCentralTimeArrived"
                    :key="time"
                    class="btn-fixed-width button-margin"
                    :label="time"
                  />
                </q-item-section>

                <q-item-section>
                  <q-btn
                    v-for="time in muiWoTocCentralTimeReturn"
                    :key="time"
                    class="btn-fixed-width button-margin"
                    :label="time"
                  />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <!-- Text -->
                  <div>
                    Ticket gates will be suspended according to the above schedule (except tickets
                    sold out)
                  </div>
                </q-item-section>
              </q-item>

              <q-item dense v-for="routeTime in routeTimeDetail" :key="routeTime.text">
                <q-item-section avatar>
                  <q-icon color="primary" :name="routeTime.icon" />
                </q-item-section>

                <q-item-section>{{ routeTime.text }}</q-item-section>
              </q-item>
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

  const muiWoTocCentralTimeDeparture = ref([
    "03:40",
    "6:30",
    "7:20",
    "8:30",
    "10:00",
    "12:10",
    "14:10",
    "16:10",
    "18:10",
    "20:30",
    "23:30"
  ]);

  const muiWoTocCentralTimeArrived = ref([
    "03:40",
    "6:30",
    "7:20",
    "8:30",
    "10:00",
    "12:10",
    "14:10",
    "16:10",
    "18:10",
    "20:30",
    "23:30"
  ]);

  const muiWoTocCentralTimeReturn = ref([
    "03:40",
    "6:30",
    "7:20",
    "8:30",
    "10:00",
    "12:10",
    "14:10",
    "16:10",
    "18:10",
    "20:30",
    "23:30"
  ]);

  const routeTimeDetail = ref([
    {
      icon: "",
      text: "Ordinary Ferry, Freight Service and Carriage of Pet are available"
    },
    {
      icon: "alternate_email",
      text: "Via Peng Chau"
    },
    {
      icon: "arrow_forward_ios",
      text: "Berth at Central Pier No.5"
    },
    {
      icon: "add",
      text: "Deploy by Fast Ferry, Fare of Ordinary Class of Ordinary Ferrry is applicable. With freight carriage restrictions"
    }
  ]);

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
