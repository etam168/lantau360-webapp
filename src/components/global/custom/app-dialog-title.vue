<template>
  <q-card-actions align="center" class="q-pa-none">
    <q-toolbar class="bg-white shadow-1" style="max-width: 1024px">
      <q-btn dense flat round :icon="fasArrowLeft" v-close-popup @click="emitCloseEvent" />

      <q-toolbar-title class="text-center text-weight-medium">
        <slot></slot>
        <!-- Default slot for content -->
      </q-toolbar-title>

      <q-btn v-if="hasOptions" flat round :icon="fasEllipsisVertical">
        <q-menu self="top right">
          <q-list>
            <q-item clickable @click="handleSort(menuItems.DEFAULT)" v-close-popup>
              <q-item-section>
                <q-item-label>{{ menuItems.DEFAULT.label }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable @click="handleSort(menuItems.DISTANCE)" v-close-popup>
              <q-item-section>
                <q-item-label>{{ menuItems.DISTANCE.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-toolbar>
  </q-card-actions>
</template>

<script setup lang="ts">
  import { fasArrowLeft, fasEllipsisVertical } from "@quasar/extras/fontawesome-v6";
  import { defineEmits, ref } from "vue";

  interface MenuItem {
    value: string;
    label: string;
  }

  const menuItems = {
    DEFAULT: {
      value: "default",
      label: "Sort by Default"
    },
    DISTANCE: {
      value: "distance",
      label: "Sort by Distance"
    }
  } as const;

  const emit = defineEmits(["dialogClosed", "change:sortOption"]);

  // Props
  const { hasOptions = false } = defineProps<{
    hasOptions?: boolean;
  }>();

  const selectedSort = ref<MenuItem>(menuItems.DEFAULT);

  const emitCloseEvent = () => {
    emit("dialogClosed");
  };

  const handleSort = (menuItem: MenuItem) => {
    selectedSort.value = menuItem;
    emit("change:sortOption", menuItem);
  };
</script>

<style lang="scss" scoped>
  .q-btn .q-focus-helper {
    display: none;
  }
</style>
