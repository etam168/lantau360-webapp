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

  // Third party imports
  import { object } from "yup";
  import { Form } from "vee-validate";
  import { useUserStore } from "@/stores/user";

  // Component imports
  import EntityFormContent from "@/components/forms/entity-form-content.vue";

  // Composable imports
  import { EventBus } from "quasar";
  import { useCrudService } from "@/composable/services/use-crud-service";

  // Constants
  import { EntityURLKey } from "@/constants";

  // Store
  import { useFormMappersStore } from "@/stores/form-mappers-store";

  // Emits definition
  const emits = defineEmits([
    "close-dialog",
    "after-entity-created",
    "update-entity-features"
    // "update-avatar-image",
  ]);

  // Props
  const { entityKey, entityOptions, associatedEntityId } = defineProps<{
    entityKey: EntityURLKey;
    entityOptions?: Record<string, any>;
    associatedEntityId?: any;
  }>();

  // Composables and store instantiation
  const bus = inject("bus") as EventBus;
  const { t } = useI18n({ useScope: "global" });
  const { getEntityName, notify } = useUtilities();
  const userStore = useUserStore();

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

  // Services
  const crudService = useCrudService<EntityT>(entityKey);

  // Form submission handler
  async function handleSubmit(values: any) {
    const { validate } = form.value;
    const result = await validate();

    if (result.valid && formMappers.value) {
      try {
        values = {
          ...values,
          [entityKey === "CHECKIN" ? "siteId" : "directoryId"]: associatedEntityId || 0
        };

        // Create the entity record
        const newEntity = formMappers.value!.prepareEntityRecord(undefined, values) as EntityT;
        newEntity.createdBy = userStore.userInfo.userId;
        // Only set memberId if it exists, without direct assignment
        "memberId" in newEntity && (newEntity.memberId = userStore.userInfo.userId);
        
        const entityCreated = await crudService.createEntity(newEntity);

        // Use switch statement for handling other data
        switch (true) {
          case "galleryImages" in values:
          case "avatarImage" in values:
            emits("after-entity-created", { formData: values, entityCreated: entityCreated });
            break;
          default:
            // default actions after created the entity
            bus.emit("refreshData");
            notify(t(`${entityName}.message.createSuccess`), "positive");
            emits("close-dialog", entityCreated);
            break;
        }
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
