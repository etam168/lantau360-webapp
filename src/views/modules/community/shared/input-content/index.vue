<template>
  <q-list dense>
    <q-item class="q-mb-sm">
      <toggle-status name="status" dense class="q-pb-none" />
    </q-item>

    <template v-for="field in veeInputsForPosting" :key="field">
      <q-item>
        <q-item-section>
          <vee-input
            :name="field.name"
            :auto-grow="true"
            :maxlength="field.maxlength"
            stack-label
            :label="$t(field.label)"
            :input-type="field.type"
          />
        </q-item-section>
      </q-item>
    </template>

    <!-- Contact Info -->

    <q-item-label header class="text-primary text-weight-bold">Contact Info:</q-item-label>
    <q-list dense>
      <q-item>
        <q-item-section>
          <vee-input
            :name="veeInputsForContactOther.name"
            stack-label
            :label="$t(veeInputsForContactOther.label)"
            :max-lenght="veeInputsForContactOther.maxLenght"
            :counter="true"
          />
        </q-item-section>
      </q-item>
      <template v-for="contact in veeInputsForContactInfo" :key="contact">
        <q-item
          ><q-item-section>
            <vee-tel-input
              class="q-mb-sm"
              :name="contact.name"
              :default-country="contact.defaultIso"
              :labelText="$t(contact.label)" /></q-item-section
        ></q-item>

        <template v-for="contact in veeInputsForContactWhatsapp" :key="contact">
          <q-item>
            <q-item-section>
              <vee-input-whatsapp
                :name="contact.name"
                stack-label
                :label="$t(contact.label)"
                :max-lenght="contact.maxLenght"
                :counter="true"
              />
            </q-item-section>
          </q-item>
        </template>
      </template>
    </q-list>
  </q-list>
</template>

<script setup lang="ts">
  import { ref } from "vue";

  const veeInputsForPosting = ref([
    { name: "postingName", label: "posting.columns.postingName", maxlength: 32 },
    { name: "title", label: "posting.columns.title", maxlength: 25 },
    { name: "subtitle1", label: "posting.columns.subtitle1", maxlength: 50 },
    { name: "subtitle2", label: "posting.columns.subtitle2", maxlength: 50 },
    { name: "subtitle3", label: "posting.columns.subtitle3", maxlength: 50 },
    { name: "latitude", label: "posting.columns.latitude", type: "number" },
    { name: "longitude", label: "posting.columns.longitude", type: "number" },
    { name: "postingNameHk", label: "posting.columns.postingNameHk", maxlength: 50 },
    { name: "postingNameCn", label: "posting.columns.postingNameCn", maxlength: 50 },
    { name: "titleHk", label: "posting.columns.titleHk", maxlength: 50 },
    { name: "titleCn", label: "posting.columns.titleCn", maxlength: 50 },
    { name: "subtitle1Hk", label: "posting.columns.subtitle1Hk", maxlength: 50 },
    { name: "subtitle1Cn", label: "posting.columns.subtitle1Cn", maxlength: 50 },
    { name: "rank", label: "posting.columns.rank", type: "number" }
  ]);

  const veeInputsForContactOther = ref({
    name: "contactOther",
    label: "posting.columns.contactOther",
    icon: "person",
    maxLenght: 25
  });

  const veeInputsForContactInfo = ref([
    {
      name: "contactPhone",
      label: "posting.columns.contactPhone",
      icon: "phone",
      type: "tel",
      defaultIso: "HK"
    }
  ]);

  const veeInputsForContactWhatsapp = ref([
    {
      name: "contactWhatsApp",
      label: "posting.columns.contactWhatsApp",
      maxLenght: 8
    }
  ]);
</script>
