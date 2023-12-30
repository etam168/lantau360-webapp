<template>
  <q-card>
    <q-img :ratio="16 / 9" :src="imagePath" />

    <q-card-actions>
      <q-btn
        outline
        dense
        color="primary"
        label="More Details"
        class="full-width"
        @click="onItemClick"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
  import { BulletinTypes } from "@/interfaces/types/bulletin-types";
  import { BLOB_URL } from "@/constants";

  const props = defineProps({
    item: {
      type: Object as PropType<BulletinTypes>,
      required: true
    }
  });

  const $q = useQuasar();

  const onItemClick = () => {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/bulletin-detail-dialog.vue")
      ),
      componentProps: {
        item: props.item
      }
    });
  };

  const imagePath = computed(() => {
    return props.item.bannerPath
      ? `${BLOB_URL}/${props.item.bannerPath}`
      : "/no_image_available.jpeg";
  });
</script>
