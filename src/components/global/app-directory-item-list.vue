<template>
  <q-list padding class="q-pa-md">
    <q-item
      clickable
      v-for="item in directoryItems"
      :key="item.businessId"
      @click="handleItemClick(item)"
      class="shadow-1 q-pa-sm q-mb-md"
    >
      <q-item-section avatar>
        <q-avatar size="64px" square>
          <q-img ratio="1" :src="computePath(item.iconPath)">
            <template v-slot:error>
              <div class="absolute-full flex flex-center bg-negative text-white">
                Cannot load image
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

      <q-item-section side>
        <q-icon
          v-if="isFavoriteItem(item.businessId)"
          name="favorite"
          size="2em"
          color="red"
          class="favorite-icon"
        />
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  import { BLOB_URL } from "@/constants";
  import { Business } from "@/interfaces/models/entities/business";

  const emit = defineEmits(["item-click"]);

  const props = defineProps({
    directoryItems: {
      type: Array as PropType<Business[]>,
      required: true
    },
    favoriteItems: {
      type: Array,
      default: () => []
    }
  });

  const { translate } = useUtilities();

  const computePath = (path: string) => {
    return path ? `${BLOB_URL}/${path}` : "/no_image_available.jpeg";
  };

  const isFavoriteItem = (businessId: string | number): boolean => {
    return props.favoriteItems.some((item: any) => item.directoryId === businessId);
  };

  function handleItemClick(item: Business) {
    emit("item-click", item);
  }
</script>
