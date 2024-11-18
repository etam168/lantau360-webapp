<template>
  <q-btn v-bind="$attrs" color="primary">
    <div class="row items-center">
      <q-circular-progress
        show-value
        class="q-mr-sm"
        :value="progress"
        size="24px"
        :thickness="0.2"
        color="white"
        track-color="white-4"
      >
        <div class="text-caption absolute-center text-white">{{ remainingSeconds }}</div>
      </q-circular-progress>
      <span>{{ label }}</span>
    </div>
  </q-btn>
</template>

<script setup lang="ts">
  import { useInterval } from "@vueuse/core";

  const { duration = 10000, label } = defineProps<{
    duration?: number;
    label?: string;
  }>();

  const emit = defineEmits(["timeout-expired"]);
  const progress = ref(0);
  const remainingSeconds = computed(() =>
    Math.ceil((duration - (progress.value / 100) * duration) / 1000)
  );

  const startTime = Date.now();
  const { pause } = useInterval(100, {
    controls: true,
    callback: () => {
      const elapsed = Date.now() - startTime;
      progress.value = Math.min((elapsed / duration) * 100, 100);

      if (elapsed >= duration) {
        pause();
        emit("timeout-expired");
      }
    },
    immediate: true
  });
</script>
