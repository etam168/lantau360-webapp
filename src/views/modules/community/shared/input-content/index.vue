<template>
  <q-list v-for="field in veeInputsFields" :key="field.name">
    <q-item>
      <q-item-section>
        <vee-input
          :name="field.name"
          :label="$t(field.label)"
          :type="field.type"
          class="q-pb-none"
        />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  const veeInputsFields = ref([
    { name: "title", label: "posting.columns.title", maxlength: 50, type: null },
    { name: "description", label: "posting.columns.description", maxlength: 300, type: "textarea" }
  ]);
</script>
