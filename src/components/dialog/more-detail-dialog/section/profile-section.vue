<template>
  <q-card flat>
    <profile-image-section :moreData />
    <q-card-section
      class="q-ma-none q-pa-none"
      style="display: flex; justify-content: center; align-items: center"
    >
      <Form
        ref="form"
        class="full-height"
        :initial-values="initialValues"
        :validation-schema="schema"
        @submit="handleSubmit"
        v-slot="{ meta }"
        :style="authStyle"
      >
        <q-item>
          <q-item-section>
            <vee-input name="alias" stack-label :label="$t('auth.register.alias')" />
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section v-for="(field, index) in fullNameFields" :key="index">
            <vee-input :name="field.name" :maxlength="field.maxlength" :label="$t(field.label)" />
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section> <vee-q-tel-input name="phone" defaultIso="HK" /></q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <app-button
              :label="$t('more.profileSetting.save')"
              color="primary"
              type="submit"
              class="q-mx-xl"
            />
          </q-item-section>
        </q-item>
      </Form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  import * as yup from "yup";
  import { Form } from "vee-validate";

  import ProfileImageSection from "./profile-image-section.vue";

  // Props
  const { moreData } = defineProps<{
    moreData: any;
  }>();

  const { translate } = useUtilities();
  const $q = useQuasar();
  const { t } = useI18n({ useScope: "global" });

  const authStyle = computed(() => ($q.screen.gt.sm ? { width: "60vw" } : { width: "100vw" }));

  const form = ref();
  const initialValues = ref({});
  const schema = yup.object({
    email: yup.string().min(3).required().label(t("auth.register.email"))
  });

  const fullNameFields = [
    { name: "firstName", label: "auth.register.firstName", icon: "", maxlength: 20 },
    { name: "lastName", label: "auth.register.lastName", icon: "", maxlength: 20 }
  ];

  async function handleSubmit(values: any) {
    const { validate } = form.value;
    const result = await validate();
  }
</script>
