<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    :model-value="isDialogVisible"
  >
    <q-layout view="lHh lpr lFf" class="bg-white" style="max-width: 1024px">
      <q-header class="bg-transparent text-dark">
        <app-dialog-title>{{ "CheckIn" }}</app-dialog-title>
      </q-header>

      <q-page-container>
        <q-page>
          <Form
            ref="form"
            class="full-height"
            :initial-values="initialValues"
            :validation-schema="schema"
            @submit="onSubmit"
            v-slot="{ meta, values }"
          >
            <q-card-section class="q-ma-none q-pa-xs">
              <vee-input type="textarea" label="Description" name="description" />

              <q-card-actions class="q-mt-lg q-pa-none">
                <app-button
                  label="Submit"
                  :loading="loading"
                  color="primary"
                  type="submit"
                  size="md"
                />
              </q-card-actions>
            </q-card-section>
          </Form>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import { useDialogPluginComponent } from "quasar";
  import { Form } from "vee-validate";
  import * as yup from "yup";
  import { CheckIn } from "@/interfaces/models/entities/check-in";
  import { ref } from "vue";
  import { useUserStore } from "@/stores/user";

  const props = defineProps({
    userLocation: {
      type: Object,
      required: true
    },
    itemId: {
      type: Number,
      required: true
    }
  });

  const { dialogRef } = useDialogPluginComponent();
  const isDialogVisible = ref();
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

  function onSubmit(values: any) {
    form.value.validate().then(async (isValid: any) => {
      if (isValid) {
        loading.value = true;

        const checkInDto: CheckIn = {
          siteId: props.itemId,
          status: 1,
          description: values.description,
          createdAt: new Date(),
          createdBy: parseInt(userStore.userId),
          userLocation: props.userLocation
        };

        await axios
          .post("/CheckIn", checkInDto)
          .then(() => {
            $q.notify({
              message: "CheckIn data submit successfully",
              type: "positive",
              color: "primary"
            });
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
