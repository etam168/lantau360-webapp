<template>
  <q-card>
    <q-img :ratio="16 / 9" :src="computeImagePath(itemImage)" />

    <q-card-section class="q-pa-sm">
      <q-item dense class="q-py-none">
        <q-item-section thumbnail class="q-pr-sm">
          <q-icon color="green" name="schedule" size="xs" />
        </q-item-section>

        <q-item-section>
          <q-item-label style="font-family: Baloo; font-size: 1rem">{{
            eventTime(events)
          }}</q-item-label>
        </q-item-section>
      </q-item>

      <q-item dense class="q-py-none">
        <q-item-section thumbnail class="q-pr-sm">
          <q-icon color="green" name="location_on" size="xs" />
        </q-item-section>

        <q-item-section>
          <q-item-label style="font-family: Baloo; font-size: 1rem">{{
            events?.subtitle1
          }}</q-item-label>
        </q-item-section>
      </q-item>
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
  import { CommunityEvent } from "@/interfaces/models/entities/community-event";
  import { date } from "quasar";

  import { BLOB_URL, COMMUNITY_EVENT_GALLERY_URL } from "@/constants";

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
    return imagePath ? `${BLOB_URL}/${imagePath}` : "/no_image_available.jpeg";
  }
</script>
