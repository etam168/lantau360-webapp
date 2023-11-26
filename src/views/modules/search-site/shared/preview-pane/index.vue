<template>
  <q-card square flat class="bg-transparent">
    <q-toolbar>
      <q-toolbar-title>Preview</q-toolbar-title>
    </q-toolbar>
    <q-separator />

    <q-card-section class="q-mx-auto" v-if="$q.screen.gt.md" style="max-width: 1140px">
      <q-card-section class="q-pa-sm q-mb-md bg-white">
        <header-info :rowData="siteinput" />
      </q-card-section>

      <q-card-section horizontal>
        <q-card-section class="q-pa-none col-md-8">
          <image-gallery :galleryImages="siteImages?.galleryImages ?? []" />
          <expansion-items :row-data="siteinput" />
        </q-card-section>

        <q-card-section class="q-pr-none q-py-none col-md-4">
          <property-info />
          <contact-info />
        </q-card-section>
      </q-card-section>
    </q-card-section>
    <q-card-section v-else class="q-pa-none">
      <q-card-section>
        <header-info :rowData="siteinput" />
        <image-gallery :galleryImages="siteImages.galleryImages" />
        <property-info />
        <contact-info />
        <expansion-items :row-data="siteinput" />
      </q-card-section>
    </q-card-section>
  </q-card>
</template>

<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
  // Vue Import
  import { Ref, inject } from "vue";

  //.ts
  import { BusinessImages } from "@/interfaces/models/gallery";

  const siteImages = inject("images") as Ref<BusinessImages>;
  const siteinput = inject("previewData") as Ref<BusinessDatatable>;
  // Custom Components
  import ImageGallery from "./images-section/index.vue";
  import HeaderInfo from "./header-info.vue";
  import ExpansionItems from "./expansion-items.vue";
  import PropertyInfo from "./property-info.vue";
  import ContactInfo from "./contact-info.vue";
  import { BusinessDatatable } from "@/interfaces/datatable/site-datatable";
</script>

<style>
  .centered {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
</style>
