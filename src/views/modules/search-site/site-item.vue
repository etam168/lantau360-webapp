<template>
  <q-item clickable @click="handleDetail">
    <q-item-section avatar>
      <q-avatar size="64px" square>
        <q-img :src="computePath(row.iconPath)" />
      </q-avatar>
    </q-item-section>

    <q-item-section class="q-ml-lg">
      <q-item-label>
        {{ translate(row.title, row.meta, "title") }}
      </q-item-label>

      <q-item-label>
        {{ translate(row.subtitle1, row.meta, "subtitle1") }}
      </q-item-label>
    </q-item-section>

    <q-item-section side>
      <q-icon name="favorite" size="2em" color="red" />
      <!-- <q-item-label>distance in km</q-item-label> -->
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
  import { BLOB_URL } from "@/constants";
  import { Site } from "@/interfaces/site";
  import { PropType } from "vue";
  import { useUtilities } from "@/composable/use-utilities";

  const emits = defineEmits(["on-detail"]);

  const computePath = (path: string) => {
    return `${BLOB_URL}/${path}`;
  };

  const { translate } = useUtilities();

  defineProps({
    row: {
      type: Object as PropType<Site>,
      required: true
    }
  });

  function handleDetail() {
    emits("on-detail");
  }
</script>
