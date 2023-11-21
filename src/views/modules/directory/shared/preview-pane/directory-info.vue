<template>
  <q-list dense bordered class="full-height q-py-md">
    <!-- Directory Name -->
    <q-toolbar>
      <q-toolbar-title class="text-subtitle1">Directory</q-toolbar-title>
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
  import { DirectoryDatatable } from "@/interfaces/datatable/directory-datatable";
  import { useUtilities } from "@/composable/use-utilities";

  const { translateAltName } = useUtilities();

  //Injected data
  const previewDirectory = inject("previewDirectory") as Ref<DirectoryDatatable>;

  const names = computed(() => [
    { text: previewDirectory.value.directoryName, avatar: "En" },
    {
      text: translateAltName("hk", previewDirectory.value.meta, "directoryName"),
      avatar: "繁"
    },
    {
      text: translateAltName("cn", previewDirectory.value.meta, "directoryName"),
      avatar: "简"
    }
  ]);
</script>
