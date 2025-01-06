<!--
File: generic-entity-create-form.vue

Description:
A reusable Vue component for creating new entities dynamically.
Features form content, check-in history table, and submission handling.
Supports validation, custom form structures, and integrates with CRUD service.
-->

<template>
  <Form
    ref="form"
    class="full-height"
    :initial-values="initialValues"
    :validation-schema="schema"
    @submit="handleSubmit"
    style="width: 520px"
  >
    <q-card flat class="full-height" style="display: grid; grid-template-rows: auto 1fr auto">
      <!-- Form Content Section -->
      <q-card-section class="q-pt-md">
        <entity-form-content
          v-if="isFormMapperLoaded"
          :entityKey="entityKey"
          :entityOptions="entityOptions"
          :form-structure="formMappers!.formStructure"
        />
        <div v-else>{{ $t("error.formMapperLoadFailed") }}</div>
      </q-card-section>

      <!-- Check-in History Table Section -->
      <q-card-section class="q-pa-none">
        <div class="text-h6 q-px-md q-pt-md">{{ "Checkin History" }}</div>
        <q-scroll-area style="height: 200px">
          <q-table
            flat
            dense
            :rows="sortedCheckIns"
            row-key="checkInAt"
            hide-pagination
            :rows-per-page-options="[0]"
            class="check-in-table"
            :style="tableStyle"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td auto-width>
                  {{ dateTimeFormatter(props.row.checkInAt) }}
                </q-td>
                <q-td>
                  {{ props.row.description || "-" }}
                </q-td>
              </q-tr>
            </template>

            <template v-slot:no-data>
              <div class="full-width row flex-center q-pa-md text-grey-6">
                {{ $t("errors.noCheckinRecord") }}
              </div>
            </template>
          </q-table>
        </q-scroll-area>
      </q-card-section>

      <!-- Action Button Section -->
      <q-card-actions :class="$q.screen.gt.sm ? 'q-pa-lg' : 'q-pa-md'">
        <app-button
          class="full-width"
          :label="$t('action.save')"
          type="submit"
          :loading="isSubmitting"
          :disable="!isFormMapperLoaded || isSubmitting"
        />
      </q-card-actions>
    </q-card>
  </Form>
</template>

<script setup lang="ts" generic="EntityT extends EntityType">
  // Interface files
  import type { CheckInView } from "@/interfaces/models/views/checkin-view";
  import type { EntityType } from "@/interfaces/types/entity-type";
  import type { SiteView } from "@/interfaces/models/views/site-view";
  import type { QTableColumn } from "quasar";

  // Third party imports
  import { object } from "yup";
  import { Form } from "vee-validate";
  import { ref, computed, onBeforeMount } from "vue";

  // Component imports
  import EntityFormContent from "@/components/forms/entity-form-content.vue";

  // Constants
  import { EntityURLKey } from "@/constants";

  // Store
  import { useFormMappersStore } from "@/stores/form-mappers-store";
  import { useCheckInStore } from "@/stores/checkin-store";

  // Emits definition
  const emits = defineEmits(["close-dialog"]);

  // Props
  const props = defineProps<{
    entityKey: EntityURLKey;
    entityOptions?: Record<string, any>;
    site?: SiteView;
  }>();

  // Composables and store instantiation
  const { t } = useI18n({ useScope: "global" });
  const { dateTimeFormatter, getEntityName, notify, aspectRatio } = useUtilities();
  const $q = useQuasar();
  const checkInStore = useCheckInStore();
  const formMappersStore = useFormMappersStore();

  // Reactive references
  const form = ref();
  const initialValues = ref({});
  const isLoading = ref(true);
  const isSubmitting = ref(false);

  // Computed properties
  const formMappers = computed(() => formMappersStore.getFormMappers(props.entityKey));
  const entityName = getEntityName(props.entityKey);

  const isFormMapperLoaded = computed(
    () => formMappersStore.isLoaded(props.entityKey) && !!formMappers.value
  );

  const checkinItems = computed<CheckInView[]>(() => checkInStore.checkInSites);


  const sortedCheckIns = computed(() => {
    const currentSiteCheckIns =
      checkinItems.value.find(item => item.siteId === props.site?.siteId)?.checkInfo || [];

    return [...currentSiteCheckIns].sort(
      (a, b) => new Date(b.checkInAt).getTime() - new Date(a.checkInAt).getTime()
    );
  });

  // Validation Schema
  const schema = object({});

  // Add these constants
const THRESHOLD = 320 as const;
const MAX_SCREEN_WIDTH = 1200; // Add your actual MAX_SCREEN_WIDTH value
const FORM_ADDITIONAL_HEIGHT = 260; // Height for form content and button sections

const usedHeight = computed(() => {
  const ADDITIONAL_HEIGHT = 160 as const;
  const width = Math.min($q.screen.width, MAX_SCREEN_WIDTH);
  const carouselHeight = width * aspectRatio();

  return carouselHeight + ADDITIONAL_HEIGHT + FORM_ADDITIONAL_HEIGHT;
});

const tableStyle = computed<Record<string, any> | undefined>(() => {
  const height = $q.screen.height - usedHeight.value;
  return height > THRESHOLD ? { height: `calc(100vh - ${usedHeight.value}px)` } : undefined;
});


  // Form submission handler
  async function handleSubmit(values: any) {
    if (!formMappers.value || isSubmitting.value) return;

    isSubmitting.value = true;
    const { validate } = form.value;

    try {
      const result = await validate();

      if (result.valid) {
        await checkInStore.addOrUpdateCheckIn(props.site as SiteView, values.description);
        notify(t(`${entityName}.message.createSuccess`), "positive");
        emits("close-dialog");
      }
    } catch (error) {
      console.error("Error creating entity record:", error);
      notify(t(`${entityName}.message.createError`), "negative");
    } finally {
      isSubmitting.value = false;
    }
  }

  // Load form mapper data
  async function loadFormMapperData() {
    try {
      await formMappersStore.loadFormMapper(props.entityKey);

      if (!isFormMapperLoaded.value) {
        throw new Error("Form mappers not loaded after attempting to load");
      }

      if (typeof formMappers.value!.getInitialValues !== "function") {
        throw new Error("getInitialValues is not a function");
      }

      initialValues.value = {
        ...formMappers.value!.getInitialValues(undefined, undefined)
      };
    } catch (error) {
      console.error("Error loading form mapper:", error);
      notify(t("error.formMapperLoadFailed"), "negative");
    } finally {
      isLoading.value = false;
    }
  }

  // Lifecycle hooks
  onBeforeMount(async () => {
    await loadFormMapperData();
  });
</script>
