<template>
  <q-img
    v-bind="$attrs"
    fit="cover"
    class="cursor-pointer"
    :placeholder-src="PLACEHOLDER_THUMBNAIL"
    :ratio="16 / 10"
    width="320px"
    height="180px"
    :src="imagelink"
  >
    <div
      v-if="isNthBitSet(rowData.listingMode, 3)"
      class="absolute text-center bg-teal-9 text-weight-light"
      style="
        padding: 2px !important;
        transform: rotate(-45deg);
        transform-origin: center center;
        width: 136px;
        margin: 18px 0 0 -36px;
      "
    >
      {{ $t("home.featuredSection.soleAgent") }}
    </div>

    <div v-if="isNewListing" class="absolute-top-right bg-transparent">
      <q-avatar size="lg">
        <img src="/img/new_icon.png" />
      </q-avatar>
    </div>

    <template #error>
      <div class="absolute-full flex flex-center bg-grey-5 text-white">Cannot load image</div>
    </template>

    <template #loading>
      <div class="absolute-full flex flex-center bg-gray text-white">
        <q-inner-loading showing class="spinner-card row justify-center items-center">
          <q-spinner size="50px" color="primary" />
        </q-inner-loading>
      </div>
    </template>
  </q-img>
</template>

<script setup lang="ts">
  // Vue Import
  import { computed, PropType } from "vue";

  // 3rd Party Import
  import { date } from "quasar";

  // .ts files
  import { BLOB_URL, PLACEHOLDER_THUMBNAIL } from "@/constants";
  import { PropertyListing } from "@/interfaces/models/entities/property-listing";
  import { useUtilities } from "@/composable/use-utilities";

  const { isNthBitSet } = useUtilities();

  const props = defineProps({
    rowData: {
      type: Object as PropType<PropertyListing>,
      required: true
    }
  });

  const imagelink = computed(() => {
    const url = `${BLOB_URL}/${props.rowData.bannerPath}`;
    return url || PLACEHOLDER_THUMBNAIL;
  });

  const isNewListing = computed(() => {
    const diff = date.getDateDiff(new Date(), props.rowData.modifiedAt, "days");
    return diff < 30;
  });
</script>
