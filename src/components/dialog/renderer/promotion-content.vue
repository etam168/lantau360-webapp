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
            round
            size="sm"
            @click="onBtnFavClick"
          />
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-item>
      <app-text-editor v-model="translatedContent" />
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  import { DIRECTORY_GROUPS, STORAGE_KEYS } from "@/constants";

  import { LocalStorage } from "quasar";
  import { BusinessPromotion } from "@/interfaces/models/entities/business-promotion";
  import { MarketingType } from "@/interfaces/types/marketing-types";

  const { translate, eventBus } = useUtilities();

  const props = defineProps({
    item: {
      type: Object as PropType<MarketingType>,
      required: true
    }
  });

  const promotionItem = computed(() => {
    return props.item as BusinessPromotion;
  });
  const isDialogVisible = ref();

  const favoriteItems = ref<any>(LocalStorage.getItem(STORAGE_KEYS.FAVOURITES) || []);

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

  const isFavourite = ref<boolean>(false);
  const onBtnFavClick = () => {
    const itemIdToMatch = promotionItem.value.businessPromotionId;
    const isCurrentlyFavourite = isFavourite.value;

    if (isCurrentlyFavourite) {
      const itemIndex = favoriteItems.value.findIndex((item: any) => item.itemId === itemIdToMatch);
      if (itemIndex !== -1) {
        favoriteItems.value.splice(itemIndex, 1);
      }

      isFavourite.value = false;
    } else {
      const favItem = {
        directoryId: promotionItem.value.businessPromotionId,
        directoryName: promotionItem?.value?.directoryName,
        itemName: promotionItem.value.businessName,
        itemId: itemIdToMatch,
        groupId: DIRECTORY_GROUPS.HOME,
        iconPath: promotionItem.value.iconPath,
        subTitle: promotionItem.value.subtitle1
      };

      isFavourite.value = true;
      favoriteItems.value.push(favItem);
    }
    LocalStorage.set(STORAGE_KEYS.FAVOURITES, favoriteItems.value);
  };

  onMounted(() => {
    eventBus.on("BusinessPromotionDialog", () => {
      isDialogVisible.value = false;
    });
  });
  const translatedContent: any = computed(() => {
    return props.item.description;
  });
</script>
<style scoped>
  .button-margin {
    margin-right: 40px;
  }
</style>
