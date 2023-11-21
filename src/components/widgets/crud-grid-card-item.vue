<template>
  <q-item dense>
    <q-item-section avatar>
      <q-avatar color="grey-2" text-color="grey-9" :icon="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ label }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>

  <q-separator v-if="seperator" inset="item" spaced />
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
      caption: {
        type: String
      },
      label: {
        type: String,
        required: true
      },
      seperator: {
        type: Boolean,
        default: true
      }
    }
  });
</script>
