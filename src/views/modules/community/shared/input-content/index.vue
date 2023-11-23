<template>
  <q-list dense>
    <q-item>
      <toggle-status name="status" dense class="q-pb-none" />
    </q-item>

    <q-item
      ><q-item-section>
        <vee-select-with-id
          :label="$t('business.columns.directory')"
          :options="directoryDropdown"
          name="directoryId"
        /> </q-item-section
    ></q-item>

    <template v-for="field in veeInputsForBusiness" :key="field">
      <q-item>
        <q-item-section>
          <vee-input
            :auto-grow="true"
            :name="field.name"
            :label="$t(field.label)"
            :maxlength="field.maxlength"
          />
        </q-item-section>
      </q-item>
    </template>

    <q-item>
      <template v-for="field in veeInputsForLatLng" :key="field">
        <q-item-section>
          <vee-input :name="field.name" :auto-grow="true" :label="$t(field.label)" />
        </q-item-section>
      </template>
    </q-item>

    <q-item>
      <template v-for="field in veeInputsForOpeningHours" :key="field">
        <q-item-section>
          <app-input-time
            :name="field.name"
            :auto-grow="true"
            :label="$t(field.label)"
            :initialValue="businessInput.openTime"
            v-model="businessInput.openTime"
          />
        </q-item-section>
      </template>
    </q-item>
    <q-item-label header class="text-primary text-weight-bold">Contact Info:</q-item-label>

    <q-list dense>
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
  import { useBusinessInput } from "../use-business-input";

  // Custom component
  //import AppCountrySelect from "@/components/widgets/app-country-select/index.vue";
  import AppInputTime from "@/components/widgets/app-input-time.vue";
  import VeeInput from "@/components/vee-validate/vee-input.vue";
  import VeeSelectWithId from "@/components/vee-validate/vee-select-with-id.vue";
  import ToggleStatus from "@/components/vee-validate/toggle-status.vue";
  import VeeTelInput from "@/components/vee-validate/vee-tel-input.vue";

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

  const { businessInput } = useBusinessInput();

  const veeInputsForBusiness = ref([
    { name: "businessName", label: "business.columns.businessName", maxlength: 32 },
    { name: "title", label: "business.columns.title", maxlength: 25 },
    { name: "subtitle1", label: "business.columns.subtitle1", maxlength: 50 },
    { name: "subtitle2", label: "business.columns.subtitle2", maxlength: 50 },
    { name: "subtitle3", label: "business.columns.subtitle3", maxlength: 50 },
    { name: "businessNameHk", label: "business.columns.businessNameHk", maxlength: 50 },
    { name: "businessNameCn", label: "business.columns.businessNameCn", maxlength: 50 },
    { name: "titleHk", label: "business.columns.titleHk", maxlength: 50 },
    { name: "titleCn", label: "business.columns.titleCn", maxlength: 50 },
    { name: "addressHk", label: "business.columns.addressHk", maxlength: 50 },
    { name: "addressCn", label: "business.columns.addressCn", maxlength: 50 }
  ]);

  const veeInputsForLatLng = ref([
    { name: "latitude", label: "business.columns.latitude", type: "number" },
    { name: "longitude", label: "business.columns.longitude", type: "number" }
  ]);

  const veeInputsForOpeningHours = ref([
    { name: "openTime", label: "business.columns.openTime", type: "number" },
    { name: "closeTime", label: "business.columns.closeTime", type: "number" }
  ]);

  const veeInputsForContactInfo = ref([
    {
      name: "contactWhatsApp",
      label: "business.columns.contactWhatsApp",
      icon: "mdi-whatsapp",
      maxLenght: 16
    },
    {
      name: "contactPhone",
      label: "business.columns.contactPhone",
      icon: "phone",
      type: "tel",
      countryCode: countryCodePhone1,
      maxLenght: 16
    },
    {
      name: "contactOther",
      label: "business.columns.contactOther",
      icon: "phone_iphone",
      type: "tel",
      countryCode: countryCodePhone2,
      maxLenght: 32
    }
  ]);
</script>
