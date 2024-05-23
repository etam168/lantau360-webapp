<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    @update:model-value="updateDialogState"
    :model-value="isDialogVisible"
    maximized
  >
    <q-layout view="lHh lpr lFf" container style="max-width: 1024px; background-color: #f6f6f6">
      <q-header class="bg-transparent text-dark">
        <app-dialog-title>{{ categoryData.dialogTitle }}</app-dialog-title>
      </q-header>

      <q-page-container>
        <q-page>
          <atm-renderer
            v-if="categoryData.renderer === RENDERER.ATM"
            :item="item"
            :isFavourite="isFavourite"
            @on-favourite="onBtnFavClick"
          />
          <business-renderer
            v-else-if="categoryData.renderer === RENDERER.BUSINESS"
            :item="item"
            :isFavourite="isFavourite"
            @on-favourite="onBtnFavClick"
          />
          <daytrip-renderer
            v-else-if="categoryData.renderer === RENDERER.DAYTRIP"
            :item="item"
            :isFavourite="isFavourite"
            @on-favourite="onBtnFavClick"
          />
          <emergency-renderer
            v-else-if="categoryData.renderer === RENDERER.EMERGENCY"
            :item="item"
            :isFavourite="isFavourite"
            @on-favourite="onBtnFavClick"
          />
          <property-renderer v-else-if="categoryData.renderer === RENDERER.PROPERTY" :item="item" />
          <posting-renderer v-else-if="categoryData.renderer === RENDERER.POSTING" :item="item" />
          <restaurant-renderer
            v-else-if="categoryData.renderer === RENDERER.RESTAURANT"
            :item="item"
            :isFavourite="isFavourite"
            @on-favourite="onBtnFavClick"
            >{{ $t("action.yes") }}</restaurant-renderer
          >
          <site-renderer
            v-else-if="categoryData.renderer === RENDERER.SITE"
            :item="item"
            :isFavourite="isFavourite"
            @on-favourite="onBtnFavClick"
          />
          <taxi-renderer
            v-else-if="categoryData.renderer === RENDERER.TAXI"
            :item="item"
            :isFavourite="isFavourite"
            @on-favourite="onBtnFavClick"
          />
          <timetable-renderer
            v-else-if="categoryData.renderer === RENDERER.TIMETABLE"
            :item="item"
            :isFavourite="isFavourite"
            @on-favourite="onBtnFavClick"
          />
          <tuition-renderer v-else-if="categoryData.renderer === RENDERER.TUITION" :item="item" />
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  import { LocalStorage, useDialogPluginComponent } from "quasar";

  // Interface files
  import { BusinessView } from "@/interfaces/models/views/business-view";
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { SiteView } from "@/interfaces/models/views/site-view";

  // .ts files
  import { RENDERER, TEMPLATE, STORAGE_KEYS } from "@/constants";
  import { useUtilities } from "@/composable/use-utilities";

  // Custom Components
  import AtmRenderer from "@/components/dialog/renderer/atm-renderer.vue";
  import BusinessRenderer from "@/components/dialog/renderer/business-renderer.vue";
  import DaytripRenderer from "@/components/dialog/renderer/daytrip-renderer.vue";
  import EmergencyRenderer from "@/components/dialog/renderer/emergency-renderer.vue";
  import PostingRenderer from "@/components/dialog/renderer/posting-renderer.vue";
  import PropertyRenderer from "@/components/dialog/renderer/property-renderer.vue";
  import RestaurantRenderer from "@/components/dialog/renderer/restaurant-renderer.vue";
  import SiteRenderer from "@/components/dialog/renderer/site-renderer/index.vue";
  import TaxiRenderer from "@/components/dialog/renderer/taxi-renderer.vue";
  import TimetableRenderer from "@/components/dialog/renderer/timetable-renderer.vue";
  import TuitionRenderer from "@/components/dialog/renderer/tuition-renderer.vue";

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });

  const { translate, eventBus, isSiteView, isBusinessView, isPostingView } = useUtilities();
  const { dialogRef } = useDialogPluginComponent();
  const isDialogVisible = ref();

  function getCategoryData() {
    let renderer = "";
    let dialogTitle = "";

    if (isSiteView(props.item)) {
      renderer = RENDERER.SITE;
      dialogTitle = translate(props.item.siteName, props.item.meta, "siteName");
    } else if (isBusinessView(props.item)) {
      renderer = RENDERER.BUSINESS;
      dialogTitle = translate(props.item.businessName, props.item.meta, "businessName");
    } else if (isPostingView(props.item)) {
      renderer = RENDERER.POSTING;
      dialogTitle = "Posting";
    }

    if (props.item.directoryTemplate == TEMPLATE.ATM.value) {
      renderer = RENDERER.ATM;
    } else if (props.item.directoryTemplate == TEMPLATE.TIMETABLE.value) {
      renderer = RENDERER.TIMETABLE;
    } else if (props.item.directoryTemplate == TEMPLATE.TAXI.value) {
      renderer = RENDERER.TAXI;
    } else if (props.item.directoryTemplate == TEMPLATE.RESTAURANT.value) {
      renderer = RENDERER.RESTAURANT;
    } else if (props.item.directoryTemplate == TEMPLATE.DAYTRIP.value) {
      renderer = RENDERER.DAYTRIP;
    } else if (props.item.directoryTemplate == TEMPLATE.EMERGENCY.value) {
      renderer = RENDERER.EMERGENCY;
    } else if (props.item.directoryTemplate == TEMPLATE.PROPERTY.value) {
      renderer = RENDERER.EMERGENCY;
    } else if (props.item.directoryTemplate == TEMPLATE.TUITION.value) {
      renderer = RENDERER.EMERGENCY;
    }

    return { renderer, dialogTitle };
  }

  const categoryData = computed(() => getCategoryData());

  const favoriteSiteItems = ref(
    (LocalStorage.getItem(STORAGE_KEYS.SAVED.SITE) || []) as SiteView[]
  );
  const favoriteBusinessItems = ref(
    (LocalStorage.getItem(STORAGE_KEYS.SAVED.BUSINESS) || []) as BusinessView[]
  );

  const isFavourite = computed(() => {
    if (isSiteView(props.item)) {
      const favItems = favoriteSiteItems.value;
      const item = props.item as SiteView;
      return useArraySome(favItems, fav => fav.siteId == item.siteId).value;
    } else if (isBusinessView(props.item)) {
      const favItems = favoriteBusinessItems.value;
      const item = props.item as BusinessView;
      return useArraySome(favItems, fav => fav.businessId == item.businessId).value;
    }
  });

  const onBtnFavClick = () => {
    if (isSiteView(props.item)) {
      const item = props.item as SiteView;
      const index = favoriteSiteItems.value.findIndex(fav => fav.siteId === item.siteId);

      if (isFavourite.value) {
        if (index !== -1) {
          favoriteSiteItems.value.splice(index, 1);
        }
      } else {
        favoriteSiteItems.value.push(item);
      }

      LocalStorage.set(STORAGE_KEYS.SAVED.SITE, favoriteSiteItems.value);
    } else if (isBusinessView(props.item)) {
      const item = props.item as BusinessView;
      const index = favoriteBusinessItems.value.findIndex(
        fav => fav.businessId === item.businessId
      );

      if (isFavourite.value) {
        if (index !== -1) {
          favoriteBusinessItems.value.splice(index, 1);
        }
      } else {
        favoriteBusinessItems.value.push(item);
      }

      LocalStorage.set(STORAGE_KEYS.SAVED.BUSINESS, favoriteBusinessItems.value);
    }

    eventBus.emit("favoriteUpdated", props.item);
  };

  onMounted(() => {
    eventBus.on("CategoryDetailDialog", () => {
      isDialogVisible.value = false;
    });
  });

  function updateDialogState(status: any) {
    isDialogVisible.value = status;
    eventBus.emit("DialogStatus", status, "CategoryDetailDialog");
  }
</script>
