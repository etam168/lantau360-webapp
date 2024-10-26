<template>
  <Form
    ref="form"
    class="full-height"
    :initial-values="initialValues"
    :validation-schema="schema"
    @submit="onSubmit"
  >
    <q-card flat class="row justify-center">
      <q-card-section
        class="q-ma-none q-pa-xs"
        :style="$q.screen.gt.xs ? 'width: 400px' : 'width : 100%'"
      >
        <div>
          <q-item class="q-mt-lg q-pa-none">
            <q-item-section class="q-pa-none">
              <vee-input type="textarea" :label="$t(`${i18nKey}.review`)" name="description" />
            </q-item-section>
          </q-item>
          <q-card-actions class="q-mt-xs q-pa-none">
            <app-button
              class="full-width"
              label="Submit"
              :loading="loading"
              color="primary"
              type="submit"
              size="md"
            />
          </q-card-actions>
        </div>
      </q-card-section>
    </q-card>
  </Form>
</template>

<script setup lang="ts">
  // Third party imports
  import { Form } from "vee-validate";
  import * as yup from "yup";

  import { useCheckInService } from "@/composable/services/use-checkin-dialog-service";

  //.ts files
  import i18n from "@/plugins/i18n/i18n";

  const { t } = i18n.global;

  const { submitCheckIn } = useCheckInService();
  const { eventBus } = useUtilities();
  const $q = useQuasar();

  const loading = ref(false);
  const i18nKey = "home";
  const form = ref();

  const initialValues = ref({
    description: ""
  });

  const schema = yup.object({
    description: yup
      .string()
      .required()
      .label(t(`${i18nKey}.description`))
  });

  function onSubmit(values: any) {
    form.value.validate().then(async (isValid: any) => {
      if (isValid) {
        loading.value = true;
        const responseStatus = await submitCheckIn(itemId, values.description);
        if (responseStatus) {
          eventBus("refresh-directory-checkin-items").emit();
          eventBus("close-check-in-dialog").emit();
        }
        loading.value = false;
      }
    });
  }
</script>
