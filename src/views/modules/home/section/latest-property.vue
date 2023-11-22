<!-- latest-property.vue -->
<template>
  <q-card-section class="text-center">
    <div class="text-h5 text-weight-regular">{{ $t("home.LatestSection.title") }}</div>
  </q-card-section>

  <q-card-section>
    <animated-grid
      row-key="propertyListingId"
      :rows="data"
      :hidePagination="true"
      @on-contact="handleContact"
      @on-detail="handleDetail"
    />
  </q-card-section>
</template>

<script setup lang="ts">
  // Vue Import
  import { onBeforeUnmount, defineAsyncComponent, PropType } from "vue";
  import { useRouter } from "vue-router";

  // 3rd Party Import
  import { useQuasar } from "quasar";

  // .ts file
  import eventBus from "@/utils/event-bus";
  import { PropertyListingDatatable } from "@/interfaces/datatable/property-listing-datatable";

  // Custom Components
  import AnimatedGrid from "@/components/table/animated-grid.vue";

  defineProps({
    data: {
      type: Array as PropType<PropertyListingDatatable[]>,
      required: false,
      default: null
    }
  });

  const $q = useQuasar();
  const router = useRouter();

  function handleContact(data: PropertyListingDatatable) {
    $q.dialog({
      component: defineAsyncComponent(() => import("@/components/dialogs/contact-dialog.vue")),
      componentProps: {
        row: data
      }
    });
  }

  function handleDetail(data: PropertyListingDatatable) {
    router.push({ name: "property-detail", params: { id: data.propertyListingId } });
  }

  onBeforeUnmount(() => {
    eventBus.off("LoadData");
  });
</script>
