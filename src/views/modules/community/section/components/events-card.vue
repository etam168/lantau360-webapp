<template>
  <q-card>
    <q-img :ratio="16 / 9" :src="computeImagePath(itemImage)" />

    <q-card-section class="q-pa-sm">
      <app-item dense icon="schedule" :label="eventTime(events)" />
      <app-item dense icon="location_on" :label="events?.subtitle1" />
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
  // Vue Import
  import axios, { AxiosError } from "axios";
  import { GalleryImage } from "@/interfaces/models/entities/image-list";
  import { PropType, onMounted, ref } from "vue";
  import { CommunityEvent } from "@/interfaces/models/entities/communityEvent";
  import { date } from "quasar";

  import { BLOB_URL, PLACEHOLDER_THUMBNAIL, COMMUNITY_EVENT_GALLERY_URL } from "@/constants";

  import AppItem from "@/components/widgets/app-item.vue";

  const props = defineProps({
    events: {
      type: Object as PropType<CommunityEvent>,
      required: true
    }
  });

  const emit = defineEmits(["on-click"]);

  const error = ref<string | null>(null);
  const itemImage = ref();

  const eventTime = (row: CommunityEvent) => {
    // Check if modifiedAt is undefined or null, provide a default value
    const modifiedAt = row.modifiedAt
      ? date.formatDate(row.modifiedAt, "YYYY-MM-DD")
      : date.formatDate(Date.now(), "YYYY-MM-DDT09:00");

    return modifiedAt;
  };

  function onItemClick() {
    emit("on-click", props.events);
  }

  onMounted(() => {
    loadData();
  });

  const loadData = async () => {
    try {
      const [galleryResponse] = await Promise.all([
        axios.get<GalleryImage[]>(
          `${COMMUNITY_EVENT_GALLERY_URL}/${props?.events?.communityEventId}`
        )
      ]);

      itemImage.value = galleryResponse.data[0].imagePath;
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response && err.response.status === 404) {
          error.value = "Not found";
        } else {
          error.value = "An error occurred";
        }
      } else {
        error.value = "An unexpected error occurred";
      }
    }
  };

  function computeImagePath(imagePath: any) {
    return imagePath ? `${BLOB_URL}/${imagePath}` : PLACEHOLDER_THUMBNAIL;
  }
</script>
