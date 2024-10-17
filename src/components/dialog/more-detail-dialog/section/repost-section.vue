<template>
  <q-card>
    <q-card-section>
      <q-item class="q-pa-none">
        <div class="text-h5 q-mt-sm q-mb-xs">{{ moreData.title }}</div>
        <q-space />
        <q-btn @click="handleRepostDialog" v-if="moreData.isPostExpired" outline color="red"
          >Repost</q-btn
        >
      </q-item>
      <div class="text-caption text-grey">
        {{ moreData.postingDescription }}
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  // Emits
  const emit = defineEmits(["on-repost"]);

  // Props
  const { moreData } = defineProps<{
    moreData: any;
  }>();

  const handleRepostDialog = (newValue: any) => {
    emit("on-repost", newValue);
  };
</script>
