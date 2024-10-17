<template>
  <q-card flat>
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
        <profile-entity-fields-list :entityFields />

        <q-item>
          <q-item-section>
            <app-button
              :label="$t('more.profileSetting.save')"
              color="primary"
              type="submit"
              class="q-mx-xl"
              :disable="!(meta.valid && meta.dirty)"
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

  import type { EntityFields } from "@/interfaces/types/form-structure-types";

  import ProfileImageSection from "./profile-image-section.vue";
  import ProfileEntityFieldsList from "./profile-entity-fields-list.vue";

  // Props
  const { moreData } = defineProps<{
    moreData: any;
  }>();

  const $q = useQuasar();
  const { t } = useI18n({ useScope: "global" });

  // const { avatarImageUpload } = useAuthService();

  const authStyle = computed(() => ($q.screen.gt.sm ? { width: "60vw" } : { width: "100vw" }));

  const form = ref();
  const initialValues = ref({});
  const i18nKey = `auth.register`;
  const createLabel = (name: string) => `${i18nKey}.${name}`;
  const schema = yup.object({
    email: yup.string().min(3).required().label(t("auth.register.email"))
  });

  async function handleSubmit(values: any) {
    const { validate } = form.value;
    const result = await validate();
  }

  const entityFields: EntityFields = {
    sections: [
      {
        name: "info",
        fields: [
          {
            name: "profile-image",
            subFields: [{ name: "profile-image", value: moreData, type: "profile-image" }]
          },
          {
            name: "alias",
            subFields: [{ name: "alias", value: moreData.alias, type: "alias" }]
          },
          {
            name: "name",
            subFields: [
              { name: "firstName", value: moreData.contactPhone },
              { name: "lastName", value: moreData.contactWhatsApp }
            ]
          },
          {
            name: "phone",
            subFields: [{ name: "phone", value: moreData.contactPhone, type: "tel" }]
          }
        ]
      }
    ].map(section => ({
      ...section,
      fields: section.fields.map(field => ({
        ...field,
        subFields: field.subFields.map(subField => ({
          ...subField,
          label: createLabel(subField.name)
        }))
      }))
    }))
  };
</script>
