<template>
  <q-item dense class="q-py-none">
    <q-item-section thumbnail class="q-pr-sm">
      <q-icon color="green" :name="icon" size="xs" />
    </q-item-section>

    <q-item-section>
      <q-item-label style="font-family: Baloo; font-size: 1rem">{{ label }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  export default defineComponent({
    name: "CrudGridCardItem",

    props: {
      icon: {
        type: String,
        required: true
      },
      label: {
        type: String,
        required: true
      }
    }
  });
</script>
