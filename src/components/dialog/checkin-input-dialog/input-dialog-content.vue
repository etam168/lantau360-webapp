<template>
  <q-card class="bg-transparent row justify-center" flat style="height: calc(100vh - 51px)">
    <Form
      ref="form"
      class="full-height"
      :initial-values="initialValues"
      :validation-schema="schema"
      @submit="handleSubmit"
      style="width: 520px"
    >
      <q-card
        flat
        class="full-height bg-transparent"
        style="display: grid; grid-template-rows: auto 1fr auto"
      >
        <!-- Form Content Section -->
        <q-card-section class="q-pt-md">
          <vee-input :auto-grow="true" name="description" label="Note" type="textarea" />
        </q-card-section>

        <!-- Check-in History Table Section -->
        <q-card-section class="q-pa-none">
          <q-table
            flat
            dense
            hide-pagination
            row-key="checkInAt"
            :rows="sortedCheckIns"
            :rows-per-page-options="[0]"
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
          </q-table>
        </q-card-section>

        <!-- Action Button Section -->
        <q-card-actions align="center">
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
  </q-card>
</template>

<script setup lang="ts" generic="EntityT extends EntityType">
  // Interface files
  import type { CheckInView } from "@/interfaces/models/views/checkin-view";
  import type { EntityType } from "@/interfaces/types/entity-type";
  import type { SiteView } from "@/interfaces/models/views/site-view";

  // Third party imports
  import { object } from "yup";
  import { Form } from "vee-validate";
  import { ref, computed } from "vue";

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

  // Form submission handler
  async function handleSubmit(values: any) {
    if (!formMappers.value || isSubmitting.value) return;
    debugger;
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
</script>
