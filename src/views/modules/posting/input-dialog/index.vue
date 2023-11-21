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
    <q-card class="bg-green-1">
      <q-layout view="hHh lpR fFf">
        <app-dialog-bar :barTitle="title" :name="postingName" />
        <q-page-container>
          <div class="q-pa-md">
            <q-stepper
              v-model="currentStep"
              ref="stepper"
              animated
              :header-nav="headerNavigation"
              active-color="green"
              flat
              bordered
              :style="$q.screen.gt.sm ? Screen.laptopMaxWidth : Screen.tabletMaxWidth"
            >
              <q-step :name="1" icon="mdi-information-variant" :title="$t('posting.steps.default')">
                <step1
                  class="q-pr-none"
                  @move-next="goNext"
                  @is-disabled="headerNav"
                  :directory="directory"
                />
              </q-step>
              <q-step :name="2" icon="mdi-format-list-bulleted" :title="$t('posting.steps.editor')">
                <step2 @move-next="goNext" @move-back="goPrevious" @delete-image="handleDelete" />
              </q-step>
              <q-step
                :name="3"
                icon="mdi-format-list-bulleted"
                :title="$t('posting.steps.localization')"
              >
                <step3 @move-next="goNext" @move-back="goPrevious" @is-disabled="headerNav" />
              </q-step>

              <q-step :name="4" icon="mdi-format-list-bulleted" :title="$t('posting.steps.image')">
                <step4
                  :method="method"
                  @move-next="goNext"
                  @move-back="goPrevious"
                  @delete-image="handleDelete"
                />
              </q-step>
            </q-stepper>
          </div>
        </q-page-container>
      </q-layout>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
  import { computed, defineComponent, onMounted, PropType, ref } from "vue";
  import { useDialogPluginComponent } from "quasar";
  import eventBus from "@/utils/event-bus";

  // .ts files
  import { Posting } from "@/interfaces/posting";
  import usePostingInput from "./use-posting-input";
  import { Directory } from "@/interfaces/directory";
  import { Screen } from "@/constants";

  // Custom Components
  import AppDialogBar from "@/components/dialogs/app-dialog-bar.vue";
  import Step1 from "./step1/index.vue";
  import Step2 from "./step2/index.vue";
  import Step3 from "./step3/index.vue";
  import Step4 from "./step4/index.vue";
  import { useI18n } from "vue-i18n";

  export default defineComponent({
    name: "InputDialogIndex",

    props: {
      row: {
        type: Object
      },
      directory: {
        type: Array as PropType<Directory[]>
      },
      title: {
        type: String
      },
      method: {
        type: String
      }
    },

    components: {
      AppDialogBar,
      Step1,
      Step2,
      Step3,
      Step4
    },

    emits: [...useDialogPluginComponent.emits],

    setup(props) {
      const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent();
      const { postingInput, resetPostingInput, updatePosting, deleteImage, createPosting } =
        usePostingInput();
      const { locale } = useI18n();
      const methods = ref(props.method);
      const headerNavigation = ref(true);
      const lang = ref(locale);

      const postingName = computed(() =>
        props.row.meta?.i18n?.[lang.value]
          ? props.row.meta?.i18n?.[lang.value]?.postingName
          : props.row.postingName
      );

      const currentStep = ref(1);
      const stepper = ref(null);

      const isDialogVisible = ref();

      function goNext() {
        if (currentStep.value < 4) {
          stepper.value.next();
        } else {
          if (methods.value == "edit") {
            updatePosting(onDialogCancel);
          } else {
            createPosting(onDialogCancel);
          }
        }
      }
      function headerNav(value: boolean) {
        headerNavigation.value = value;
      }

      function handleDelete(ranking: number) {
        deleteImage(ranking);
      }

      function goPrevious() {
        if (currentStep.value > 1) {
          stepper.value.previous();
        }
      }

      onMounted(() => {
        resetPostingInput(props.row as unknown as Posting);

        eventBus.on("CloseDilaog", () => {
          isDialogVisible.value = false;
        });
      });

      function updateDialogState(status) {
        isDialogVisible.value = status;
        eventBus.emit("DialogStatus", status);
      }

      return {
        postingName,
        postingInput,
        currentStep,
        stepper,
        handleDelete,
        dialogRef,
        goNext,
        goPrevious,
        headerNav,
        onDialogHide,
        Screen,
        isDialogVisible,
        updateDialogState,
        headerNavigation
      };
    }
  });
</script>

<style lang="scss">
  .q-stepper--horizontal .q-stepper__step-inner {
    padding-right: 0 !important;
  }
</style>
