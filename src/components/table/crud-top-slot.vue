<template>
  <q-toolbar>
    <q-input
      debounce="300"
      v-model="filter"
      :placeholder="$t('action.search')"
      style="width: 50%"
      @keyup.enter="handleFilter"
      @click:append="handleFilter"
    >
      <template v-slot:append>
        <q-icon name="search" @click="handleFilter" class="cursor-pointer" />
      </template>
    </q-input>
    <q-space />
    <q-btn flat round color="primary" icon="mdi-refresh" @click="$emit('on-refresh')">
      <q-tooltip class="bg-amber text-caption shadow-4"> {{ $t("action.refresh") }} </q-tooltip>
    </q-btn>
    <q-btn
      v-show="((buttonOption >> Math.log2(ButtonOption.CREATE)) & 1) == 1"
      flat
      round
      color="primary"
      icon="mdi-plus"
      @click="$emit('on-create')"
    >
      <q-tooltip class="bg-amber text-caption shadow-4">
        {{ $t(tipTextCreate) }}
      </q-tooltip>
    </q-btn>
  </q-toolbar>
</template>
<script lang="ts">
  import { ButtonOption } from "@/constants";
  import { computed, defineComponent, ref } from "vue";

  export default defineComponent({
    name: "CrudTopSlot",
    props: {
      toolTipCreate: String,

      buttonOption: {
        type: Number,
        default: 1,
        required: false
      },

      noCreateButton: {
        type: Boolean,
        default: true
      }
    },

    emits: ["on-create", "on-refresh", "on-search"],

    // https://dev.to/onurelibol/creating-custom-components-with-vuetify-inheriting-props-events-slots-in-composition-api-56ef?utm_source=dormosheio&utm_campaign=dormosheio
    setup(props, ctx) {
      const parentSlots = computed(() => Object.keys(ctx.slots));
      const filter = ref("");
      const tipTextCreate = ref(props.toolTipCreate);

      function handleFilter() {
        ctx.emit("on-search", filter.value);
      }

      return {
        ButtonOption,

        parentSlots,
        filter,
        tipTextCreate,
        handleFilter
      };
    }
  });
</script>
