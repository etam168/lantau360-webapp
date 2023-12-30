<template>
  <q-list padding class="q-mx-sm q-pa-none">
    <q-item>
      <template
        v-if="item.subtitle1 !== null && item.subtitle1 !== undefined && item.subtitle1 !== ''"
      >
        <q-item-section top>
          <q-item-label class="text-caption text-weight-light"
            >{{ translate(item.subtitle1, item.meta, "subtitle1") }}
          </q-item-label>
        </q-item-section>
      </template>

      <q-item-section v-else></q-item-section>
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
            @click="onBtnFavClick"
          />
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item>
      <div v-html="translate(item.description, item.meta, 'description')"></div>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  import { LocalStorage } from "quasar";
  import { STORAGE_KEYS } from "@/constants";
  import { Site } from "@/interfaces/models/entities/site";
  import { EventBus } from "quasar";

  const directoryItem = ref<Site>({} as Site);
  const { translate } = useUtilities();

  const props = defineProps({
    item: {
      type: Object as PropType<Site>,
      required: true
    }
  });

  const eventBus = new EventBus();
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

      const storageKey = STORAGE_KEYS.SAVED.SITE;
      LocalStorage.set(storageKey, favoriteItems.value);

      eventBus.emit("favoriteUpdated", {
        siteId: directoryItem.value.siteId || null
      });
    }
  };
</script>
