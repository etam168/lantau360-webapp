<template>
  <q-list padding class="q-mx-sm q-pa-none">
    <div>taxi</div>
    <q-item>
      <q-item-section avatar>
        <q-icon color="primary" name="location_on" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="q-mt-sm"
          >{{ translate(directoryItem.subtitle1, directoryItem.meta, "subtitle1") }}
        </q-item-label>
        <q-item-label class="q-mt-sm" caption>{{ $t("community.subtitle1") }} </q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-item-label>
          <q-btn
            color="primary"
            :text-color="isFavourite ? 'red' : 'white'"
            icon="favorite"
            size="sm"
            round
            @click="onBtnFavClick"
            class="q-mr-md" />
          <q-btn color="primary" text-color="white" icon="phone" size="sm" round class="q-mr-md" />
          <q-btn color="primary" text-color="white" icon="fab fa-whatsapp" size="sm" round
        /></q-item-label>
      </q-item-section>
    </q-item>

    <q-separator class="q-mt-sm" />

    <q-item>
      <div v-html="translate(directoryItem.description, directoryItem.meta, 'description')"></div>
    </q-item>
    <q-separator class="q-mt-sm" />
  </q-list>
</template>
<script setup lang="ts">
  import { LocalStorage } from "quasar";
  import { STORAGE_KEYS } from "@/constants";
  import { Site } from "@/interfaces/models/entities/site";
  import { useUtilities } from "@/composable/use-utilities";
  import eventBus from "@/utils/event-bus";

  const directoryItem = ref<Site>({} as Site);
  const { translate } = useUtilities();

  const props = defineProps({
    item: {
      type: Object as PropType<Site>,
      required: true
    }
  });

  const isFavourite = ref<boolean>(false);

  const favoriteItems = computed(() => {
    return (LocalStorage.getItem(STORAGE_KEYS.SAVED.SITE) || []) as Site[];
  });

  const onBtnFavClick = () => {
    const itemIdToMatch = directoryItem.value.siteId;

    if (itemIdToMatch) {
      const isCurrentlyFavourite = isFavourite.value;

      if (isCurrentlyFavourite) {
        const itemIndex = favoriteItems.value.findIndex(
          (item: any) => item.siteId === itemIdToMatch
        );

        if (itemIndex !== -1) {
          favoriteItems.value.splice(itemIndex, 1);
        }

        isFavourite.value = false;
      } else {
        isFavourite.value = true;
        favoriteItems.value.push(props.item);
      }

      const storageKey = STORAGE_KEYS.SITEFAVOURITES;
      LocalStorage.set(storageKey, favoriteItems.value);

      eventBus.emit("favoriteUpdated", {
        siteId: directoryItem.value.siteId || null
      });
    }
  };
</script>
