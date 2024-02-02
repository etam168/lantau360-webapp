<template>
  <q-list padding class="q-mx-sm q-pt-md">
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

    <q-item>
      <app-text-editor v-model="translatedContent" />
    </q-item>

    <q-item>
      <q-item-section>
        <div class="q-gutter-md">
          <app-button-rounded v-if="siteItem.contactPhone" icon="phone" @click="navigateToPhone" />

          <app-button-rounded
            v-if="siteItem.contactWhatsApp"
            icon="fab fa-whatsapp"
            @click="navigateToWhatsApp(siteItem.contactWhatsApp)"
          />
        </div>
      </q-item-section>
    </q-item>
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
    }
  });

  const siteItem = computed(() => props.item as SiteView);
  const translatedContent: any = ref(
    translate(siteItem.value.description, siteItem.value.meta, "description")
  );

  const navigateToPhone = () => {
    if (siteItem.value.contactPhone) {
      const phoneURL = `tel:${siteItem.value.contactPhone}`;
      window.location.href = phoneURL;
    }
  };
</script>
