<template>
  <q-list dense>
    <q-item>
      <q-item-section>
        <toggle-status name="status" class="q-pb-none" />
      </q-item-section>
    </q-item>

    <template v-for="(member, index) in members" :key="index">
      <q-item>
        <q-item-section>
          <vee-input
            :name="member.name"
            :maxlength="member.maxlength"
            counter
            stack-label
            :label="$t(member.label)"
          />
        </q-item-section>
      </q-item>
    </template>
  </q-list>
</template>

<script setup lang="ts">
  // Vue Import
  import { ref } from "vue";

  //import { translateFeatures } from "@/composable/use-search-bar-options";
  // Custom Components
  import VeeInput from "@/components/vee-validate/vee-input.vue";
  import ToggleStatus from "@/components/vee-validate/toggle-status.vue";

  // .ts files
  // import { District } from "@/interfaces/models/entities/district";

  // const districtList = inject<District[]>("districtList");
  // const disrict = ref(districtList || []);
  // const districtDropdown = ref();

  const members = ref([
    { name: "alias", label: "member.columns.alias", maxlength: 25 },
    { name: "firstName", label: "member.columns.firstName", maxlength: 25 },
    { name: "firstNameHk", label: "member.columns.firstNameHk", maxlength: 16 },
    { name: "firstNameCn", label: "member.columns.firstNameCn", maxlength: 16 },
    { name: "lastName", label: "member.columns.lastName", maxlength: 25 },
    { name: "lastNameHk", label: "member.columns.lastNameHk", maxlength: 16 },
    { name: "lastNameCn", label: "member.columns.lastNameCn", maxlength: 16 },
    { name: "phone", label: "member.columns.phone", maxlength: 8 },
    { name: "email", label: "member.columns.email", maxlength: 25 }
  ]);

  // const addresses = ref([
  //   { name: "address", label: "directory.columns.address", maxlength: 20 },
  //   { name: "addressHk", label: "directory.columns.addressAltHk", maxlength: 20 },
  //   { name: "addressCn", label: "directory.columns.addressAltCn", maxlength: 20 }
  // ]);

  // districtDropdown.value = disrict.value
  //   .map(group => {
  //     return {
  //       label: translateFeatures(group.districtName, group.districtNameAlt, "districtName"),
  //       value: group.districtId
  //     };
  //   })
  //   .sort((a, b) => {
  //     return a.label.localeCompare(b.label, undefined, { sensitivity: "base" });
  //   });
</script>
