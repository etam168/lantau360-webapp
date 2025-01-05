<!--
File: generic-entity-create-form.vue

Description:
A reusable Vue component for creating new entities dynamically.
It uses form mappers to generate appropriate form fields based on the entity type.
Supports validation, custom form structures, and integrates with a CRUD service.
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
    <q-card flat class="full-height" style="display: grid; grid-template-rows: 1fr auto">
      <q-scroll-area>
        <q-card-section class="q-pt-md q-pa-none">
          <q-item v-if="latestCheckinItem"
            ><q-item-label>{{ getLine2(latestCheckinItem) }}</q-item-label></q-item
          >
          <entity-form-content
            v-if="isFormMapperLoaded"
            :entityKey
            :entityOptions
            :form-structure="formMappers!.formStructure"
          />
          <div v-else>{{ $t("error.formMapperLoadFailed") }}</div>
        </q-card-section>
      </q-scroll-area>

      <q-card-actions :class="$q.screen.gt.sm ? 'q-pa-lg' : 'q-pa-md'">
        <app-button
          class="full-width"
          :label="$t('action.save')"
          type="submit"
          :disable="!isFormMapperLoaded"
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

  // Third party imports
  import { object } from "yup";
  import { Form } from "vee-validate";

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
  const { entityKey, entityOptions, site } = defineProps<{
    entityKey: EntityURLKey;
    entityOptions?: Record<string, any>;
    site?: SiteView;
  }>();

  // Composables and store instantiation
  const { t } = useI18n({ useScope: "global" });
  const { dateFormatter, getEntityName, notify } = useUtilities();
  const checkInStore = useCheckInStore();

  // Reactive references
  const formMappersStore = useFormMappersStore();
  const formMappers = computed(() => formMappersStore.getFormMappers(entityKey));

  const isFormMapperLoaded = computed(
    () => formMappersStore.isLoaded(entityKey) && !!formMappers.value
  );

  const form = ref();
  const initialValues = ref({});
  const isLoading = ref(true);

  const entityName = getEntityName(entityKey);

  // Validation Schema
  const schema = object({});
  const checkinItems = computed<CheckInView[]>(() => checkInStore.checkInSites);

  // Compute the latest check-in item
  const latestCheckinItem = computed(() => {
    if (checkinItems.value.length > 0) {
      const latest = checkinItems.value.reduce((latest, current) =>
        new Date(current.checkInfo[0]?.checkInAt) > new Date(latest.checkInfo[0]?.checkInAt)
          ? current
          : latest
      );
      console.log("latestCheckinItem:", latest); // Log the latest check-in item
      return latest;
    }
    return null; // Return null if no items are found
  });

  // Refactor getLine2 to display the exact checkInAt
  const getLine2 = (item: CheckInView | null) => {
    if (!item || !item.checkInfo || item.checkInfo.length === 0) {
      return "No check-in data available.";
    }

    const lastCheckIn = item.checkInfo[0]; // We are using the most recent check-in

    if (!lastCheckIn || !lastCheckIn.checkInAt) {
      return "No check-in data available.";
    }

    return lastCheckIn.checkInAt
      ? t(`favourite.checkIn.lastCheckIn`, {
          date: dateFormatter(lastCheckIn.checkInAt)
        })
      : "";
  };

  // Form submission handler
  async function handleSubmit(values: any) {
    const { validate } = form.value;
    const result = await validate();

    if (result.valid && formMappers.value) {
      try {
        await checkInStore.addOrUpdateCheckIn(site as SiteView, values.description);
        emits("close-dialog");
      } catch (error) {
        console.error("Error creating entity record:", error);
        notify(t(`${entityName}.message.createError`), "negative");
      }
    }
  }

  // Lifecycle hook
  onBeforeMount(() => {
    try {
      formMappersStore.loadFormMapper(entityKey);

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
  });
</script>
