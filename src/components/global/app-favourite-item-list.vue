<template>
  <!-- <pre>{{ groupedArray }}</pre> -->
  <div class="q-pa-md">
    <div v-for="group in groupedArray" :key="group.group" class="q-mb-md">
      <div class="text-h6">{{ group.group }}</div>

      <q-list padding>
        <q-item
          clickable
          v-for="item in group.items"
          :key="item.directoryId"
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
            <q-icon name="favorite" size="2em" color="red" class="favorite-icon" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { BLOB_URL } from "@/constants";
  import { Business } from "@/interfaces/models/entities/business";
  import { Site } from "@/interfaces/models/entities/site";

  const emit = defineEmits(["item-click"]);
  type DirectoryTypes = Business | Site;

  const props = defineProps({
    favoriteItems: {
      type: Array as PropType<DirectoryTypes[]>,
      default: () => [] as DirectoryTypes[]
    }
  });

  const { groupBy, translate } = useUtilities();

  const computePath = (path: string) => {
    return path ? `${BLOB_URL}/${path}` : "/no_image_available.jpeg";
  };

  const groupedArray = computed(() => {
    return groupBy(props.favoriteItems, item => item.directoryName);
  });

  function handleItemClick(item: DirectoryTypes) {
    emit("item-click", item);
  }
</script>
