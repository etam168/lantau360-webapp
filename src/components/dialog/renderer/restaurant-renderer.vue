<template>
  <q-list padding class="q-mx-sm q-pa-none">
    <q-item>
      <q-item-section top>
        <!-- <q-item-label v-if="businessItem.subtitle1" class="text-caption text-weight-light"
          >{{ translate(businessItem.subtitle1, businessItem.meta, "subtitle1") }}
        </q-item-label> -->
        <app-tab-select
          :tab-items="tabItems"
          :current-tab="tab"
          @update:currentTab="setTab"
          class="q-pl-none"
        />
      </q-item-section>

      <q-item-section side>
        <div class="q-gutter-md">
          <app-button-rounded
            v-if="businessItem.contactPhone"
            icon="phone"
            @click="navigateToPhone"
          />
          <app-button-rounded
            v-if="businessItem.contactWhatsApp"
            icon="fab fa-whatsapp"
            @click="navigateToWhatsApp(businessItem.contactWhatsApp)"
          />
          <app-button-rounded
            :text-color="isFavourite ? 'red' : 'white'"
            icon="favorite"
            @click="onBtnFavClick"
          />
        </div>
      </q-item-section>
    </q-item>

    <q-item v-if="shouldShowItem">
      <q-item-section>
        <q-item-label class="q-mt-sm">
          <span
            class="text-subtitle1"
            :style="{
              color: isCurrentTimeInRange(businessItem.openTime, businessItem.closeTime)
                ? '#478d45'
                : 'red'
            }"
          >
            {{
              isCurrentTimeInRange(businessItem.openTime, businessItem.closeTime)
                ? "Open now"
                : "Close now"
            }}
          </span>
          <q-icon size="0.9em" name="fiber_manual_record" />
          {{ formatTime(businessItem.openTime) }} - {{ formatTime(businessItem.closeTime) }}
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item>
      <q-tab-panels v-model="tab">
        <q-tab-panel name="aboutUs" class="q-pa-none">
          <app-text-editor v-model="translatedContent" />
        </q-tab-panel>

        <q-tab-panel name="info" class="q-pa-none">
          <div>
            <q-img
              class="q-ml-lg"
              :ratio="16 / 9"
              width="900px"
              :src="imagePath(businessItem.imagePath)"
              @click="openGoogleMaps"
            ></q-img>
            <q-item class="q-ma-md">
              <q-item-section>
                <q-item-label class="text-weight-medium text-h6">Address</q-item-label>
                <q-item-label class="text-caption"
                  >{{ translate(businessItem.subtitle1, businessItem.meta, "subtitle1") }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item class="q-mx-md">
              <q-item-section>
                <q-item-label class="text-weight-medium text-h6">Phone</q-item-label>
                <q-item-label class="text-caption"
                  >{{
                    businessItem.contactWhatsApp == undefined ? "N/A" : businessItem.contactWhatsApp
                  }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  import { LocalStorage } from "quasar";

  // Interface files
  import { BusinessView } from "@/interfaces/models/views/business-view";
  import { CategoryTypes } from "@/interfaces/types/category-types";

  // .ts files
  import { BLOB_URL, STORAGE_KEYS } from "@/constants";

  const { eventBus, navigateToWhatsApp, translate } = useUtilities();

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,

      required: true
    }
  });

  const { t } = useI18n({ useScope: "global" });

  const setTab = (val: string) => (tab.value = val);
  const tab = ref("aboutUs");
  const tabItems = ref([
    { name: "aboutUs", label: t("business.tabItems.aboutUs") },
    { name: "info", label: t("business.tabItems.info") }
  ]);

  const businessItem = computed(() => props?.item as BusinessView);

  const formatTime = (time: string | undefined) => {
    if (!time) return "";

    const parsedTime = new Date(`2000-01-01T${time}`);
    const formattedTime = parsedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return formattedTime;
  };

  const translatedContent: any = computed(() =>
    translate(businessItem.value.description, businessItem.value.meta, "description")
  );

  const isCurrentTimeInRange = (
    startTime: string | undefined,
    endTime: string | undefined
  ): boolean => {
    if (!startTime || !endTime) return false;

    const now = new Date();
    const startHour = parseInt(startTime.split(":")[0]);
    const startMinute = parseInt(startTime.split(":")[1]);
    const endHour = parseInt(endTime.split(":")[0]);
    const endMinute = parseInt(endTime.split(":")[1]);

    const startTimeToday = new Date();
    startTimeToday.setHours(startHour, startMinute, 0);

    const endTimeToday = new Date();
    endTimeToday.setHours(endHour, endMinute, 0);

    // If the end time is earlier than the start time, assume it's for the next day
    if (endTimeToday < startTimeToday) {
      endTimeToday.setDate(endTimeToday.getDate() + 1);
    }

    return now >= startTimeToday && now <= endTimeToday;
  };

  const favoriteItems = ref(
    (LocalStorage.getItem(STORAGE_KEYS.SAVED.BUSINESS) || []) as BusinessView[]
  );

  const imagePath = (path: string) => {
    return path ? `${BLOB_URL}/${path}` : "./img/icons/no_image_available.jpeg";
  };

  const isFavourite = computed(() => {
    const favItem = favoriteItems.value;
    return useArraySome(favItem, fav => fav.businessId == businessItem.value.businessId).value;
  });

  const navigateToPhone = () => {
    if (businessItem.value.contactPhone) {
      const phoneURL = `tel:${businessItem.value.contactPhone}`;
      window.location.href = phoneURL;
    }
  };

  const shouldShowItem = computed(() => {
    return (
      businessItem.value.openTime !== null &&
      businessItem.value.openTime !== undefined &&
      businessItem.value.openTime !== "" &&
      businessItem.value.closeTime !== null &&
      businessItem.value.closeTime !== undefined &&
      businessItem.value.closeTime !== ""
    );
  });

  const onBtnFavClick = () => {
    const localFavItem = favoriteItems.value;
    if (isFavourite.value) {
      const itemIndex = localFavItem.findIndex(
        (item: any) => item.businessId === businessItem.value.businessId
      );

      if (itemIndex !== -1) {
        localFavItem.splice(itemIndex, 1);
        favoriteItems.value = localFavItem;
      }
    } else {
      localFavItem.push(businessItem.value);
      favoriteItems.value = localFavItem;
    }
    LocalStorage.set(STORAGE_KEYS.SAVED.BUSINESS, favoriteItems.value);
    eventBus.emit("favoriteUpdated", props.item);
  };

  const openGoogleMaps = () => {
    // Check if the business has an address
    if (businessItem.value.subtitle1) {
      // Replace spaces in the address with '+'
      const address = encodeURIComponent(businessItem.value.subtitle1);

      // Construct the Google Maps URL with the address
      const mapsURL = `https://www.google.com/maps/search/?api=1&query=${address}`;

      // Open a new tab or window with the Google Maps URL
      window.open(mapsURL, "_blank");
    } else {
      // Handle cases where the business address is not available
      // console.error("Address not available");
    }
  };
</script>
