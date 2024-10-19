<template>
  <Form
    ref="form"
    class="full-height"
    :initial-values="initialValues"
    :validation-schema="schema"
    @submit="onSubmit"
  >
    <q-item class="justify-center">
      <q-item-label v-if="!isSubmitReviewEnabled" style="color: red"
        >{{ $t("errors.destinationRequired") }}
      </q-item-label>
    </q-item>
    <q-card flat class="row justify-center">
      <q-card-section
        class="q-ma-none q-pa-xs"
        :style="$q.screen.gt.xs ? 'width: 400px' : 'width : 100%'"
      >
        <div v-for="location in locationData" :key="location.lable">
          <q-item>
            <q-item-section avatar>
              <q-avatar
                dense
                rounded
                color="primary"
                icon="fa-solid fa-location-dot"
                text-color="white"
                size="sm"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-caption">{{ location.lable }} </q-item-label>
              <q-item-label class="text-caption">{{ location.address }} </q-item-label>
            </q-item-section>
          </q-item>
        </div>

        <q-item-label class="text-caption" style="margin-left: 70px"
          >{{ distance + " " + $t(`${i18nKey}.metersAway`) }}
        </q-item-label>
        <q-item v-if="props.distance && props.distance > 10">
          <q-item-label style="color: red">
            {{ $t("errors.under10MeterDistance") }}
          </q-item-label>
        </q-item>
        <div v-if="props.distance <= 10">
          <div v-if="!configLoading && isPermitToPost">
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
                :disabled="!isSubmitReviewEnabled"
              />
            </q-card-actions>
          </div>
          <div style="color: red" v-else-if="!configLoading && !isPermitToPost">
            {{ "Please wait, you can check-in again after " + timeUntilNextCheckIn + " minutes" }}
          </div>
        </div>
      </q-card-section>
    </q-card>
  </Form>
</template>

<script setup lang="ts">
  // Third party imports
  import { Form } from "vee-validate";
  import * as yup from "yup";

  // Interface files
  import { CheckIn } from "@/interfaces/models/entities/checkin";
  import { Content } from "@/interfaces/models/entities/content";

  import { useCheckInService } from "@/composable/services/use-checkin-dialog-service";

  //.ts files
  import i18n from "@/plugins/i18n/i18n";
  import { useUserStore } from "@/stores/user";
  import { URL } from "@/constants";

  const props = defineProps({
    itemId: {
      type: Number,
      required: true
    },
    currentAddress: {
      type: String,
      required: false
    },
    destinationAddress: {
      type: String,
      required: false
    },
    distance: {
      type: Number,
      required: false,
      default: 11
    }
  });

  const { t } = i18n.global;

  const { submitCheckIn } = useCheckInService();
  const { eventBus } = useUtilities();
  const userStore = useUserStore();
  const $q = useQuasar();

  const loading = ref(false);
  const configLoading = ref(true);
  const isPermitToPost = ref(false);
  const timeUntilNextCheckIn = ref();
  const error = ref<string | null>(null);
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

  const isSubmitReviewEnabled = computed(() => {
    return props.currentAddress && props.destinationAddress && props.distance != undefined;
  });

  const locationData = computed(() => [
    { lable: t(`${i18nKey}.curentLocation`), address: props.currentAddress },
    { lable: t(`${i18nKey}.destinationAddress`), address: props.destinationAddress }
  ]);

  function onSubmit(values: any) {
    form.value.validate().then(async (isValid: any) => {
      if (isValid) {
        loading.value = true;
        const responseStatus = await submitCheckIn(props.itemId, values.description);
        if (responseStatus) {
          eventBus.emit("refresh-directory-checkin-items");
          eventBus.emit("close-check-in-dialog");
        }
        loading.value = false;
      }
    });
  }

  try {
    const [memberConfig, checkInData] = await Promise.all([
      axios.get<Content>(URL.MEMBER_CONFIG),
      axios.get<CheckIn>(`${URL.MEMBER_SITE_CHECK_IN}/${userStore.userId}/${props.itemId}`)
    ]);

    const config = memberConfig.data;
    const checkIn = checkInData.data;

    const configTimeDifferenceInHours = config?.meta?.checkInTimeDifferenceInHours ?? 1;
    const configTimeDifferenceInMinutes = configTimeDifferenceInHours * 60;

    const checkInModifiedAt = checkIn?.modifiedAt ? new Date(checkIn.modifiedAt).getTime() : 0;
    const currentTime = new Date().getTime();
    const timeDifferenceInMilliseconds = currentTime - checkInModifiedAt;
    const timeDifferenceInMinutes = Math.abs(timeDifferenceInMilliseconds / (1000 * 60));

    const minutesLeftToRecheckIn = configTimeDifferenceInMinutes - timeDifferenceInMinutes;

    if (minutesLeftToRecheckIn <= 0) {
      isPermitToPost.value = true;
      timeUntilNextCheckIn.value = 0; // or null, or some other indicator that they can post now
    } else {
      isPermitToPost.value = false;
      timeUntilNextCheckIn.value = Math.ceil(minutesLeftToRecheckIn); // Round up to the nearest minute
    }

    configLoading.value = false;
  } catch (err) {
    configLoading.value = false;
    isPermitToPost.value = true;
    if (err instanceof AxiosError) {
      if (err.response && err.response.status === 404) {
        error.value = t("errors.404");
      } else {
        error.value = t("errors.anErrorOccured");
      }
    } else {
      error.value = t("errors.anErrorOccured");
    }
  }
</script>
