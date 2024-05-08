<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
    maximized
  >
    <q-layout view="lHh lpr lFf" class="bg-white" style="max-width: 1024px">
      <q-header class="bg-transparent text-dark">
        <app-dialog-title>{{ $t("more.creditCard.title") }}</app-dialog-title>
      </q-header>

      <q-page-container>
        <q-page>
          <q-card flat class="row justify-center items-center">
            <!-- <q-card-section class="row items-center q-pa-none q-mt-sm"> </q-card-section> -->

            <q-card-section :style="$q.screen.gt.xs ? 'width: 300px' : 'width : 100%'">
              <q-img :src="visaCardImage" />
              <q-item-label class="q-my-md">{{ $t("more.creditCard.subtitle") }}</q-item-label>
              <Form
                ref="form"
                class="full-height"
                :initial-values="initialValues"
                :validation-schema="schema"
                @submit="onSubmit"
              >
                <vee-input
                  :label="$t('more.creditCard.cardNumber')"
                  icon="mdi-account"
                  name="number"
                  placeholder="XXXX XXXX XXXX 8014"
                />

                <q-card-actions class="q-pa-none justify-between">
                  <vee-input
                    :label="$t('more.creditCard.expiryDate')"
                    icon="mdi-account"
                    name="expiryDate"
                    placeholder="08/21"
                    style="width: 48%"
                  />

                  <vee-input
                    :label="$t('more.creditCard.cvv')"
                    icon="mdi-account"
                    name="csv"
                    placeholder="XXX"
                    style="width: 48%"
                  />
                </q-card-actions>

                <q-card-section class="text-h4">{{
                  $t("more.creditCard.total", {
                    amount: `$5`
                  })
                }}</q-card-section>

                <q-card-actions class="q-mt-md justify-end q-pa-none">
                  <app-button
                    label="Proceed to pay"
                    :loading="loading"
                    class="full-width"
                    color="primary"
                    type="submit"
                    size="md"
                  />
                </q-card-actions>
              </Form>
            </q-card-section>
          </q-card>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import { Form } from "vee-validate";
  import { useDialogPluginComponent } from "quasar";
  import { useUtilities } from "@/composable/use-utilities";
  import * as yup from "yup";
  import i18n from "@/plugins/i18n/i18n";
  import { useUserStore } from "@/stores/user";

  const { eventBus, notify } = useUtilities();
  const { dialogRef } = useDialogPluginComponent();
  const { userId } = useUserStore();
  const { t } = i18n.global;
  const isDialogVisible = ref();
  //const $q = useQuasar();
  const form = ref();
  const loading = ref(false);

  defineProps({
    callback: {
      type: Function,
      required: true
    }
  });

  const initialValues = ref({});
  const visaCardImage = ref("/img/icons/visa_card.png");

  const schema = yup.object({
    number: yup.string().required().label(t("more.creditCard.cardNumber")),
    expiryDate: yup.string().required().label(t("more.creditCard.expiryDate")),
    csv: yup.string().required().label(t("more.creditCard.cvv"))
  });

  onMounted(() => {
    eventBus.on("CreditCardDialog", () => {
      isDialogVisible.value = false;
      isDialogVisible.value = false;
    });
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "CreditCardDialog");
  }

  function onSubmit(values: any) {
    form.value.validate().then(async (isValid: any) => {
      if (isValid) {
        loading.value = true;

        values["totalCost"] = 500;
        values["subscriberId"] = parseInt(userId);
        values["purchasedPoints"] = 50;
        await axios
          .post("/Points/PurchasePoints", values)
          .then(() => {
            eventBus.emit("refresh-transaction-data");
            notify("Purchase point successfully", "positive");
            loading.value = false;
            isDialogVisible.value = false;
          })
          .catch(err => {
            notify(err.message, "negative");
            loading.value = false;
          });
      }
    });
  }
</script>
