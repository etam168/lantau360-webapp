<template>
  <q-card-section class="q-pa-none">
    <vee-input name="metaContactName" stack-label :label="$t('contact.contactName')" />
    <vee-input name="metaFirstName" stack-label :label="$t('contact.firstName')" />
    <vee-input name="metaLastName" stack-label :label="$t('contact.lastName')" />
    <vee-input name="metaEmail" stack-label :label="$t('contact.email')" />

    <vee-input-password-other name="metaPassword" stack-label :label="$t('contact.password')" />
    <vee-input name="metaPhone" stack-label maxlength="8" :label="$t('contact.phone')" />
    <vee-input
      type="textarea"
      stack-label
      name="metaContentData"
      :label="$t('contact.message.message')"
    />
  </q-card-section>
</template>

<script setup lang="ts">
  import { onMounted, ref, watch } from "vue";

  // .ts files
  import useContent from "./use-content-input";
  import i18n from "@/plugins/i18n/i18n";

  //Custom Component
  import VeeInput from "@/components/vee-validate/vee-input.vue";
  import VeeInputPasswordOther from "@/components/vee-validate/vee-input-password-other.vue";

  const { locale } = i18n.global;

  const {
    contentInput,
    metaContactName,
    metaFirstName,
    metaLastName,
    metaPhone,
    metaEmail,
    metaPassword,
    metaContentData
  } = useContent();

  const lang = ref(locale as any);

  watch(metaContentData, newValue => {
    if (lang.value == "en") {
      contentInput.value.contentData = newValue;
    } else if (lang.value == "zh" || lang.value == "hk") {
      contentInput.value.meta.i18n ??= {};
      contentInput.value.meta.i18n[lang.value] ??= {};
      contentInput.value.meta.i18n[lang.value]["contentData"] = newValue;
    }
  });

  watch([metaContactName, metaFirstName, metaLastName, metaPhone, metaEmail, metaPassword], () => {
    contentInput.value.meta ??= {};
    contentInput.value.meta["contactName"] = metaContactName.value;
    contentInput.value.meta["firstName"] = metaFirstName.value;
    contentInput.value.meta["lastName"] = metaLastName.value;
    contentInput.value.meta["phone"] = metaPhone.value;
    contentInput.value.meta["email"] = metaEmail.value;
    contentInput.value.meta["password"] = metaPassword.value;
  });

  onMounted(() => {
    if (lang.value == "en") {
      metaContentData.value = contentInput.value.contentData;
    } else if (lang.value == "zh" || lang.value == "hk") {
      metaContentData.value = contentInput.value.meta?.i18n?.[lang.value]?.contentData ?? "";
    }
  });
</script>
