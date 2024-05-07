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
        <app-dialog-title>{{ "Payment" }}</app-dialog-title>
      </q-header>

      <q-page-container>
        <q-page>
          <q-card flat class="q-pa-md">
            <!-- <q-card-section class="row items-center q-pa-none q-mt-sm"> </q-card-section> -->

            <q-card-section class="text-center">
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
                  name="cardNumber"
                  placeholder="XXXX XXXX XXXX 8014"
                />
                <vee-input
                  :label="$t('more.creditCard.cardHolderName')"
                  icon="mdi-account"
                  name="cardHolderName"
                  placeholder="EDDIE TAM"
                />
                <q-card-actions class="q-pa-none justify-between">
                  <vee-input
                    :label="$t('more.creditCard.expiryDate')"
                    icon="mdi-account"
                    name="expiryDate"
                    placeholder="08/21"
                    style="width: 49%"
                  />

                  <vee-input
                    :label="$t('more.creditCard.cvv')"
                    icon="mdi-account"
                    name="cvv"
                    placeholder="XXX"
                    style="width: 49%"
                  />
                </q-card-actions>

                <q-card-section class="text-h4">{{ `Total: $50` }}</q-card-section>

                <q-card-actions class="q-mt-md justify-end q-pa-none">
                  <app-button
                    label="Proceed to pay"
                    :loading="loading"
                    :class="$q.screen.lt.sm ? 'full-width' : ''"
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
  import { useDialogPluginComponent } from "quasar";
  import { useUtilities } from "@/composable/use-utilities";
  import * as yup from "yup";
  // import { useUserStore } from "@/stores/user";
  import i18n from "@/plugins/i18n/i18n";

  const { eventBus } = useUtilities();
  const { dialogRef } = useDialogPluginComponent();
  // const { availabelPoints, pointsPerPost, topUpPoints } = useUserStore();
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
  provide("formInitialValues", initialValues);

  // const title = computed(() =>
  //   availabelPoints >= pointsPerPost
  //     ? t("more.profileSetting.enoughPoints")
  //     : t("more.profileSetting.confirmation")
  // );

  // const bodyMessage = computed(() =>
  //   availabelPoints >= pointsPerPost
  //     ? t("more.profileSetting.pointLessThan50", { points: pointsPerPost })
  //     : t("more.profileSetting.claimFreePointText", { points: topUpPoints })
  // );

  // const haveEnoughPoints = computed(() => availabelPoints >= pointsPerPost);

  const schema = yup.object({
    cardNumber: yup.string().email().required().label(t("more.creditCard.cardNumber")),
    cardHolderName: yup.string().required().min(4).label(t("more.creditCard.cardHolderName")),
    expiryDate: yup.string().required().label(t("more.creditCard.expiryDate")),
    cvv: yup.string().required().label(t("more.creditCard.cvv"))
  });

  onMounted(() => {
    eventBus.on("CreditCardDialog", () => {
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
        console.log(values);

        // await axios
        //   .post("/CheckIn", checkInDto)
        //   .then(() => {
        //     $q.notify({
        //       message: "CheckIn data submit successfully",
        //       type: "positive",
        //       color: "primary"
        //     });
        //     loading.value = false;
        //   })
        //   .catch(err => {
        //     $q.notify({
        //       message: err.message,
        //       type: "negative"
        //     });
        //     loading.value = false;
        //   });
      }
    });
  }

  // function handleOk() {
  //   props.callback(onDialogCancel);
  // }

  onBeforeMount(() => {
    initialValues.value = {
      cardNumber: "",
      cardHolderName: "",
      expiryDate: "",
      cvv: ""
    };
  });
</script>
