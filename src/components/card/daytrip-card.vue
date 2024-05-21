<template>
  <q-card
    clickable
    v-for="item in directoryItems"
    :key="item.directoryId"
    @click="handleItemClick(item)"
    class="my-card"
    :style="$q.screen.gt.xs ? 'width: 300px' : ''"
  >
    <q-img :ratio="16 / 9" :src="getImageURL(item.iconPath)">
      <template v-slot:error>
        <div class="absolute-full flex flex-center bg-negative text-white">
          {{ $t("errors.cannotLoadImage") }}
        </div>
      </template>
    </q-img>

    <q-card-section>
      <q-list>
        <q-item class="q-pa-none">
          <q-item-section>
            <q-item-label overline>{{ translate(item.title, item.meta, "title") }}</q-item-label>
            <q-item-label caption>Estimated Time: 2-3 hrs</q-item-label>
            <q-separator spaced />
            <q-item-label lines="2"><app-text-editor v-model="item.description" /></q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-icon name="favorite" size="2em" color="red" class="favorite-icon" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  import { CategoryTypes } from "@/interfaces/types/category-types";

  defineProps({
    directoryItems: {
      type: Array as PropType<CategoryTypes[]>,
      required: true,
      default: () => []
    }
  });
  const emit = defineEmits(["item-click"]);

  const { getImageURL, translate } = useUtilities();

  function handleItemClick(item: CategoryTypes) {
    emit("item-click", item);
  }
</script>
