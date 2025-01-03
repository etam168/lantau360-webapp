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
  import type { EntityType } from "@/interfaces/types/entity-type";
  import type { CheckIn } from "@/interfaces/models/entities/checkin";
  import type { SiteView } from "@/interfaces/models/views/site-view";

  // Third party imports
  import { object } from "yup";
  import { Form } from "vee-validate";
  import { useUserStore } from "@/stores/user";

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
  const { getEntityName, notify } = useUtilities();
  const userStore = useUserStore();
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

  // Form submission handler
  async function handleSubmit(values: any) {
    const { validate } = form.value;
    const result = await validate();

    if (result.valid && formMappers.value) {
      try {
        values = {
          ...values,
          siteId: site?.siteId || 0
        };

        // Create the entity record
        const newEntity = formMappers.value!.prepareEntityRecord(undefined, values) as EntityT;
        newEntity.createdBy = userStore.userId;
        // Only set memberId if it exists, without direct assignment
        "memberId" in newEntity && (newEntity.memberId = userStore.userId);
        // move to prepareEntityRecord -- to do
        newEntity.meta = {
          site  
        }
        await checkInStore.addCheckIn(newEntity as CheckIn);
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
