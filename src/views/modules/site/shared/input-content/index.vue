<template>
  <q-list dense>
    <q-item>
      <toggle-status name="status" dense class="q-pb-none" />
    </q-item>

    <q-item
      ><q-item-section>
        <vee-select-with-id
          stack-label
          :options="directoryDropdown"
          name="directoryId"
          :label="$t('site.columns.directory')"
        /> </q-item-section
    ></q-item>

    <template v-for="field in veeInputsForSite" :key="field">
      <q-item>
        <q-item-section>
          <vee-input
            :name="field.name"
            :auto-grow="true"
            :maxlength="field.maxlength"
            stack-label
            :label="$t(field.label)"
          />
        </q-item-section>
      </q-item>
    </template>

    <!-- Contact Info -->

    <q-item-label header class="text-primary text-weight-bold">Contact Info:</q-item-label>
    <q-list dense>
      <!-- <template v-for="contact in veeInputsForContactInfo" :key="contact">
        <q-item>
          <q-item-section>
            <vee-input
              :name="contact.name"
              :type="contact.type"
              stack-label
              :label="$t(contact.label)"
              :max-lenght="contact.maxLenght"
              :counter="true"
            />
          </q-item-section>
        </q-item>
      </template> -->
      <template v-for="contact in veeInputsForContactInfo" :key="contact">
        <q-item
          ><q-item-section>
            <VeeTelInput
              :name="contact.name"
              :labelText="$t(contact.label)" /></q-item-section></q-item
      ></template>
    </q-list>
  </q-list>
</template>

<script setup lang="ts">
  import { inject, ref } from "vue";

  // .ts file
  import { Directory } from "@/interfaces/models/entities/directory";

  // Custom component
  // import CheckBox from "@/components/vee-validate/checkbox-status.vue";
  //import AppCountrySelect from "@/components/widgets/app-country-select/index.vue";
  import VeeTelInput from "@/components/vee-validate/vee-tel-input.vue";
  import VeeInput from "@/components/vee-validate/vee-input.vue";
  import VeeSelectWithId from "@/components/vee-validate/vee-select-with-id.vue";
  import ToggleStatus from "@/components/vee-validate/toggle-status.vue";

  const directoryList = inject<Directory[]>("directoryList");

  const directory = ref(directoryList || []);
  const directoryDropdown = ref();

  directory.value.sort((a: any, b: any) =>
    String(a.directoryName).localeCompare(String(b.directoryName))
  );

  directoryDropdown.value = directory.value.map((group: any) => {
    return {
      value: group.directoryId,
      label: group.directoryName
    };
  });

  const countryCodePhone1 = ref("+852");
  const countryCodePhone2 = ref("+852");

  const veeInputsForSite = ref([
    { name: "siteName", label: "site.columns.siteName", maxlength: 32 },
    { name: "title", label: "site.columns.title", maxlength: 25 },
    { name: "subtitle1", label: "site.columns.subtitle1", maxlength: 50 },
    { name: "subtitle2", label: "site.columns.subtitle2", maxlength: 50 },
    { name: "subtitle3", label: "site.columns.subtitle3", maxlength: 50 },
    { name: "latitude", label: "site.columns.latitude", type: "number" },
    { name: "longitude", label: "site.columns.longitude", type: "number" },
    { name: "siteNameHk", label: "site.columns.siteNameHk", maxlength: 50 },
    { name: "siteNameCn", label: "site.columns.siteNameCn", maxlength: 50 },
    { name: "titleHk", label: "site.columns.titleHk", maxlength: 50 },
    { name: "titleCn", label: "site.columns.titleCn", maxlength: 50 },
    { name: "addressHk", label: "site.columns.addressHk", maxlength: 50 },
    { name: "addressCn", label: "site.columns.addressCn", maxlength: 50 }
  ]);

  const veeInputsForContactInfo = ref([
    {
      name: "contactWhatsApp",
      label: "site.columns.contactWhatsApp",
      icon: "mdi-whatsapp",
      maxLenght: 25
    },
    {
      name: "contactPhone",
      label: "site.columns.contactPhone",
      icon: "phone",
      type: "tel",
      countryCode: countryCodePhone1,
      maxLenght: 8
    },
    {
      name: "contactOther",
      label: "site.columns.contactOther",
      icon: "phone_iphone",
      type: "tel",
      countryCode: countryCodePhone2,
      maxLenght: 8
    }
  ]);
</script>
