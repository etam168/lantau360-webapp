<template>
  <q-list padding class="q-mx-sm q-pa-none">
    <q-item>
      <q-item-section>
        <q-btn
          color="primary"
          text-color="white"
          icon="location_on"
          size="sm"
          round
          @click="temp"
        />
      </q-item-section>

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
            icon="phone"
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
            @click="onBtnFavClick()"
          />
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-separator class="q-mt-sm" />

    <q-item>
      <q-item-section>
        <q-item-label class="q-mt-sm"
          >{{ translate(voucherItem.subtitle1, voucherItem.meta, "subtitle1") }}
        </q-item-label>
        <q-item-label class="q-mt-sm" caption>{{ $t("business.subtitle1") }} </q-item-label>
      </q-item-section>
    </q-item>
    <q-separator class="q-mt-sm" />

    <q-item>
      <app-text-editor v-model="translatedContent" />
    </q-item>
    <q-separator class="q-mt-sm" />
  </q-list>
</template>

<script setup lang="ts">
  import { DIRECTORY_GROUPS, STORAGE_KEYS } from "@/constants";
  import { LocalStorage } from "quasar";
  import { BusinessVoucher } from "@/interfaces/models/entities/business-voucher";
  import { EventBus } from "quasar";

  import { MarketingType } from "@/interfaces/types/marketing-types";

  const eventBus = new EventBus();
  const { translate } = useUtilities();

  const props = defineProps({
    item: {
      type: Object as PropType<MarketingType>,
      required: true
    }
  });

  const voucherItem = computed(() => {
    return props.item as BusinessVoucher;
  });

  const isDialogVisible = ref();

  const favoriteItems = ref<any>(LocalStorage.getItem(STORAGE_KEYS.FAVOURITES) || []);

  const isFavourite = ref<boolean>(false);
  const onBtnFavClick = () => {
    const itemIdToMatch = voucherItem.value.businessVoucherId;
    const isCurrentlyFavourite = isFavourite.value;

    if (isCurrentlyFavourite) {
      const itemIndex = favoriteItems.value.findIndex((item: any) => item.itemId === itemIdToMatch);
      if (itemIndex !== -1) {
        favoriteItems.value.splice(itemIndex, 1);
      }

      isFavourite.value = false;
    } else {
      const favItem = {
        directoryId: voucherItem.value.businessVoucherId,
        directoryName: voucherItem?.value?.directoryName,
        itemName: voucherItem.value.businessName,
        itemId: itemIdToMatch,
        groupId: DIRECTORY_GROUPS.HOME,
        iconPath: voucherItem.value.iconPath,
        subTitle: voucherItem.value.subtitle1
      };

      isFavourite.value = true;
      favoriteItems.value.push(favItem);
    }
    LocalStorage.set(STORAGE_KEYS.FAVOURITES, favoriteItems.value);
  };

  const temp = () => {
    alert(JSON.stringify(favoriteItems.value));
  };

  onMounted(() => {
    eventBus.on("BusinessVoucherDialog", () => {
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
