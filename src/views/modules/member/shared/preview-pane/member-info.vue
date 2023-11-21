<template>
  <q-list dense bordered class="full-height q-py-md">
    <!-- Member Name -->
    <q-toolbar>
      <q-toolbar-title class="text-subtitle1">Member</q-toolbar-title>
    </q-toolbar>

    <q-item v-for="(name, index) in names" :key="index" dense>
      <q-item-section side>
        <q-avatar size="sm" color="primary" text-color="white">{{ name.avatar }}</q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label lines="1">
          {{ name.text }}
        </q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  import { Ref, computed, inject } from "vue";

  //.ts files
  import { MemberDatatable } from "@/interfaces/datatable/member-datatable";
  import { useUtilities } from "@/composable/use-utilities";

  const { translateAltName } = useUtilities();

  //Injected data
  const previewMember = inject("previewMember") as Ref<MemberDatatable>;

  const names = computed(() => [
    { text: previewMember.value.firstName, avatar: "En" },
    {
      text: translateAltName("hk", previewMember.value.meta, "firstName"),
      avatar: "繁"
    },
    {
      text: translateAltName("cn", previewMember.value.meta, "firstName"),
      avatar: "简"
    }
  ]);
</script>
