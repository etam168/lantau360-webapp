<template>
  <q-card style="width: 360px">
    <!-- <q-card-section class="q-pa-none"> -->
    <app-img
      :ratio="16 / 9"
      :imagelink="`${BASE_IMAGE_URL}/${rowData?.bannerPath}`"
      fit="cover"
      class="cursor-pointer"
    />
    <!-- </q-card-section> -->

    <q-card-section horizontal>
      <q-card-section class="q-pa-sm col-8">
        <q-item-section>
          <q-item-label class="text-subtitle1 text-weight-medium" lines="1">{{
            rowData?.title
          }}</q-item-label>
          <q-item-label caption lines="1">{{ rowData?.address }}</q-item-label>
        </q-item-section>
      </q-card-section>

      <q-card-section class="q-pa-sm col-4">
        <q-item-section>
          <q-item-label class="text-h6 text-warning text-right">{{
            rowData?.askingPrice + " HK$"
          }}</q-item-label>
          <q-item-label caption class="text-warning text-right">{{
            $t("propertyListing.format.area", { sfPrice: rowData?.askingPricePerFoot })
          }}</q-item-label>
        </q-item-section>
      </q-card-section>
    </q-card-section>

    <q-separator />

    <q-card-actions align="left">
      <q-badge class="q-mx-xs q-pa-xs" color="brown-6">
        {{ rowData?.noOfBedRooms }} <q-icon name="fa-solid fa-bed" color="white" class="q-ml-xs" />
      </q-badge>

      <q-badge class="q-mx-xs q-pa-xs" color="brown-6">
        {{ rowData?.bathroom }}<q-icon name="fa-solid fa-bath" color="white" class="q-ml-xs" />
      </q-badge>

      <q-space />

      <q-badge class="q-mx-none q-pa-xs"> {{ dateFormatter(rowData?.advertisementDate) }}</q-badge>
    </q-card-actions>

    <q-card-section class="row q-pa-sm">
      <template v-if="rowData?.meta?.propertyStatus === 3">
        <q-badge
          class="bg-green-1 text-primary text-caption text-weight-bold q-mr-sm q-my-xs"
          align="top"
          label="For Rent"
        />
        <q-badge
          class="bg-green-1 text-primary text-caption text-weight-bold q-mr-sm q-my-xs"
          align="top"
          label="For Sale"
        />
      </template>
      <template v-else-if="rowData?.meta?.propertyStatus === 2">
        <q-badge
          class="bg-green-1 text-primary text-caption text-weight-bold q-mr-sm q-my-xs"
          align="top"
          label="For Sale"
        />
      </template>
      <template v-else>
        <q-badge
          class="bg-green-1 text-primary text-caption text-weight-bold q-mr-sm q-my-xs"
          align="top"
          label="For Rent"
        />
      </template>

      <q-badge
        class="bg-green-1 text-primary text-caption text-weight-bold q-mr-sm q-my-xs"
        align="top"
        >{{
          (rowData?.saleableArea == null || undefined ? 0 : rowData?.saleableArea) + " Sq. Ft."
        }}</q-badge
      >

      <q-badge
        class="bg-green-1 text-primary text-caption text-weight-bold q-mr-sm q-my-xs"
        align="top"
        >{{ rowData?.propertyLayout }}</q-badge
      >
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  // 3rd Party Import
  import { date } from "quasar";

  // .ts files
  import { BASE_IMAGE_URL } from "@/constants";

  // Custom Components
  import AppImg from "@/components/widgets/app-img.vue";

  defineProps({
    rowData: {
      type: Object
    }
  });
  function dateFormatter(value: string | number | Date) {
    return date.formatDate(value, "YYYY-MM-DD");
  }
</script>
