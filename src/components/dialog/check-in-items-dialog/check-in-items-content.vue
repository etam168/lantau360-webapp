<template>
  <q-page>
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
  </q-page>
</template>

<script setup lang="ts">
  import { SiteView } from "@/interfaces/models/views/site-view";
  import { CategoryTypes } from "@/interfaces/types/category-types";

  // Third party imports
  import { Form } from "vee-validate";
  import * as yup from "yup";
  import i18n from "@/plugins/i18n/i18n";

  import InputTemplate from "./sections/input-template.vue";
import { EntityURLKey } from "@/constants";
import { BusinessView } from "@/interfaces/models/views/business-view";

  // Props
  // Props
  const { category, entityKey } = defineProps<{
    category: CategoryTypes;
    entityKey: EntityURLKey;
  }>();

  const { t } = i18n.global;
  const { submitCheckIn } = useCheckInService();
  const { eventBus } = useUtilities();
  const $q = useQuasar();

  const emits = defineEmits(["on-cancel"]);
  const initialValues = ref({
    description: ""
  });

  const loading = ref(false);
  const i18nKey = "home";
  const form = ref();

  const schema = yup.object({
    description: yup
      .string()
      .required()
      .label(t(`${i18nKey}.description`))
  });

  // Computed property to get itemId based on item type
  const itemId = computed(() => {
    if (entityKey === "SITE") {
      return (category as SiteView).siteId;
    } else if (entityKey == "BUSINESS") {
      return (category as BusinessView).businessId; 
    }
    else{
      return 0;
    }
  });

  function onSubmit(values: any) {
    form.value.validate().then(async (isValid: any) => {
      if (isValid) {
        loading.value = true;
        const responseStatus = await submitCheckIn(itemId.value, values.description);
        if (responseStatus) {
          eventBus.emit("refresh-directory-checkin-items");
          eventBus.emit("close-check-in-dialog");
        }
        loading.value = false;
      }
    });
  }
  onMounted(() => {
    // eventBus.on("on-login-success", () => {
    //   isAuthenticated.value = userStore.isUserLogon();
    // });
  });
  function handleCancel() {
    emits("on-cancel");
  }
</script>
