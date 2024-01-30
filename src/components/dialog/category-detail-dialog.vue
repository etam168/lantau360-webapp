<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
    maximized
  >
    <q-layout view="lHh lpr lFf" class="bg-white" style="max-width: 1024px">
      <q-header class="bg-transparent text-dark">
        <app-dialog-title>{{ dialogTitle }}</app-dialog-title>
      </q-header>

      <q-page-container>
        <q-page>
          <div v-if="renderer !== RENDERER.TIMETABLE" class="q-items-center q-pa-none">
            <gallery-image-list :image-list="galleryItems" />
          </div>

          <atm-renderer v-if="renderer === RENDERER.ATM" :item="item" />
          <site-renderer v-if="renderer === RENDERER.SITE" :item="item" />
          <business-renderer v-else-if="renderer === RENDERER.BUSINESS" :item="item" />
          <timetable-renderer v-else-if="renderer === RENDERER.TIMETABLE" :item="item" />
          <taxi-renderer v-else-if="renderer === RENDERER.TAXI" :item="item" />
          <restaurant-renderer v-else-if="renderer === RENDERER.RESTAURANT" :item="item" />
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import { useDialogPluginComponent } from "quasar";

  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { GalleryImageType } from "@/interfaces/types/gallery-image-types";

  // .ts files
  import { URL, RENDERER, TEMPLATE } from "@/constants";
  import { useUtilities } from "@/composable/use-utilities";

  // Custom Components
  import AtmRenderer from "@/components/dialog/renderer/atm-renderer.vue";
  import BusinessRenderer from "@/components/dialog/renderer/business-renderer.vue";
  import SiteRenderer from "@/components/dialog/renderer/site-renderer.vue";
  import TaxiRenderer from "@/components/dialog/renderer/taxi-renderer.vue";
  import TimetableRenderer from "@/components/dialog/renderer/timetable-renderer.vue";
  import RestaurantRenderer from "@/components/dialog/renderer/restaurant-renderer.vue";

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });

  const { translate, eventBus } = useUtilities();
  const { dialogRef } = useDialogPluginComponent();
  const isDialogVisible = ref();

  const error = ref<string | null>(null);
  const galleryItems = ref<GalleryImageType[]>([]);

  const dialogTitle = computed(() => {
    switch (true) {
      case "siteId" in props.item:
        return translate(props.item.siteName, props.item.meta, "siteName");
      case "businessId" in props.item:
        return translate(props.item.businessName, props.item.meta, "businessName");
      default:
        return "";
    }
  });

  const galleryUrl = computed(() => {
    switch (true) {
      case "siteId" in props.item:
        return `${URL.SITE_GALLERY}/${props.item.siteId}`;
      case "businessId" in props.item:
        return `${URL.BUSINESS_GALLERY}/${props.item.businessId}`;
      default:
        return "";
    }
  });

  const renderer = computed(() => {
    debugger;
    switch (true) {
      case props.item.directoryTemplate == TEMPLATE.ATM.value:
        return RENDERER.ATM;
      case props.item.directoryTemplate == TEMPLATE.TIMETABLE.value:
        return RENDERER.TIMETABLE;
      case props.item.directoryTemplate == TEMPLATE.TAXI.value:
        return RENDERER.TAXI;
      case props.item.directoryTemplate == TEMPLATE.RESTAURANT.value:
        return RENDERER.RESTAURANT;
      case "siteId" in props.item && props.item.directoryTemplate == TEMPLATE.DEFAULT.value:
        return RENDERER.SITE;
      case "businessId" in props.item && props.item.directoryTemplate == TEMPLATE.DEFAULT.value:
        return RENDERER.BUSINESS;
      default:
        return "";
    }
  });

  onMounted(() => {
    loadData();
    eventBus.on("CategoryDetailDialog", () => {
      isDialogVisible.value = false;
    });
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "CategoryDetailDialog");
  }

  const loadData = async () => {
    if (galleryUrl.value) {
      try {
        const [galleryResponse] = await Promise.all([
          axios.get<GalleryImageType[]>(galleryUrl.value)
        ]);

        const maskValue = getMaskValue(props.item.directoryTemplate ?? 0) ?? 0;
        // galleryItems.value = galleryResponse.data.filter(
        //   element => !(maskValue & (1 << (element.ranking - 1)))
        // );
        galleryItems.value = galleryResponse.data
          .filter(element => !((maskValue >> (element.ranking - 1)) & 1))
          .sort((a, b) => a.ranking - b.ranking);
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
    }
  };

  function getMaskValue(templateValue: number) {
    for (const make in TEMPLATE) {
      if (TEMPLATE[make as keyof typeof TEMPLATE].value === templateValue) {
        return TEMPLATE[make as keyof typeof TEMPLATE].mask;
      }
    }
    return 0;
  }
</script>
