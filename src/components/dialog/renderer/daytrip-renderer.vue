<template>
  <gallery-section :item="item" />

  <q-list class="q-px-md q-pb-md">
    <q-item v-if="siteItem.subtitle1">
      <q-item-section avatar>
        <q-avatar
          v-if="$q.screen.gt.xs"
          dense
          rounded
          color="primary"
          icon="location_on"
          text-color="white"
          size="sm"
        />

        <q-avatar v-if="$q.screen.xs">
          <q-icon name="location_on" color="primary" />
        </q-avatar>
      </q-item-section>
      <q-item-section>
        <q-item-label v-if="siteItem.subtitle1" class="text-caption"
          >{{ translate(siteItem.subtitle1, siteItem.meta, "subtitle1") }}
        </q-item-label>
      </q-item-section>
      <q-item-section side>
        <app-button-rounded
          :text-color="isFavourite ? 'red' : 'white'"
          icon="favorite"
          @click="onBtnFavClick"
        />
      </q-item-section>
    </q-item>

    <q-item v-if="translatedContent != null && translatedContent != ''">
      <app-text-editor v-model="translatedContent" />
    </q-item>

    <q-item>
      <q-item-section>
        <div class="q-gutter-md">
          <q-list class="q-pa-none">
            <q-item v-if="item.contactPhone" class="q-pa-none">
              <q-item-section avatar @click="navigateToPhone(siteItem.contactPhone)">
                <q-avatar>
                  <q-icon name="phone" color="primary" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-caption">{{
                  siteItem.contactPhone == undefined ? "N/A" : siteItem.contactPhone
                }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="item.contactWhatsApp" class="q-pa-none">
              <q-item-section avatar @click="navigateToWhatsApp(siteItem.contactWhatsApp)">
                <q-avatar>
                  <q-icon name="fab fa-whatsapp" color="primary" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-caption">{{
                  siteItem.contactWhatsApp == undefined ? "N/A" : siteItem.contactWhatsApp
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { SiteView } from "@/interfaces/models/views/site-view";

  //UI Components
  import GallerySection from "@/components/dialog/renderer/common/gallery-section.vue";

  const props = defineProps({
    item: {
      type: Object as PropType<CategoryTypes>,
      required: true
    }
  });

  const { navigateToPhone, navigateToWhatsApp } = useCommunication();
  const { eventBus, isFavouriteItem, toggleItemFavStatus, translate } = useUtilities();

  const isFavourite = ref(isFavouriteItem(props.item));
  const siteItem = computed(() => props.item as SiteView);

  const translatedContent: any = ref(
    translate(siteItem.value.description, siteItem.value.meta, "description")
  );

  function onBtnFavClick() {
    toggleItemFavStatus(props.item, isFavourite.value);
    isFavourite.value = !isFavourite.value;
    eventBus.emit("favoriteUpdated", props.item);
  }
</script>
