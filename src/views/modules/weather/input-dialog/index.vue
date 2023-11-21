<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    maximized
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
  >
    <q-card class="bg-white">
      <q-layout view="hHh lpR fFf">
        <app-dialog-bar :barTitle="$t('weather.dialoge.create')" />
        <q-page-container>
          <q-card class="bg-transparent">
            <!--  Input content -->
            <q-splitter
              v-model="splitterModel"
              unit="px"
              :limits="[INPUT_PANE_WIDTH, INPUT_PANE_WIDTH]"
              class="bg-transparent"
              style="height: calc(100vh - 32px)"
              v-if="$q.screen.gt.sm"
            >
              <template v-slot:before>
                <input-steps @on-save="onSave" />
              </template>

              <template v-slot:after>
                <preview-pane />
              </template>
            </q-splitter>

            <q-card-section v-else style="height: calc(100vh - 32px)">
              <input-steps @on-save="onSave" />
            </q-card-section>
            <!-- End of input content -->
          </q-card>
        </q-page-container>
      </q-layout>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
  // Vue Import
  import { onMounted, ref, provide } from "vue";

  // 3rd Party Import
  import { useDialogPluginComponent } from "quasar";

  // .ts files
  import { WeatherInput } from "@/interfaces/input/weather-input";
  import { INPUT_PANE_WIDTH } from "@/constants";
  import eventBus from "@/utils/event-bus";

  // Custom Components
  import AppDialogBar from "@/components/dialogs/app-dialog-bar.vue";
  import InputSteps from "./input-steps.vue";
  import PreviewPane from "../shared/preview-pane/index.vue";

  defineEmits([...useDialogPluginComponent.emits]);

  const splitterModel = ref(INPUT_PANE_WIDTH);

  const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent();
  const isDialogVisible = ref();

  const previewWeather = ref<WeatherInput>({} as WeatherInput);

  provide("previewWeather", previewWeather);

  const onSave = () => {
    setTimeout(() => {
      onDialogCancel();
    }, 1200);
  };

  onMounted(() => {
    eventBus.on("CloseWeatherDilaog", () => {
      isDialogVisible.value = false;
    });
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status);
  }
</script>
