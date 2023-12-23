<template>
  <q-list padding class="q-mx-sm q-pa-none">
    <q-item>
      <q-item-section avatar>
        <q-icon color="primary" name="location_on" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="q-mt-sm"
          >{{ translate(item.subtitle1, item.meta, "subtitle1") }}
        </q-item-label>
        <q-item-label class="q-mt-sm" caption>{{ $t("community.subtitle1") }} </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-item-label>
          <q-btn
            v-if="item.contactPhone !== null && item.contactPhone !== undefined"
            color="primary"
            text-color="white"
            icon="phone"
            size="sm"
            round
            class="q-mr-md"
          />
          <q-btn
            v-if="item.contactWhatsApp !== null && item.contactWhatsApp !== undefined"
            color="primary"
            text-color="white"
            icon="fab fa-whatsapp"
            size="sm"
            round
            class="q-mr-md"
          />
          <q-btn
            color="primary"
            :text-color="isFavourite ? 'red' : 'white'"
            icon="favorite"
            size="sm"
            round
            @click="onBtnFavClick"
          />
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item>
      <q-item-section avatar>
        <q-icon color="primary" name="schedule" />
      </q-item-section>

      <q-item-section class="row">
        <q-item-label>
          <q-item-label class="q-mt-sm"
            >{{ formatTime(item.openTime) }} - {{ formatTime(item.closeTime) }}</q-item-label
          >
          <q-item-label class="q-mt-sm" caption
            >{{ $t("business.openTime") }} - {{ $t("business.closeTime") }}</q-item-label
          >
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-separator class="q-mt-sm" />

    <q-item>
      <div v-html="translate(item.description, item.meta, 'description')"></div>
    </q-item>
    <q-separator class="q-mt-sm" />
  </q-list>
</template>

<script setup lang="ts">
  import { PropType, computed } from "vue";
  import { ref } from "vue";
  import { LocalStorage } from "quasar";
  import { STORAGE_KEYS } from "@/constants";
  import { Business } from "@/interfaces/models/entities/business";
  import { useUtilities } from "@/composable/use-utilities";
  import { EventBus } from "quasar";

  //const directoryItem = ref<Business>({} as Business);
  const { translate } = useUtilities();

  const props = defineProps({
    item: {
      type: Object as PropType<Business>,
      required: true
    }
  });

  const eventBus = new EventBus();
  const formatTime = (time: string | undefined) => {
    if (!time) return "";

    const parsedTime = new Date(`2000-01-01T${time}`);
    const formattedTime = parsedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return formattedTime;
  };

  const favoriteItems = computed(() => {
    return (LocalStorage.getItem(STORAGE_KEYS.SAVED.BUSINESS) || []) as Business[];
  });

  const isFavourite = ref<boolean>(false);
  const onBtnFavClick = () => {
    const itemIdToMatch = props.item.businessId;

    if (itemIdToMatch) {
      const isCurrentlyFavourite = isFavourite.value;

      if (isCurrentlyFavourite) {
        const itemIndex = favoriteItems.value.findIndex(
          (item: any) => item.businessId === itemIdToMatch
        );

        if (itemIndex !== -1) {
          favoriteItems.value.splice(itemIndex, 1);
        }

        isFavourite.value = false;
      } else {
        isFavourite.value = true;
        favoriteItems.value.push(props.item);
      }

      LocalStorage.set(STORAGE_KEYS.SAVED.BUSINESS, favoriteItems.value);

      eventBus.emit("favoriteUpdated", {
        itemId: props.item.businessId,
        isFavorite: isFavourite.value,
        moduleType: "business"
      });
    }
  };
</script>
