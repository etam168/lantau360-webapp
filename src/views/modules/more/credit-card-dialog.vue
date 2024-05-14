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
            <q-card-section
              class="row justify-center"
              :style="$q.screen.gt.xs ? 'width: 480px' : 'width : 100%'"
            >
              <q-card
                class="row justify-center items-center q-my-lg"
                :class="{ 'q-mx-lg': $q.screen.gt.xs }"
                bordered
                :style="{
                  width: $q.screen.gt.xs ? '480px' : '100%',
                  'border-radius': '15px',
                  height: '100px',
                  'border-color': 'primary'
                }"
              >
                <div style="display: flex; flex-direction: column">
                  <div style="letter-spacing: 2px; font-size: 17px">Purchase 50 points</div>
                  <div style="text-align: center">
                    <span style="font-size: 28px; font-weight: 500; letter-spacing: 2px">{{
                      "$" + purchasePrice
                    }}</span>
                  </div>
                </div>
              </q-card>
              <div
                :class="{ 'q-ml-lg': $q.screen.gt.xs }"
                :style="{
                  width: $q.screen.gt.xs ? '480px' : '100%'
                }"
              >
                <q-item-label
                  class="q-ml-sm q-mb-md"
                  style="letter-spacing: 2px; font-size: 20px; font-weight: bold"
                  >Top up your account</q-item-label
                >
                <q-item-label
                  class="q-mx-sm q-my-lg"
                  style="letter-spacing: 1px; font-size: 16px; color: #888"
                  >Enter the essential information below to top up your points</q-item-label
                >
              </div>
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
                  placeholder="XXXXXXXXXXXX8014"
                />

                <q-card-actions class="q-pa-none justify-between">
                  <vee-input-slot
                    :label="$t('more.creditCard.expiryDate')"
                    icon="mdi-account"
                    name="expiryDate"
                    placeholder="08/21"
                  />

                  <vee-input
                    :label="$t('more.creditCard.cvv')"
                    icon="mdi-account"
                    name="csv"
                    placeholder="XXX"
                  />
                </q-card-actions>

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
  const { userId, purchasePrice, purchasePoints } = useUserStore();
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

  const schema = yup.object({
    number: yup.string().required().label(t("more.creditCard.cardNumber")),
    expiryDate: yup
      .string()
      .required()
      .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry date must be in the format MM/YY")
      .test("expiryDate", "Credit card is expired", function (value) {
        if (!value) return true;
        const currentDate = new Date();
        const [month, year] = value.split("/");
        const expiryDate = new Date(Number("20" + year), Number(month) - 1, 1);
        return expiryDate > currentDate;
      })
      .label(t("more.creditCard.expiryDate")),
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

        const [month, year] = values.expiryDate.split("/");
        values["expMonth"] = month;
        values["expYear"] = `20${year}`;

        values["totalCost"] = parseFloat(purchasePrice) * 100;
        values["subscriberId"] = parseInt(userId);
        values["purchasedPoints"] = purchasePoints;
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
