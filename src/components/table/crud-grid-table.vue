<template>
  <q-table grid v-bind="$attrs" :rows-per-page-options="[10, 25, 50, 100]" binary-state-sort>
    <template v-slot:top>
      <component
        :is="CrudGridTopSlot"
        :buttonOption="buttonOption"
        :toolTipCreate="toolTipCreate"
        @on-refresh="handleRefresh"
        @on-create="handleCreate()"
      />
    </template>

    <template v-slot:item="props">
      <component
        :is="CrudGridCard"
        :columns="columns"
        :props="props"
        :row="props.row"
        @on-delete="handleDelete(props.row)"
      />
    </template>
  </q-table>
</template>

<script lang="ts">
  import { computed, defineComponent } from "vue";

  export default defineComponent({
    name: "CrudGridTable",
    inheritAttrs: false,

    props: {
      toolTipCreate: { type: String },
      columns: { type: Array },
      CrudGridCard: { type: Object },
      CrudGridTopSlot: { type: Object },

      buttonOption: {
        type: Number,
        default: 1,
        required: false
      }
    },

    emits: ["on-create", "on-refresh", "on-delete"],

    setup(_, ctx) {
      const parentSlots = computed(() => Object.keys(ctx.slots));
      const noPadding = "q-pa-none";

      function handleCreate() {
        ctx.emit("on-create");
      }

      function handleRefresh() {
        ctx.emit("on-refresh");
      }

      function handleDelete(props: any) {
        ctx.emit("on-delete", props);
      }

      return {
        parentSlots,
        noPadding,
        handleCreate,
        handleRefresh,
        handleDelete
      };
    }
  });
</script>
