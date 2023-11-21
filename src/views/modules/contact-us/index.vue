<template>
  <q-page class="bg-grey-2 q-pb-sm" style="max-width: 960px">
    <app-page-title>{{ $t("contact.title") }}</app-page-title>
    <q-separator />

    <vee-form :validation-schema="schema" @submit="onOKClick" v-slot="{ meta }">
      <q-card class="col q-pa-md q-ma-md" bordered flat style="max-width: 500px">
        <content-input-component />

        <q-card-actions align="right" class="q-pa-none">
          <app-button
            color="primary"
            :label="$t('contact.submit')"
            :disabled="!(meta.valid && meta.dirty)"
            type="submit"
          /> </q-card-actions
      ></q-card>
    </vee-form>
  </q-page>
</template>

<script setup lang="ts">
  import { onMounted } from "vue";

  // .ts files
  import useContent from "./use-content-input";
  import { useUtilities } from "@/composable/use-utilities";
  import { ContentOption } from "@/constants";

  // Custom Components
  import AppButton from "@/components/widgets/app-button.vue";
  import AppPageTitle from "@/components/widgets/app-page-title.vue";
  import ContentInputComponent from "./content-input.vue";

  const { getContentByName, saveContent, contentInput, schema } = useContent();
  const { notify } = useUtilities();

  function onOKClick() {
    saveContent(contentInput.value, ContentOption.CONTACT);
  }

  function loadData() {
    try {
      getContentByName(ContentOption.CONTACT).then(response => {
        contentInput.value = response.data;
      });
    } catch (e: any) {
      if (e.status != 404) {
        notify(e.message, "negative");
      }
    }
  }

  onMounted(() => {
    loadData();
  });
</script>
