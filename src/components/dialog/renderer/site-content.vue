<template>
  <q-list padding class="q-mx-sm q-pa-none">
    <q-item>
      <q-item-section avatar>
        <q-icon color="primary" name="location_on" />
      </q-item-section>
      <q-item-section>
        <q-item-label class="q-mt-sm"
          >{{ translate(siteItem.subtitle1, siteItem.meta, "subtitle1") }}
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
            @click="onBtnFavClick()"
            class="q-mr-md" />
          <q-btn color="primary" text-color="white" icon="phone" size="sm" round class="q-mr-md" />
          <q-btn color="primary" text-color="white" icon="fab fa-whatsapp" size="sm" round
        /></q-item-label>
      </q-item-section>
    </q-item>

    <q-separator class="q-mt-sm" />

    <q-item>
      <div v-html="translate(siteItem.description, siteItem.meta, 'description')"></div>
    </q-item>
    <q-separator class="q-mt-sm" />
  </q-list>
</template>

<script setup lang="ts">
  import { LocalStorage } from "quasar";
  import { STORAGE_KEYS } from "@/constants";
  import { Site } from "@/interfaces/models/entities/site";
  import { useUtilities } from "@/composable/use-utilities";
  import { Directory } from "@/interfaces/models/entities/directory";
  // import { EventBus } from "quasar";

  // const siteItem = ref<Site>({} as siteItem);
  const { translate } = useUtilities();
  const emits = defineEmits(["favorite"]);

  const props = defineProps({
    item: {
      type: Object as PropType<Site>,
      required: true
    },
    directory: {
      type: Object as PropType<Directory>,
      required: true
    }
  });

  // Check if  siteId exists in favoriteItems on component mount
  onMounted(() => {
    const itemIdToMatch = siteItem.value.siteId;

    if (itemIdToMatch) {
      const isItemFavorited = favoriteItems.value.some(
        (item: Site) => item.siteId === itemIdToMatch
      );

      isFavourite.value = isItemFavorited;
    }
  });

  const siteItem = computed(() => {
    return props.item as Site;
  });
  // const eventBus = new EventBus();
  const isFavourite = ref<boolean>(false);

  const favoriteItems = computed(() => {
    return (LocalStorage.getItem(STORAGE_KEYS.SAVED.SITE) || []) as Site[];
  });

  function onBtnFavClick() {
    debugger;
    const itemIdToMatch = siteItem.value.siteId;

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
        siteItem.value.directoryName = props.directory.directoryName;
        isFavourite.value = true;
        favoriteItems.value.push(siteItem.value);
      }

      const storageKey = STORAGE_KEYS.SAVED.SITE;
      LocalStorage.set(storageKey, favoriteItems.value);

      emits("favorite", {
        siteId: siteItem.value.siteId,
        isFavorite: isFavourite.value
      });
    }
  }
</script>
