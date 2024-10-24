<!--
File: generic-entity-edit-form.vue

Description:
A reusable Vue component for editing entities dynamically.
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
    v-slot="{ meta }"
  >
    <q-card class="full-height" style="display: grid; grid-template-rows: 1fr auto">
      <q-scroll-area>
        <q-card-section class="q-pa-none">
          <entity-form-content
            v-if="isFormMapperLoaded"
            :entityKey
            :entityOptions
            :mode="1"
            :form-structure="formMappers!.formStructure"
          />
          <div v-else>{{ $t("error.formMapperLoadFailed") }}</div>
        </q-card-section>
      </q-scroll-area>

      <q-card-actions align="center">
        <app-button
          class="full-width q-ma-md"
          type="submit"
          :disable="!(meta.valid && meta.dirty) || (isLoading && !isFormMapperLoaded)"
          :label="$t('action.save')"
        />
      </q-card-actions>
    </q-card>
  </Form>
</template>

<script setup lang="ts" generic="EntityT extends EntityType">
  // Types
  import type { CategoryTypes } from "@/interfaces/types/category-types";
  import type { EntityType } from "@/interfaces/types/entity-type";

  // Other import
  import { Form } from "vee-validate";
  import { useChangeCase } from "@vueuse/integrations/useChangeCase";

  // Component
  import EntityFormContent from "@/components/forms/entity-form-content.vue";

  // Composable Imports
  import { useCrudService } from "@/composable/services/use-crud-service";

  // Constants
  import { EntityURLKey } from "@/constants";

  // Store
  import { useFormMappersStore } from "@/stores/form-mappers-store";

  // Emits
  const emits = defineEmits(["close-dialog", "after-entity-updated"]);

  // Model
  const row = defineModel<CategoryTypes>("row", { required: true });

  // Props
  const { entityKey, entityOptions } = defineProps<{
    entityKey: EntityURLKey;
    entityOptions?: Record<string, any>;
  }>();

  // Composables and Store Instantiation
  const { t } = useI18n({ useScope: "global" });
  const { eventBus, notify } = useUtilities();

  // Reactive References
  const formMappersStore = useFormMappersStore();
  const formMappers = computed(() => formMappersStore.getFormMappers(entityKey));
  const isFormMapperLoaded = computed(
    () => formMappersStore.isLoaded(entityKey) && !!formMappers.value
  );

  // Form
  const form = ref();
  const initialValues = ref({});
  const schema = ref({});
  const isLoading = ref(true);

  // Constants
  const entityName = useChangeCase(entityKey, "camelCase").value;
  const entityIdKey = `${entityName}Id`;

  // Get the actual entity ID value
  const entityId = row.value[entityIdKey as keyof typeof row.value] as number;

  const crudService = useCrudService<EntityT>(entityKey);

  async function handleSubmit(values: any) {
    const { validate } = form.value;
    const result = await validate();

    if (result.valid) {
      try {
        const entity = formMappers.value!.prepareEntityRecord(row.value, values) as EntityT;
        await crudService.updateEntity(entityId, entity);
        // Use switch statement for handling galleryImages and avatarImage
        switch (true) {
          case "galleryImages" in values:
          case "avatarImage" in values:
            emits("after-entity-updated", values);
            break;
          default:
            // default actions after updated the entity
            eventBus("LoadData").emit();
            notify(t(`${entityName}.message.updateSuccess`), "positive");
            emits("close-dialog");
            break;
        }
      } catch (error) {
        console.error("Error updating entity record:", error);
        notify(t(`${entityName}.message.updateError`), "negative");
      }
    }
  }

  // Lifecycle Hooks
  onBeforeMount(() => {
    try {
      formMappersStore.loadFormMapper(entityKey);

      if (!isFormMapperLoaded.value) {
        throw new Error("Form mappers not loaded after attempting to load");
      }

      if (typeof formMappers.value!.getInitialValues !== "function") {
        throw new Error("getInitialValues is not a function");
      }

      initialValues.value = formMappers.value!.getInitialValues(row.value);
      schema.value = formMappers.value!.getSchema();
    } catch (error) {
      console.error("Error loading form mapper:", error);
      notify(t("error.formMapperLoadFailed"), "negative");
    } finally {
      isLoading.value = false;
    }
  });
</script>
