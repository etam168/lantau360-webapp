<template>
  <q-card>
    <q-img :ratio="16 / 9" :src="computeImagePath(itemImage)" />

    <q-card-section class="q-pa-sm">
      <!-- <app-item dense icon="schedule" :label="eventTime(offers)" />
      <app-item dense icon="location_on" :label="offers?.subtitle1" /> -->
    </q-card-section>

    <q-card-actions>
      <q-btn
        outline
        dense
        color="primary"
        label="More Details"
        class="full-width"
        @click="onItemClick()"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
  import axios from "axios";
  import { CommunityEvent } from "@/interfaces/models/entities/community-event";
  import { GalleryImage } from "@/interfaces/models/entities/image-list";
  import { BLOB_URL, COMMUNITY_EVENT_GALLERY_URL } from "@/constants";

  const props = defineProps({
    item: {
      type: Object as PropType<CommunityEvent>,
      required: true
    }
  });

  //const emit = defineEmits(["xclick"]);

  const error = ref<string | null>(null);
  const itemImage = ref<string | null>(null);

  const onItemClick = () => {
    // Assuming `item` is the data you want to emit with the event
    // emit("xclick", props.item);
  };

  onMounted(() => {
    loadData();
  });

  const loadData = async () => {
    try {
      const galleryResponse = await axios.get<GalleryImage[]>(
        `${COMMUNITY_EVENT_GALLERY_URL}/${props.item.communityEventId}`
      );

      itemImage.value = galleryResponse.data.length > 0 ? galleryResponse.data[0].imagePath : null;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        error.value = err.response?.status === 404 ? "Not found" : "An error occurred";
      } else {
        error.value = "An unexpected error occurred";
      }
    }
  };

  function computeImagePath(imagePath: string | null) {
    return imagePath ? `${BLOB_URL}/${imagePath}` : "/no_image_available.jpeg";
  }
</script>
