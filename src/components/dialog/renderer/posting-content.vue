<template>
  <q-list padding class="q-mx-sm q-pa-none">
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
  import { useUtilities } from "@/composable/use-utilities";
  import eventBus from "@/utils/event-bus";
  import { Posting } from "@/interfaces/models/entities/posting";

  const directoryItem = ref<Posting>({} as Posting);
  const { translate } = useUtilities();

  const props = defineProps({
    item: {
      type: Object as PropType<Posting>,
      required: true
    }
  });

  const isFavourite = ref<boolean>(false);

  const favoriteItems = computed(() => {
    return (LocalStorage.getItem(STORAGE_KEYS.SAVED.SITE) || []) as Posting[];
  });

  const onBtnFavClick = () => {
    const itemIdToMatch = directoryItem.value.postingId;

    if (itemIdToMatch) {
      const isCurrentlyFavourite = isFavourite.value;

      if (isCurrentlyFavourite) {
        const itemIndex = favoriteItems.value.findIndex(
          (item: any) => item.postingId === itemIdToMatch
        );

        if (itemIndex !== -1) {
          favoriteItems.value.splice(itemIndex, 1);
        }

        isFavourite.value = false;
      } else {
        isFavourite.value = true;
        favoriteItems.value.push(props.item);
      }

      const storageKey = STORAGE_KEYS.POSTINGFAVOURITES;
      LocalStorage.set(storageKey, favoriteItems.value);

      eventBus.emit("favoriteUpdated", {
        siteId: directoryItem.value.postingId || null
      });
    }
  };
</script>
