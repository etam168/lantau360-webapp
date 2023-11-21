<template>
  <div></div>
  <!-- <q-toolbar class="bg-grey-3 q-px-0 shadow-2">
    <location-dropdown @selectedlocation="handleLocationChange" />
    <range-select-dropdown :options="sellPriceOption" @change="handleSellPriceChange" />
    <range-select-dropdown :options="rentPriceOptions" @change="handleRentPriceChange" />
    <range-select-dropdown :options="bedOptions" @change="handleBedroomChange" />
    <features-dropdown @change="handleFeatureChange" />
    <property-types-dropdown @change="handlePropertyTypeChange" />
    <range-select-dropdown :options="sizeOptions" @change="handleSizeChange" />
    <property-status-dropdown :options="sizeOptions" @change="handelStatusChange" />
  </q-toolbar> -->
</template>

<script setup lang="ts">
  // // Vue Import
  // import { ref, provide } from "vue";

  // // .ts files
  // import { SearchBarOptions } from "@/interfaces/search-bar-options";
  // import {
  //   extractAmenities,
  //   extractLocation,
  //   extractPropertyTypes,
  //   FilterOptions,
  //   RangeValue
  // } from "@/composable/use-search-bar-options";

  // // Custom Components
  // import FeaturesDropdown from "./features-dropdown.vue";
  // import LocationDropdown from "./location-dropdown.vue";
  // import PropertyTypesDropdown from "./property-types-dropdown.vue";
  // import RangeSelectDropdown from "./range-select-dropdown.vue";

  // import PropertyStatusDropdown from "./property-status-dropdown.vue";
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // import AppButton from "@/components/widgets/app-button.vue";

  // const props = defineProps({
  //   searchBarData: {
  //     type: Object
  //   }
  // });
  // const sellPriceOption = {
  //   icon: "fas fa-dollar-sign",
  //   label: "searchBar.search.sellPrice",
  //   title: "searchBar.price.title",
  //   priceMin: true,
  //   multiplier: 5,
  //   markerLabels: { 0: "5", 1: "10", 2: "15", 3: "20", 4: "25", 5: "30+" },
  //   unit: "Million"
  // };

  // const rentPriceOptions = {
  //   icon: "fas fa-dollar-sign",
  //   label: "searchBar.search.rentPrice",
  //   title: "searchBar.price.title",
  //   priceMin: true,
  //   multiplier: 5,
  //   markerLabels: { 0: "5", 1: "10", 2: "15", 3: "20", 4: "25", 5: "30+" },
  //   unit: "K"
  // };

  // const bedOptions = {
  //   icon: "fa-solid fa-bed",
  //   label: "searchBar.search.bedrooms",
  //   markerLabels: { 0: "Studio", 1: "1", 2: "2", 3: "3", 4: "4", 5: "5+" },
  //   multiplier: 1,
  //   title: "searchBar.bedroom.title",
  //   unit: "Beds"
  // };

  // const sizeOptions = {
  //   icon: "",
  //   label: "searchBar.search.size",
  //   markerLabels: { 0: "0", 1: "400", 2: "800", 3: "1200", 4: "1600", 5: "2000+" },
  //   multiplier: 400,
  //   title: "searchBar.size.title",
  //   unit: "Sq Ft"
  // };

  // const emit = defineEmits(["on-refresh", "on-search", "on-filter"]);

  // // const keyWord = ref();
  // const filterOption = ref<FilterOptions>({
  //   locations: [],
  //   bedrooms: { min: 0, max: null },
  //   features: [],
  //   propertyTypes: [],
  //   price: { min: 0, max: null },
  //   rentPrice: { min: 0, max: null },
  //   size: null,
  //   status: null
  // });

  // const features = extractAmenities(props.searchBarData);
  // const locations = extractLocation(props.searchBarData);
  // const propertyTypes = extractPropertyTypes(props.searchBarData);

  // const handleLocationChange = (e: any) => {
  //   filterOption.value.locations = e;
  //   emit("on-filter", filterOption.value);
  // };

  // const handleSellPriceChange = (e: any) => {
  //   const multiplifer = 500000;
  //   const max = e.max >= 5 ? null : (Number(e.max) + 1) * multiplifer;
  //   const min = e.min == 0 ? null : (Number(e.min) + 1) * multiplifer;

  //   const output = { min: min, max: max } as RangeValue;
  //   filterOption.value.price = output;
  //   emit("on-filter", filterOption.value);
  // };

  // const handleRentPriceChange = (e: any) => {
  //   const multiplifer = 5000;
  //   const max = e.max >= 5 ? null : (Number(e.max) + 1) * multiplifer;
  //   const min = e.min == 0 ? null : (Number(e.min) + 1) * multiplifer;

  //   const output = { min: min, max: max } as RangeValue;

  //   filterOption.value.rentPrice = output;
  //   emit("on-filter", filterOption.value);
  // };

  // const handleBedroomChange = (e: any) => {
  //   const max = e.max == 5 ? null : e.max;
  //   const output = { min: e.min, max: max } as RangeValue;

  //   filterOption.value.bedrooms = output;
  //   emit("on-filter", filterOption.value);
  // };

  // const handleFeatureChange = (e: any) => {
  //   filterOption.value.features = e;
  //   emit("on-filter", filterOption.value);
  // };

  // const handlePropertyTypeChange = (e: any) => {
  //   filterOption.value.propertyTypes = e.ids;
  //   emit("on-filter", filterOption.value);
  // };

  // const handleSizeChange = (e: any) => {
  //   const multiplifer = 400;
  //   const max = e.max >= 5 ? null : e.max * multiplifer;
  //   const output = { min: e.min * multiplifer, max: max } as RangeValue;

  //   filterOption.value.size = output;
  //   emit("on-filter", filterOption.value);
  // };

  // const handelStatusChange = (e: any) => {
  //   filterOption.value.status = e;
  //   emit("on-filter", filterOption.value);
  // };

  // provide<SearchBarOptions>("searchOptions", {
  //   territories: locations,

  //   features: features,
  //   propertyTypes: propertyTypes
  // });
</script>
