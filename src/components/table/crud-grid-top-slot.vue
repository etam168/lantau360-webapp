<template>
  <q-toolbar>
    <q-space />
    <q-btn flat round color="primary" icon="mdi-refresh" @click="$emit('on-refresh')">
      <q-tooltip class="bg-amber text-caption shadow-4"> {{ $t("action.refresh") }} </q-tooltip>
    </q-btn>

    <q-btn
      v-if="((buttonOption >> Math.log2(ButtonOption.CREATE)) & 1) == 1"
      flat
      round
      color="primary"
      icon="attachment"
      @click="$emit('on-create')"
    >
      <q-tooltip class="bg-amber text-caption shadow-4"> {{ $t(tipTextCreate) }} </q-tooltip>
    </q-btn>

    <q-btn
      v-if="((buttonOption >> Math.log2(ButtonOption.EXCEL)) & 1) == 1"
      flat
      round
      color="green"
      icon="mdi-file-excel"
      @click="$emit('on-export')"
    >
      <q-tooltip class="bg-amber text-caption shadow-4"> {{ $t("action.export") }} </q-tooltip>
    </q-btn>
  </q-toolbar>
</template>
<script lang="ts">
  import { ButtonOption } from "@/constants";
  import { computed, defineComponent, ref } from "vue";

  export default defineComponent({
    name: "CrudGridTopSlot",
    props: {
      toolTipCreate: String,
      toolTipExport: String,
      toolTipRefresh: String,
      columns: Array,

      buttonOption: {
        type: Number,
        default: 1,
        required: false
      }
    },

    emits: ["on-create", "on-refresh", "on-search", "on-sort", "on-order", "on-export"],

    // https://dev.to/onurelibol/creating-custom-components-with-vuetify-inheriting-props-events-slots-in-composition-api-56ef?utm_source=dormosheio&utm_campaign=dormosheio
    setup(props, ctx) {
      const parentSlots = computed(() => Object.keys(ctx.slots));

      const tipTextCreate = ref(props.toolTipCreate);

      function handleRefresh() {
        ctx.emit("on-refresh");
      }

      return {
        tipTextCreate,
        parentSlots,
        ButtonOption,

        handleRefresh
      };
    }
  });
</script>
