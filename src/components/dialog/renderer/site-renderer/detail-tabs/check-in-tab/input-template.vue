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
      <q-item-label v-if="!isDataAvailable" style="color: red"
        >{{ "Current and destiantion location is required to submit review" }}
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
            <q-item-label class="text-caption">{{ "Cuurent Location:" }} </q-item-label>
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
            <q-item-label class="text-caption">{{ "Destiantion Address" }} </q-item-label>
            <q-item-label class="text-caption">{{ destinationAddress }} </q-item-label>
            <q-item-label class="text-caption">{{ distance + " (Meters away)" }} </q-item-label>
          </q-item-section>
        </q-item>
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
            :disabled="!isDataAvailable"
          />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </Form>
</template>

<script setup lang="ts">
  import { Form } from "vee-validate";
  import * as yup from "yup";
  import { CheckIn } from "@/interfaces/models/entities/check-in";
  import { ref } from "vue";
  import { useUserStore } from "@/stores/user";

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
  const userStore = useUserStore();
  const $q = useQuasar();

  const form = ref();
  const initialValues = ref({
    description: ""
  });
  const schema = yup.object({
    description: yup.string().required().label("descritption")
  });
  const isDataAvailable = computed(() => {
    debugger;
    return props.currentAddress && props.destinationAddress && props.distance;
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
              message: "CheckIn data submit successfully",
              type: "positive",
              color: "primary"
            });
            loading.value = false;
          })
          .catch(err => {
            $q.notify({
              message: err.message,
              type: "negative"
            });
            loading.value = false;
          });
      }
    });
  }
</script>
