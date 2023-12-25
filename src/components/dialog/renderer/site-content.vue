<template>
  <q-list padding class="q-mx-sm q-pa-none">
    <q-item>
      <q-item-section> </q-item-section>
      <q-item-section side>
        <q-item-label>
          <q-btn
            v-if="
              item.contactPhone !== null &&
              item.contactPhone !== undefined &&
              item.contactPhone !== ''
            "
            color="primary"
            text-color="white"
            icon="phone"
            size="sm"
            round
            class="q-mr-sm"
            @click="navigateToPhone"
          />
          <q-btn
            v-if="
              item.contactWhatsApp !== null &&
              item.contactWhatsApp !== undefined &&
              item.contactWhatsApp !== ''
            "
            color="primary"
            text-color="white"
            icon="fab fa-whatsapp"
            size="sm"
            round
            class="q-mr-sm"
            @click="navigateToWhatsApp"
          />
          <q-btn
            color="primary"
            :text-color="isFavourite ? 'red' : 'white'"
            icon="favorite"
            size="sm"
            round
            @click="onBtnFavClick()"
          />
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item>
      <div v-html="translate(siteItem.description, siteItem.meta, 'description')"></div>
    </q-item>
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

  const navigateToPhone = () => {
    if (props?.item.contactPhone) {
      const phoneURL = `tel:${props?.item.contactPhone}`;
      window.location.href = phoneURL;
    }
  };

  function navigateToWhatsApp() {
    const whatsappURL = `https://wa.me/${props?.item.contactWhatsApp}?text=Hello,%20Welcome%20to%20Lantau360.`;
    window.open(whatsappURL, "_blank");
  }

  function onBtnFavClick() {
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
