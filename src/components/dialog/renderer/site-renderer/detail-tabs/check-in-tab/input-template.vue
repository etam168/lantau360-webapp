<template>
  <Form
    ref="form"
    class="full-height"
    :initial-values="initialValues"
    :validation-schema="schema"
    @submit="onSubmit"
    v-slot="{ meta, values }"
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
        <q-item>
          <q-item-section avatar>
            <q-avatar
              dense
              rounded
              color="primary"
              icon="location_on"
              text-color="white"
              size="sm"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-caption">{{ $t("home.curentLocation") }} </q-item-label>
            <q-item-label class="text-caption">{{ currentAddress }} </q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section avatar>
            <q-avatar
              dense
              rounded
              color="primary"
              icon="location_on"
              text-color="white"
              size="sm"
            />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-caption">{{ $t("home.destinationAddress") }} </q-item-label>
            <q-item-label class="text-caption">{{ destinationAddress }} </q-item-label>
            <q-item-label class="text-caption"
              >{{ distance + " " + $t("home.metersAway") }}
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item v-if="props.distance && props.distance > 10">
          <q-item-label style="color: red">
            {{ $t("errors.under10MeterDistance") }}
          </q-item-label>
        </q-item>
        <div v-if="props.distance <= 10">
          <div v-if="!configLoading && isPermitToPost">
            <q-item class="q-mt-lg q-pa-none">
              <q-item-section class="q-pa-none">
                <vee-input type="textarea" :label="$t('home.review')" name="description" />
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
            Please wait, to recheck-in again!.
          </div>
        </div>
      </q-card-section>
    </q-card>
  </Form>
</template>

<script setup lang="ts">
  import { Form } from "vee-validate";
  import * as yup from "yup";
  import { CheckIn } from "@/interfaces/models/entities/checkin";
  import { ref } from "vue";
  import { useUserStore } from "@/stores/user";
  import i18n from "@/plugins/i18n/i18n";
  import { URL } from "@/constants";
  import { Content } from "@/interfaces/models/entities/content";

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
      required: false
    }
  });

  const loading = ref(false);
  const configLoading = ref(true);
  const { eventBus } = useUtilities();
  const userStore = useUserStore();
  const $q = useQuasar();
  const { t } = i18n.global;
  const error = ref<string | null>(null);
  const isPermitToPost = ref(false);
  const form = ref();
  const initialValues = ref({
    description: ""
  });
  const schema = yup.object({
    description: yup.string().required().label(t("home.description"))
  });
  const isSubmitReviewEnabled = computed(() => {
    return props.currentAddress && props.destinationAddress && props.distance != undefined;
  });
  function onSubmit(values: any) {
    form.value.validate().then(async (isValid: any) => {
      if (isValid) {
        loading.value = true;

        const checkInDto: CheckIn = {
          siteId: props.itemId,
          memberId: parseInt(userStore.userId),
          checkInfo: {
            description: values.description,
            checkInAt: new Date()
          },
          createdAt: new Date(),
          createdBy: parseInt(userStore.userId)
        };

        await axios
          .post("/CheckIn", checkInDto)
          .then(() => {
            $q.notify({
              message: t("home.message.checkInDataSubmittedSuccessfully"),
              type: "positive",
              color: "primary"
            });
            loading.value = false;
            eventBus.emit("refresh-directory-checkin-items");
            eventBus.emit("close-check-in-dialog");
          })
          .catch(err => {
            debugger;
            $q.notify({
              message: err.message,
              type: "negative"
            });
            loading.value = false;
          });
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

    const configTimeDifference = config?.meta?.checkInTimeDifferenceInHours ?? 1;

    const timeDifference = new Date().getTime() - new Date(checkIn?.modifiedAt ?? "").getTime();
    const hoursDifference = Math.abs(timeDifference / (1000 * 60 * 60));

    isPermitToPost.value = hoursDifference >= configTimeDifference;
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
