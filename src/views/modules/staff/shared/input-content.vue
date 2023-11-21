<template>
  <q-list dense>
    <!-- <q-item>
      <toggle-status name="status" dense class="q-pb-none" />
    </q-item> -->
    <q-item-label
      class="q-ml-lg text-bold q-mt-none"
      style="margin-left: 80px"
      v-if="!isStaffCreate"
    >
      {{ staffData.userName }}</q-item-label
    >
    <template v-for="(veeInput, index) in allVeeInputs" :key="index">
      <q-item>
        <q-item-section>
          <vee-input
            :name="veeInput.name"
            :maxlength="veeInput.maxlength"
            counter
            stack-label
            :label="$t(veeInput.label)"
            :input-type="veeInput.inputType"
          />
        </q-item-section>
      </q-item>
    </template>

    <q-item v-if="isStaffCreate">
      <q-item-section>
        <vee-input
          name="password"
          :label="$t('staff.columns.password')"
          maxlength="25"
          counter
          stack-label
        />
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section>
        <drop-down
          :options="roleCodeDropdown"
          name="roleCode"
          :label="$t('staff.columns.roleCode')"
        />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  // Vue Import
  import { inject, Ref, ref } from "vue";

  // .ts files
  import { StaffRole } from "@/interfaces/staffRole";

  // Custom Components
  import DropDown from "@/components/vee-validate/drop-down.vue";
  import VeeInput from "@/components/vee-validate/vee-input.vue";
  import { StaffDatatable } from "@/interfaces/datatable/staff-datatable";

  const roles = inject("staffRoles") as Ref<StaffRole[]>;
  const isStaffCreate = inject("isStaffCreate") as Ref<boolean>;

  const staffData = inject("staffData") as Ref<StaffDatatable>;

  const staffRoles = ref(roles.value || []);
  const roleCodeDropdown = ref();

  staffRoles.value.sort((a, b) => a.roleCode.localeCompare(b.roleCode));

  roleCodeDropdown.value = roles.value.map(group => {
    return { value: group.roleCode, label: group.roleCode };
  });

  const allVeeInputs = ref([
    { name: "staffAlias", label: "staff.columns.staffAlias", maxlength: 25 },
    { name: "metaStaffAliasHk", label: "staff.columns.staffAliasHk", maxlength: 16 },
    { name: "metaStaffAliasCn", label: "staff.columns.staffAliasCn", maxlength: 16 },
    { name: "firstName", label: "staff.columns.firstName", maxlength: 25 },
    { name: "lastName", label: "staff.columns.lastName", maxlength: 25 },
    {
      name: "email",
      label: isStaffCreate ? "staff.emailInputTitle" : "staff.columns.email",
      maxlength: 25,
      inputType: "email"
    }
  ]);
</script>
