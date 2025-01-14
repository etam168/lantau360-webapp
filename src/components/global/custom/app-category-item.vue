<template>
  <q-item clickable @click="$emit('click')" :style="$q.screen.lt.sm ? 'max-width: 390px' : ''">
    <q-item-section avatar>
      <app-avatar-rounded :image-path="imagePath" size="54px" />
    </q-item-section>

    <q-item-section>
      <q-item-label lines="1">{{ line1 }}</q-item-label>
      <q-item-label caption lines="2">{{ line2 }}</q-item-label>
    </q-item-section>

    <q-item-section side>
      <div class="q-col-gutter-sm" style="min-height: 32px">
        <q-icon :name="fasLocationDot" color="primary" size="xs" v-if="isCheckedIn" />
        <q-icon :name="fasHeart" color="red" size="xs" v-if="isFavorite" />
      </div>

      <q-item-label caption>{{ distance }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
  import { fasHeart, fasLocationDot } from "@quasar/extras/fontawesome-v6";

  const {
    imagePath,
    line1,
    line2,
    isCheckedIn,
    isFavorite,
    distance = ""
  } = defineProps<{
    imagePath: string;
    line1: string;
    line2: string;
    isCheckedIn: boolean;
    isFavorite: boolean;
    distance?: string;
  }>();

  defineEmits<{
    (e: "click"): void;
  }>();
</script>
