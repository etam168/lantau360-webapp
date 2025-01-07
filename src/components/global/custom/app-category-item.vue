<template>
  <q-item clickable @click="$emit('click')" style="max-width: 390px">
    <q-item-section avatar>
      <app-avatar-rounded :image-path="imagePath" size="54px" />
    </q-item-section>

    <q-item-section>
      <q-item-label lines="1">{{ line1 }}</q-item-label>
      <q-item-label caption lines="2">{{ line2 }}</q-item-label>
    </q-item-section>

    <q-item-section side>
      <div class="q-gutter-sm">
        <q-icon
          :name="fasLocationDot"
          color="primary"
          size="xs"
          v-if="isCheckedIn && pageName !== 'FAVOURITE'"
        />
        <q-icon :name="fasHeart" color="red" size="xs" v-if="isFavorite" />
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
  import { fasHeart, fasLocationDot } from "@quasar/extras/fontawesome-v6";

  // Props
  const { imagePath, line1, line2, isCheckedIn, isFavorite } = defineProps<{
    imagePath: string;
    line1: string;
    line2: string;
    isCheckedIn: boolean;
    isFavorite: boolean;
    pageName?: string;
  }>();

  defineEmits<{
    (e: "click"): void;
  }>();
</script>
