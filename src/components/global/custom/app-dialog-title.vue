<template>
  <q-toolbar class="bg-white shadow-1" style="max-width: 1024px">
    <q-btn
      class="custom-btn"
      dense
      flat
      round
      :icon="fasArrowLeft"
      v-close-popup
      @click="emitCloseEvent"
    />

    <q-toolbar-title class="text-center text-weight-medium">
      <slot></slot>
      <!-- Default slot for content -->
    </q-toolbar-title>

    <q-btn v-if="hasOptions" class="custom-btn" flat round :icon="fasEllipsisVertical">
      <q-menu self="top right">
        <q-list>
          <q-item
            v-for="item in menuItems"
            :key="item.value"
            clickable
            @click="handleSort(item)"
            v-close-popup
          >
            <q-item-section>
              <q-item-label>{{ item.label }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </q-btn>
    <q-btn v-else class="invisible" />
  </q-toolbar>
</template>

<script setup lang="ts">
  import { fasArrowLeft, fasEllipsisVertical } from "@quasar/extras/fontawesome-v6";

  interface MenuItem {
    value: string;
    label: string;
  }

  const { t } = useI18n({ useScope: "global" });

  const menuItems = computed<MenuItem[]>(() => [
    {
      value: "default",
      label: t("sort.default")
    },
    {
      value: "distance",
      label: t("sort.distance")
    }
  ]);

  const emit = defineEmits(["dialogClosed", "change:sortOption"]);

  // Props
  const { hasOptions = false } = defineProps<{
    hasOptions?: boolean;
  }>();

  const emitCloseEvent = () => {
    emit("dialogClosed");
  };

  const handleSort = (menuItem: MenuItem) => {
    emit("change:sortOption", menuItem.value);
  };
</script>

<style lang="scss" scoped>
  .custom-btn {
    :deep(.q-btn--flat:before) {
      display: none;
    }

    :deep(.q-focus-helper) {
      display: none !important;
    }

    &:hover {
      background: transparent !important;
    }
  }
</style>
