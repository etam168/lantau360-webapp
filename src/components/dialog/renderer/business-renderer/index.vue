<template>
  <q-list padding class="q-pa-none q-pb-md" style="background-color: #f6f6f6">
    <q-item>
      <q-item-section>
        <q-item-label class="q-mt-sm q-ml-sm" v-if="shouldShowItem">
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
          {{ formatTime(businessItem.openTime) }} -
          {{ formatTime(businessItem.closeTime) }}
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-list class="rounded-borders q-mx-lg">
      <q-card class="q-mb-md" v-if="translatedContent != null && translatedContent != ''">
        <q-card-section class="q-pa-sm">
          <q-expansion-item group="siteGroup" dense dense-toggle>
            <template v-slot:header>
              <q-item-section class="text-h6">
                {{ $t("home.description") }}
              </q-item-section>

              <q-item-section side>
                <app-button-rounded
                  :text-color="isFavourite ? 'red' : 'white'"
                  icon="favorite"
                  @click="onBtnFavClick"
                />
              </q-item-section>
            </template>
            <q-separator />

            <q-card>
              <q-card-section class="q-pa-md">
                <app-text-editor v-model="translatedContent" />
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-card-section>
      </q-card>

      <q-card class="q-mb-md">
        <q-card-section class="q-pa-sm">
          <q-expansion-item
            :label="$t('home.location')"
            group="siteGroup"
            dense
            dense-toggle
            default-opened
            header-class="text-h6"
          >
            <q-separator />
            <q-card>
              <q-card-section class="q-pa-none">
                <info-tab :item="item" />
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-card-section>
      </q-card>

      <q-card v-if="item.contactPhone || item.contactWhatsApp">
        <q-card-section class="q-pa-sm">
          <q-expansion-item
            :label="'Contact Info'"
            group="siteGroup"
            dense
            dense-toggle
            header-class="text-h6"
          >
            <q-separator />
            <q-card>
              <q-card-section class="q-pa-none">
                <contact-info :item="item" />
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-card-section>
      </q-card>
    </q-list>
  </q-list>
</template>

<script setup lang="ts">
  // Interface files
  import { BusinessView } from "@/interfaces/models/views/business-view";
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import InfoTab from "./detail-tabs/info-tab.vue";
  import ContactInfo from "./detail-tabs/contact-info.vue";

  // .ts files

  const { translate } = useUtilities();

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    },
    isFavourite: {
      type: Boolean,
      default: false
    }
  });

  const emits = defineEmits(["on-favourite"]);

  const businessItem = computed(() => props?.item as BusinessView);

  const formatTime = (time: string | undefined) => {
    if (!time) return "";

    const parsedTime = new Date(`2000-01-01T${time}`);
    const formattedTime = parsedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return formattedTime;
  };

  const translatedContent = ref("");

  watchEffect(() => {
    translatedContent.value = translate(
      businessItem.value.description,
      businessItem.value.meta,
      "description"
    );
  });

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
    emits("on-favourite");
  };
</script>
