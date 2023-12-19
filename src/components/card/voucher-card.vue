<template>
  <q-card class="my-card">
    <q-img :ratio="16 / 9" :src="computeImagePath(item.bannerPath)" />
    <q-card-section class="q-pa-sm">
      <!-- <app-item dense icon="location_on" :label="offers?.businessName" /> -->
    </q-card-section>

    <q-card-actions>
      <q-space />
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
  import { BusinessVoucher } from "@/interfaces/models/entities/business-voucher";
  import { BLOB_URL } from "@/constants";
  import { useQuasar } from "quasar";

  // Assuming AppItem is a component you would use for displaying certain item properties
  // import AppItem from "@/components/widgets/app-item.vue";
  const $q = useQuasar();

  const props = defineProps({
    item: {
      type: Object as PropType<BusinessVoucher>,
      required: true
    }
  });

  // const emit = defineEmits(["xclick"]);

  const onItemClick = () => {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/voucher-detail-dialog.vue")
      ),
      componentProps: {
        query: { businessVoucherId: props.item.businessVoucherId }
      }
    });
  };

  function computeImagePath(imagePath: string | null): string {
    return imagePath ? `${BLOB_URL}/${imagePath}` : "/no_image_available.jpeg";
  }
</script>
