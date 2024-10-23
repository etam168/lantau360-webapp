<template>
  <div>
    <q-btn
      v-bind="$attrs"
      color="primary"
      dense
      flat
      no-caps
      size="12px"
      :ripple="false"
      @click="handleClick"
    >
      <template #default>
        <slot></slot>
      </template>
    </q-btn>
  </div>
</template>

<script setup lang="ts">
  const emit = defineEmits(["click"]);

  function handleClick() {
    emit("click");
  }
</script>
