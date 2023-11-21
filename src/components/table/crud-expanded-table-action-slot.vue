<template>
  <q-btn
    v-if="(actionButtons & ActionButton.EDIT) == ActionButton.EDIT"
    v-bind="actionButtonProps"
    color="green"
    icon="edit"
    @click="handleUpdate"
  >
    <q-tooltip class="bg-amber text-caption shadow-4"> {{ $t("action.editContent") }} </q-tooltip>
  </q-btn>
  <q-btn
    v-if="(actionButtons & ActionButton.GALLERY) == ActionButton.GALLERY"
    v-bind="actionButtonProps"
    color="amber"
    icon="mdi-image-multiple"
    @click="handleGallery"
  >
    <q-tooltip class="bg-amber text-caption shadow-4"> {{ $t("action.editGallery") }} </q-tooltip>
  </q-btn>
  <q-btn
    v-if="(actionButtons & ActionButton.DETAIL) == ActionButton.DETAIL"
    v-bind="actionButtonProps"
    color="dark"
    icon="menu_book"
    @click="handleDetail"
  >
    <q-tooltip class="bg-amber text-caption shadow-4"> {{ $t("action.viewDetail") }} </q-tooltip>
  </q-btn>
</template>

<script lang="ts">
  import { defineComponent, ref } from "vue";
  import { ActionButton } from "@/constants";

  export default defineComponent({
    name: "CrudExpandedTableActionSlot",

    props: {
      actionButtons: {
        type: Number,
        default: 1,
        required: false
      }
    },

    emits: ["on-update", "on-gallery", "on-detail"],

    setup(_, { emit }) {
      const actionButtonProps = ref({
        dense: true,
        round: true,
        flat: true
      });

      function handleUpdate() {
        emit("on-update");
      }

      function handleGallery() {
        emit("on-gallery");
      }

      function handleDetail() {
        emit("on-detail");
      }

      return {
        actionButtonProps,

        ActionButton,
        handleUpdate,
        handleGallery,
        handleDetail
      };
    }
  });
</script>
