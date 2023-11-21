<template>
  <q-card square>
    <q-card-section class="q-pa-none">
      <listing-img
        :rowData="row"
        :ratio="16 / 10"
        fit="cover"
        class="cursor-pointer"
        @click="handleDetail"
      />
    </q-card-section>
    <div>{{ row }}</div>
    <q-card-section horizontal class="q-pa-md">
      <q-card-section class="q-pa-none col-8">
        <q-item-section v-if="row.propertyListingId">
          <q-item-label class="text-subtitle1 text-weight-medium" lines="1">{{
            row.title
          }}</q-item-label>
          <!-- <q-item-label caption>{{ row.districtName }}</q-item-label> -->
        </q-item-section>

        <q-item-section v-else>
          <q-item-label class="text-subtitle1 text-weight-medium" lines="1"
            >{{ row.buildingName }} <br />
            {{ row.buildingAddress }}</q-item-label
          >
          <q-item-label caption>{{ row.address }}</q-item-label>
        </q-item-section>
      </q-card-section>

      <q-card-section class="q-pa-none col-4">
        <q-item-section style="height: 38px" top>
          <q-item-label v-show="sellPrice != '0'" class="text-right text-grey-10">{{
            sellPrice
          }}</q-item-label>

          <q-item-label v-show="rentPrice != '0'" class="text-right text-grey-10 q-ma-none">{{
            rentPrice
          }}</q-item-label>
        </q-item-section>
      </q-card-section>
    </q-card-section>

    <q-separator />

    <q-card-actions class="q-pa-md">
      <div>{{ $t("propertyListing.format.area", { sfPrice: row.areaNet ?? 0 }) }}</div>
      <q-separator vertical inset size="2px" spaced color="grey-6" />

      <div>{{ $t("propertyListing.format.bed", { bed: row.noOfBedRooms ?? 0 }) }}</div>
      <q-separator vertical inset size="2px" spaced color="grey-6" />

      <div>{{ $t("propertyListing.format.bath", { bath: row.bathroom ?? 0 }) }}</div>

      <q-space />

      <q-btn
        outline
        color="primary"
        icon="fa-brands fa-whatsapp"
        :label="$t('propertyListing.format.contact')"
        @click="handleContact"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
  // Vue Import
  import { computed, type PropType } from "vue";

  // .ts file
  import { PropertyListingDatatable } from "@/interfaces/datatable/property-listing-datatable";
  import { useUtilities } from "@/composable/use-utilities";

  // Custom Components
  import ListingImg from "./listing-img.vue";

  const props = defineProps({
    row: {
      type: Object as PropType<PropertyListingDatatable>,
      required: true
    }
  });

  const emits = defineEmits(["on-contact", "on-detail"]);
  const { formatPrice } = useUtilities();

  const sellPrice = computed(() => {
    if ((props.row.listingMode & 2) == 2) {
      // Selling price
      return formatPrice(props.row.askingPrice);
    }
    return "0";
  });

  const rentPrice = computed(() => {
    if ((props.row.listingMode & 1) == 1) {
      // Rental price
      return formatPrice(props.row.rentalPrice);
    }
    return "0";
  });

  function handleContact() {
    emits("on-contact");
  }

  function handleDetail() {
    emits("on-detail");
  }
</script>
