<template>
  <div>
    <q-item-label
      class="q-mx-md q-mt-lg"
      style="letter-spacing: 1px; font-size: 16px; font-weight: bold"
      >{{ $t("more.creditCard.payByCreditCard") }}</q-item-label
    >
    <Form
      class="q-ml-md"
      ref="form"
      :initial-values="initialValues"
      :validation-schema="schema"
      @submit="onSubmit"
    >
      <vee-input
        class="q-mt-md"
        :label="$t('more.creditCard.cardNumber')"
        icon="fa-solid fa-user"
        name="number"
        placeholder="XXXXXXXXXXXX8014"
      />
      <q-card-actions class="q-pa-none justify-between">
        <div class="row items-center">
          <div class="col">
            <vee-input-slot
              :label="$t('more.creditCard.expiryDate')"
              icon="fa-solid fa-user"
              name="expiryDate"
              placeholder="08/26"
              :slotImage="IMAGES.CREDIT_CARD_FRONT"
            />
          </div>
          <div class="col">
            <vee-input-slot
              class="q-pl-md"
              :label="$t('more.creditCard.cvv')"
              icon="fa-solid fa-user"
              name="csv"
              placeholder="XXX"
              :slotImage="IMAGES.CREDIT_CARD_BACK"
            />
          </div>
        </div>
      </q-card-actions>

      <q-card-actions class="q-mt-sm justify-end q-pa-none">
        <app-button
          :label="$t('more.creditCard.proceedToPay')"
          :loading="loading"
          class="full-width"
          color="primary"
          type="submit"
          size="md"
        />
      </q-card-actions>
    </Form>
  </div>
</template>

<script setup lang="ts">
  import { Form } from "vee-validate";
  import * as yup from "yup";
  import i18n from "@/plugins/i18n/i18n";
  import { useTopUpInput } from "../use-top-up-input";
  import { IMAGES } from "@/constants";
  const emits = defineEmits(["update-dialog-status"]);

  const { creditCardCheckout } = useTopUpInput();
  const initialValues = ref({});
  const { t } = i18n.global;
  const form = ref();

  const loading = ref(false);
  const selectedPackage = inject("selectedPackage") as Ref<any>;

  const schema = yup.object({
    number: yup.string().required().label(t("more.creditCard.cardNumber")),
    expiryDate: yup
      .string()
      .required()
      .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, t("errors.expiryDateFormat"))
      .test("expiryDate", t("errors.creditCardExpire"), function (value) {
        if (!value) return true;
        const currentDate = new Date();
        const [month, year] = value.split("/");
        const expiryDate = new Date(Number("20" + year), Number(month) - 1, 1);
        return expiryDate > currentDate;
      })
      .label(t("more.creditCard.expiryDate")),
    csv: yup.string().required().label(t("more.creditCard.cvv"))
  });

  function onSubmit(values: any) {
    form.value.validate().then(async (isValid: any) => {
      if (isValid) {
        loading.value = true;

        const checkoutStatus = await creditCardCheckout(values, selectedPackage.value);
        loading.value = false;

        if (checkoutStatus) {
          emits("update-dialog-status", false);
        }
      }
    });
  }
</script>
