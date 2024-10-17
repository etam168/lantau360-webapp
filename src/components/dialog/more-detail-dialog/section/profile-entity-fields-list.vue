<template>
  <q-list v-for="(section, index) in entityFields.sections" :key="index" dense>
    <template v-for="field in section.fields" :key="field.name">
      <q-item dense class="q-col-gutter-x-md">
        <q-item-section v-for="subField in field.subFields" :key="subField.name">
          <profile-image-section
            v-if="subField.type === 'profile-image'"
            :value="getValue(subField.value)"
            @avatar-upload="handleUpdateMemberAvatar"
          />

          <vee-q-tel-input
            v-else-if="subField.type === 'tel'"
            defaultIso="HK"
            :name="subField.name"
            :label="$t(subField.label as string)"
          />
          <vee-input
            v-else
            :auto-grow="true"
            :name="subField.name"
            :label="$t(subField.label as string)"
            :maxlength="subField.maxlength"
          />
        </q-item-section>
      </q-item>
    </template>
  </q-list>
</template>

<script setup lang="ts">
  import { EntityFields } from "@/interfaces/types/form-structure-types";
  import { ENTITY_URL } from "@/constants";
  import { useUserStore } from "@/stores/user";

  import ProfileImageSection from "./profile-image-section.vue";

  // Props declaration
  const { entityFields } = defineProps<{
    entityFields: EntityFields;
  }>();

  const userStore = useUserStore();
  const error = ref<string | null>(null);
  const { t } = useI18n({ useScope: "global" });

  function getValue(value: any) {
    return value as Record<string, any>;
  }

  async function handleUpdateMemberAvatar(newAvatar: any) {
    const url = `${ENTITY_URL.MEMBER_IMAGE}/${userStore.userId}`;

    const formData = new FormData();
    formData.append("image", newAvatar);

    await axios
      .post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      .then(response => {
        if (response.status == 200) {
          userStore.profilePic = response.data;
        }
      })
      .catch(err => {
        if (err instanceof AxiosError) {
          if (err.response && err.response.status === 404) {
            error.value = t("errors.404");
          } else {
            error.value = t("errors.anErrorOccured");
          }
        } else {
          error.value = t("errors.anErrorOccured");
        }
      });
  }
</script>
