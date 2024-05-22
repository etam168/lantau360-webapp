<template>
  <q-item-section avatar>
    <q-avatar size="64px" square>
      <q-img ratio="1" :src="getImageURL(item.iconPath)">
        <template v-slot:error>
          <div class="absolute-full flex flex-center bg-negative text-white">
            {{ $t("errors.cannotLoadImage") }}
          </div>
        </template>
      </q-img>
    </q-avatar>
  </q-item-section>
  <q-item-section>
    <q-item-label>
      {{ translate(item.title, item.meta, "title") }}
    </q-item-label>
    <q-item-label>
      {{ translate(item.subtitle1, item.meta, "subtitle1") }}
    </q-item-label>
  </q-item-section>
</template>
<script setup lang="ts">
  import { CategoryTypes } from "@/interfaces/types/category-types";

  defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });

  const { getImageURL, translate } = useUtilities();
</script>
