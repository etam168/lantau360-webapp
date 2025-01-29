<template>
  <Form
    ref="form"
    class="full-height q-mx-auto"
    :initial-values="initialValues"
    :validation-schema="schema"
    @submit="handleSubmit"
    style="max-width: 560px"
  >
    <q-card flat>
      <!-- Form Content Section -->
      <q-card-section>
        <vee-input :auto-grow="true" name="description" label="Memo" type="textarea" />
      </q-card-section>

      <!-- Check-in History Table Section -->
      <q-card-section class="q-pa-none">
        <q-table
          flat
          dense
          hide-pagination
          hide-header
          row-key="checkInAt"
          :rows="sortedCheckIns"
          :rows-per-page-options="[0]"
          :style="tableStyle"
        >
          <template v-slot:top>
            <q-item dense>Checkin History</q-item>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td auto-width>
                {{ dateTimeFormatter(props.row.checkInAt) }}
              </q-td>
            </q-tr>
          </template>

          <template v-slot:no-data>
            <div class="text-h6 text-center q-pa-md text-grey-6 text-weight-bold full-width">
              {{ $t("errors.noCheckinRecord") }}
            </div>
          </template>
        </q-table>
      </q-card-section>

      <!-- Action Button Section -->
      <q-card-actions align="center" class="q-px-md">
        <app-button
          class="full-width"
          :label="$t('action.save')"
          type="submit"
          :loading="isSubmitting"
          :disable="isSubmitting"
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
  import { object, string } from "yup";
  import { Form } from "vee-validate";

  // Constants
  import { EntityURLKey } from "@/constants";

  // Store
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

  // Reactive references
  const form = ref();
  const initialValues = ref({});
  const isSubmitting = ref(false);
  const entityName = getEntityName(props.entityKey);

  // Computed properties
  const checkinItems = computed<CheckInView[]>(() => checkInStore.checkInSites);

  const sortedCheckIns = computed(() => {
    const currentSiteCheckIns =
      checkinItems.value.find(item => item.siteId === props.site?.siteId)?.checkInfo || [];

    return [...currentSiteCheckIns].sort(
      (a, b) => new Date(b.checkInAt).getTime() - new Date(a.checkInAt).getTime()
    );
  });

  // Validation Schema
  const schema = object({
    description: string().required()
  });

  const tableStyle = computed<Record<string, any> | undefined>(() => {
    const THRESHOLD = 248 as const;
    const usedHeight = 320 as const;
    const height = $q.screen.height - usedHeight;
    return height > THRESHOLD ? { height: `calc(100vh - ${usedHeight}px)` } : undefined;
  });

  // Form submission handler
  async function handleSubmit(values: any) {
    if (isSubmitting.value) return;
    isSubmitting.value = true;
    const { validate } = form.value;

    try {
      const result = await validate();

      if (result.valid) {
        await checkInStore.addOrUpdateCheckIn(props.site as SiteView, values.description);
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
