<template>
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
        <app-button label="Submit" :loading="loading" color="primary" type="submit" size="md" />
      </q-card-actions>
    </q-card-section>
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
