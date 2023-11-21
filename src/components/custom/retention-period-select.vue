<template>
  <q-btn-dropdown
    unelevated
    rounded
    outline
    split
    padding="1px"
    style="overflow: hidden; width: 108px"
    dropdown-icon="expand_more"
  >
    <template v-slot:label>
      <div class="text-caption">
        {{ selectedItem }}
      </div>
    </template>

    <q-list>
      <q-item
        v-for="item in options"
        :key="item"
        clickable
        v-close-popup
        @click="onChangeItem(item)"
      >
        <q-item-section>
          <q-item-label>{{ item }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script setup lang="ts">
  // Vue Import
  import { ref } from "vue";

  const props = defineProps({
    selectedOption: { type: String, default: "" },
    isRent: { type: Boolean, default: false }
  });
  const emit = defineEmits(["on-update"]);
  const selectedItem = ref<string>(props.selectedOption);

  const options = ["1 month", "3 month", "6 months"];

  const onChangeItem = (val: string) => {
    selectedItem.value = val;
    emit("on-update", selectedItem.value, props.isRent);
  };
</script>
