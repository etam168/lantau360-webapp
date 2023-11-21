<template>
  <q-btn
    v-if="(actionButtons & ActionButton.EDIT) == ActionButton.EDIT"
    v-bind="actionButtonProps"
    color="primary"
    icon="edit"
    @click="handleUpdate"
  >
    <q-tooltip class="bg-dark text-caption shadow-4"> {{ $t("action.editContent") }} </q-tooltip>
  </q-btn>
  <q-btn
    v-if="(actionButtons & ActionButton.GALLERY) == ActionButton.GALLERY"
    v-bind="actionButtonProps"
    color="dark"
    icon="mdi-image-multiple"
    @click="handleGallery"
  >
    <q-tooltip class="bg-dark text-caption shadow-4"> {{ $t("action.editGallery") }} </q-tooltip>
  </q-btn>
</template>

<script setup lang="ts">
  // Vue Import
  import { ref } from "vue";

  // .ts files
  import { ActionButton } from "@/constants";

  defineProps({
    actionButtons: {
      type: Number,
      default: 1,
      required: false
    }
  });

  const emits = defineEmits<{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (event: "on-update"): void;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (event: "on-gallery"): void;
  }>();

  const actionButtonProps = ref({
    dense: true,
    round: true,
    flat: true
  });

  function handleUpdate() {
    emits("on-update");
  }

  function handleGallery() {
    emits("on-gallery");
  }
</script>
