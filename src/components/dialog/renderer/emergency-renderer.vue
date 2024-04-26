<template>
  <q-list padding class="q-mx-sm q-pt-md">
    <q-card>
      <q-card-section class="q-pa-sm">
        <q-expansion-item
          label="Info"
          group="siteGroup"
          dense
          dense-toggle
          default-opened
          header-class="text-h6"
        >
          <q-separator />
          <q-item-section></q-item-section>
          <q-item-section class="q-mt-md" side>
            <app-button-rounded
              :text-color="isFavourite ? 'red' : 'white'"
              icon="favorite"
              @click="onBtnFavClick"
            />
          </q-item-section>

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
          </q-item>
          <!-- 
          <q-item>
            <app-text-editor v-model="translatedContent" />
          </q-item> -->

          <q-item>
            <q-item-section avatar @click="navigateToPhone">
              <q-avatar>
                <q-icon name="phone" color="primary" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-caption"
                >{{ siteItem.contactPhone == undefined ? "N/A" : siteItem.contactPhone }}
              </q-item-label></q-item-section
            >
          </q-item>
          <q-item>
            <q-item-section avatar @click="navigateToWhatsApp(siteItem.contactWhatsApp)">
              <q-avatar>
                <q-icon name="fab fa-whatsapp" color="primary" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-caption"
                >{{ siteItem.contactWhatsApp == undefined ? "N/A" : siteItem.contactWhatsApp }}
              </q-item-label></q-item-section
            >
          </q-item>
        </q-expansion-item>
      </q-card-section>
    </q-card>
  </q-list>
</template>

<script setup lang="ts">
  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";
  import { SiteView } from "@/interfaces/models/views/site-view";

  const { navigateToWhatsApp, translate } = useUtilities();

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

  const siteItem = computed(() => props.item as SiteView);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const translatedContent: any = ref(
    translate(siteItem.value.description, siteItem.value.meta, "description")
  );

  const navigateToPhone = () => {
    if (siteItem.value.contactPhone) {
      const phoneURL = `tel:${siteItem.value.contactPhone}`;
      window.location.href = phoneURL;
    }
  };

  const onBtnFavClick = () => {
    emits("on-favourite");
  };
</script>
