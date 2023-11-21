<template>
  <q-list dense>
    <template v-for="(directory, index) in directories" :key="index">
      <q-item>
        <q-item-section>
          <vee-input
            :name="directory.name"
            :maxlength="directory.maxlength"
            counter
            stack-label
            :label="$t(directory.label)"
          />
        </q-item-section>
      </q-item>
    </template>

    <q-item v-if="directoryInput.directoryId <= 16">
      <q-item-section>
        <div>{{ directoryInput.directoryId }}</div>
        <q-field
          class="q-pb-xs"
          filled
          readonly
          disable
          name="groupId"
          stack-label
          color="green"
          :label="$t('directory.columns.groupId')"
          style="width: 48.5%"
        >
          <template v-slot:control>
            <div class="self-center full-width no-outline" tabindex="0">
              {{ groupId }}
            </div>
          </template>
        </q-field>
      </q-item-section>
      <q-item-section></q-item-section>
    </q-item>

    <q-item v-else>
      <q-item-section>
        <vee-select
          stack-label
          :options="groupIdOptions"
          name="groupId"
          :label="$t('directory.columns.groupId')"
        />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  // Vue Import
  import { computed, ref } from "vue";

  //import { translateFeatures } from "@/composable/use-search-bar-options";
  // Custom Components
  import VeeInput from "@/components/vee-validate/vee-input.vue";
  import VeeSelect from "@/components/vee-validate/vee-select.vue";
  import { useDirectoryInput } from "./use-directory-input";

  // .ts files
  // import { District } from "@/interfaces/models/entities/district";

  // const districtList = inject<District[]>("districtList");
  // const disrict = ref(districtList || []);
  // const districtDropdown = ref();
  const { directoryInput } = useDirectoryInput();

  const groupIdOptions = ref(["3", "4"]);
  const groupId = computed(() => (directoryInput.value.groupId ?? "").toString());
  const directories = ref([
    { name: "directoryName", label: "directory.columns.directoryName", maxlength: 20 },
    { name: "directoryNameHk", label: "directory.columns.directoryNameHk", maxlength: 16 },
    { name: "directoryNameCn", label: "directory.columns.directoryNameCn", maxlength: 16 },
    { name: "shortName", label: "directory.columns.shortName", maxlength: 20 },
    { name: "shortNameHk", label: "directory.columns.shortNameHk", maxlength: 20 },
    { name: "shortNameCn", label: "directory.columns.shortNameCn", maxlength: 20 }
  ]);

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
