<template>
  <q-list>
    <q-item
      clickable
      v-for="item in directoryItems"
      :key="item.directoryId"
      @click="handleItemClick(item)"
      class="shadow-1 q-pa-sm q-mb-md"
    >
      <q-item-section v-if="item.postingId" avatar>
        <q-avatar size="64px">
          <q-img ratio="1" :src="memberImage">
            <template v-slot:error>
              <div class="absolute-full flex flex-center bg-negative text-white">
                Cannot load image
              </div>
            </template>
          </q-img>
        </q-avatar>
      </q-item-section>

      <q-item-section avatar v-else>
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

      <q-item-section v-if="template === 'Timetable'">
        <q-item-label>
          {{ translate(item.siteName, item.meta, "siteName") }}
        </q-item-label>

        <q-item-label>
          {{ translate(item.title, item.meta, "title") }}
        </q-item-label>
      </q-item-section>

      <q-item-section v-else-if="template === 'Lantau Taxi'">
        <q-item-label>
          {{ translate(item.siteName, item.meta, "siteName") }}
        </q-item-label>

        <q-item-label>
          {{ translate(item.title, item.meta, "title") }}
        </q-item-label>
      </q-item-section>

      <q-item-section v-else>
        <q-item-label>
          {{ translate(item.title, item.meta, "title") }}
        </q-item-label>

        <q-item-label>
          {{ translate(item.subtitle1, item.meta, "subtitle1") }}
        </q-item-label>
      </q-item-section>

      <q-item-section side>
        <q-icon
          v-if="isFavoriteItem(item)"
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
  import { Site } from "@/interfaces/models/entities/site";
  import { URL } from "@/constants";

  const emit = defineEmits(["item-click"]);
  import { CategoryTypes } from "@/interfaces/types/category-types";

  const props = defineProps({
    directoryItems: {
      type: Array as PropType<CategoryTypes[]>,
      required: true,
      default: () => []
    },
    favoriteItems: {
      type: Array as PropType<CategoryTypes[]>,
      default: () => []
    },
    template: {
      type: String,
      required: false
    }
  });

  const { translate } = useUtilities();

  const memberImage = ref();

  const computePath = (path: string) => {
    return path ? `${BLOB_URL}/${path}` : "/no_image_available.jpeg";
  };

  const isFavoriteItem = (item: CategoryTypes): boolean => {
    switch (true) {
      case "businessId" in item:
        return props.favoriteItems.some(
          favItem => (favItem as Business).businessId === item.businessId
        );
      case "siteId" in item:
        return props.favoriteItems.some(favItem => (favItem as Site).siteId === item.siteId);
      default:
        // No known type matched, or it's not a favorite item
        return false;
    }
  };

  function handleItemClick(item: CategoryTypes) {
    emit("item-click", item);
  }

  const fetchMemberImage = async (memberId: number) => {
    try {
      if (!memberId) {
        throw new Error(`Invalid memberId: ${memberId}`);
      }

      const apiUrl = `${URL.MEMBER_IMAGE_URL}/${memberId}`;

      const response = await axios.get(apiUrl);

      if (response.status !== 200) {
        throw new Error(`Error fetching member image for member ID ${memberId}`);
      }

      memberImage.value = response.data;
      return memberImage.value;
    } catch (error) {
      return error;
    }
  };

  onMounted(async () => {
    for (const item of props.directoryItems) {
      await fetchMemberImage(item?.memberId);
    }
  });
</script>
