<template>
  <q-toolbar class="q-gutter-x-md">
    <q-space />

    <q-toggle
      v-show="isNthBitSet(buttonOption, 4)"
      v-model="isExactMatch"
      checked-icon="check"
      color="green"
      unchecked-icon="clear"
      class="text-caption"
      :label="$t('action.read')"
      @update:model-value="$emit('on-listingmodechange', isExactMatch)"
    />

    <div v-show="isNthBitSet(buttonOption, 3)" style="display: flex">
      <q-btn
        v-show="isNthBitSet(buttonOption, 1)"
        flat
        color="primary"
        @click="$emit('on-advance-search')"
      >
        {{ $t("toolbar.search") }}
        <q-tooltip class="bg-dark text-caption shadow-4">{{
          $t("toolbar.searchTooltip")
        }}</q-tooltip>
      </q-btn>

      <q-btn
        v-show="isNthBitSet(buttonOption, 1)"
        :disable="!isNthBitSet(buttonOption, 2)"
        flat
        color="primary"
        @click="$emit('on-agent-update')"
      >
        {{ $t("toolbar.updateAgent") }}
        <q-tooltip class="bg-dark text-caption shadow-4">{{
          $t("toolbar.updateAgentTooltip")
        }}</q-tooltip>
      </q-btn>
      <q-btn
        v-show="isNthBitSet(buttonOption, 1)"
        :disable="!isNthBitSet(buttonOption, 2)"
        flat
        round
        color="primary"
        icon="fa-brands fa-whatsapp"
        @click="$emit('on-whatsapp-recommend')"
      >
        <q-tooltip class="bg-dark text-caption shadow-4">{{
          $t("toolbar.recommendProperty")
        }}</q-tooltip>
      </q-btn>
      <q-btn :disable="!isNthBitSet(buttonOption, 2)" flat round color="primary" icon="archive">
        <q-tooltip class="bg-dark text-caption shadow-4">
          {{ btnArchiveTooltip }}
        </q-tooltip>
      </q-btn>
    </div>

    <q-btn flat round color="primary" icon="mdi-refresh" @click="$emit('on-refresh')">
      <q-tooltip class="bg-dark text-caption shadow-4">{{ $t("action.refresh") }}</q-tooltip>
    </q-btn>

    <q-btn
      v-show="isNthBitSet(buttonOption, 1)"
      flat
      round
      color="primary"
      icon="mdi-plus"
      @click="$emit('on-create')"
    >
      <q-tooltip class="bg-dark text-caption shadow-4">{{ $t(tipTextCreate) }}</q-tooltip>
    </q-btn>
  </q-toolbar>
</template>

<script setup lang="ts">
  // Vue Import
  import { computed, ref } from "vue";

  // .ts files
  import { useUtilities } from "@/composable/use-utilities";

  // 3rd party plugins
  import i18n from "@/plugins/i18n/i18n";

  const { isNthBitSet } = useUtilities();
  const { t } = i18n.global;

  const props = defineProps({
    toolTipCreate: String,
    buttonOption: {
      type: Number,
      default: 1,
      required: false
    }
  });

  const isExactMatch = ref(false);

  const btnArchiveTooltip = computed(() => {
    return isNthBitSet(props.buttonOption, 1)
      ? t("toolbar.archiveProperty")
      : t("toolbar.removeFromArchive");
  });

  defineEmits(["on-create", "on-refresh", "on-listingmodechange", "on-advance-search"]);

  const tipTextCreate = ref(props.toolTipCreate || "");
</script>
