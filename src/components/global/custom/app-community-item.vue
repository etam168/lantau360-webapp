<template>
  <q-item clickable :style="$q.screen.lt.sm ? 'max-width: 390px' : ''">
    <q-item-section avatar>
      <app-avatar-rounded :image-path="imagePath" size="54px" />
    </q-item-section>

    <q-item-section>
      <q-item-label lines="1">{{ line1 }}</q-item-label>
      <q-item-label caption lines="2">{{ line2 }}</q-item-label>
    </q-item-section>

    <q-item-section side>
      <q-btn flat round dense :icon="fasEllipsisVertical" class="custom-btn">
        <q-menu self="top right">
          <q-list>
            <q-item
              v-for="item in menuItems"
              :key="item.value"
              :clickable="!item.disabled"
              @click="handleMenuAction(item)"
              v-close-popup
            >
              <q-item-section>
                <q-item-label>{{ item.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </q-item-section>
  </q-item>
</template>
<script setup lang="ts">
  import { fasEllipsisVertical } from "@quasar/extras/fontawesome-v6";
  import { computed } from "vue";

  // Props
  const {
    imagePath,
    line1,
    line2,
    allowEdit = false // Controls whether the "Edit" option is enabled
  } = defineProps<{
    imagePath: string;
    line1: string;
    line2: string;
    allowEdit?: boolean;
  }>();

  // Emits
  const emit = defineEmits(["on-detail", "on-edit"]);

  // Menu Items
  const menuItems = computed(() => [
    { value: "detail", label: "Detail", disabled: false },
    { value: "edit", label: "Edit", disabled: !allowEdit }
  ]);

  // Handle Menu Action
  const handleMenuAction = (menuItem: { value: string }) => {
    if (menuItem.value === "detail") {
      emit("on-detail");
    } else if (menuItem.value === "edit") {
      emit("on-edit");
    }
  };
</script>
