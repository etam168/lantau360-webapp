<template>
  <q-input
    v-model="searchKey"
    :placeholder="$t('action.search')"
    dense
    borderless
    @keyup.enter="onIconClick"
    :style="[$q.screen.gt.sm ? 'width: 35%' : 'width: 50%']"
  >
    <template v-slot:append>
      <q-icon name="search" color="gray" @click="onIconClick" />
    </template>
  </q-input>
</template>

<script setup lang="ts">
  // Vue Import
  import { ref } from "vue";
  const emit = defineEmits(["change"]);

  const searchKey = ref("");

  function onIconClick() {
    emit("change", searchKey);
  }
</script>
