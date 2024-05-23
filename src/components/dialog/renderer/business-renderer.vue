<template>
  <q-list padding class="q-pa-none q-pb-md" style="background-color: #f6f6f6">
    <open-close-time-content :item="item" />

    <q-list class="rounded-borders q-mx-lg">
      <q-card class="q-mb-md" v-if="translatedContent != null && translatedContent != ''">
        <q-card-section class="q-pa-sm">
          <q-expansion-item group="siteGroup" dense dense-toggle>
            <template v-slot:header>
              <q-item-section class="text-h6">
                {{ $t("home.description") }}
              </q-item-section>

              <q-item-section side>
                <app-button-rounded
                  :text-color="isFavourite ? 'red' : 'white'"
                  icon="favorite"
                  @click="onBtnFavClick"
                />
              </q-item-section>
            </template>
            <q-separator />

            <q-card>
              <q-card-section class="q-pa-md">
                <app-text-editor v-model="translatedContent" />
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-card-section>
      </q-card>

      <q-card class="q-mb-md">
        <q-card-section class="q-pa-sm">
          <q-expansion-item
            :label="$t('home.location')"
            group="siteGroup"
            dense
            dense-toggle
            default-opened
            header-class="text-h6"
          >
            <q-separator />
            <q-card>
              <q-card-section class="q-pa-none">
                <default-info-tab :item="item" />
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-card-section>
      </q-card>

      <q-card v-if="item.contactPhone || item.contactWhatsApp">
        <q-card-section class="q-pa-sm">
          <q-expansion-item
            :label="'Contact Info'"
            group="siteGroup"
            dense
            dense-toggle
            header-class="text-h6"
          >
            <q-separator />
            <q-card>
              <q-card-section
                class="q-pa-none"
                :class="{ 'row no-wrap': $q.screen.gt.xs, column: !$q.screen.gt.xs }"
              >
                <contact-content :item="item" />
              </q-card-section>
            </q-card>
          </q-expansion-item>
        </q-card-section>
      </q-card>
    </q-list>
  </q-list>
</template>

<script setup lang="ts">
  // Interface files
  import { BusinessView } from "@/interfaces/models/views/business-view";
  import { CategoryTypes } from "@/interfaces/types/category-types";

  // UI Components
  import OpenCloseTimeContent from "@/components/dialog/renderer/common/open-close-time-content.vue";
  import ContactContent from "@/components/dialog/renderer/common/contact-content.vue";
  import defaultInfoTab from "@/components/dialog/renderer/common/tabs/default-info-tab.vue";

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

  const { translate } = useUtilities();

  const translatedContent = ref("");

  const businessItem = computed(() => props?.item as BusinessView);

  const onBtnFavClick = () => {
    emits("on-favourite");
  };

  watchEffect(() => {
    translatedContent.value = translate(
      businessItem.value.description,
      businessItem.value.meta,
      "description"
    );
  });
</script>
