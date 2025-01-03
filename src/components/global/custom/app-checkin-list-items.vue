<template>
  <q-card v-for="(item, index) in checkinItems" :key="index" class="q-ma-md">
    <q-card-section class="q-pa-none">
      <q-list>
        <q-item clickable @click="handleDetail(item)">
          <q-item-section avatar>
            <q-avatar size="64px" circle>
              <q-img ratio="1" :src="computeIconPath(item)">
                <template v-slot:error>
                  <div class="absolute-full flex flex-center bg-negative text-white">
                    {{ $t("errors.cannotLoadImage") }}
                  </div>
                </template>
              </q-img>
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ item.siteName }}</q-item-label>
            <q-item-label lines="2"
              >{{
                $t(`${i18nKeyMoreDialog}.checkin.lastCheckIn`, {
                  date: dateFormatter(item.modifiedAt)
                })
              }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  // Interface files
  import { CategoryTypes } from "@/interfaces/types/category-types";

  // .ts files
  import { BLOB_URL, EntityURLKey } from "@/constants";

  const emits = defineEmits(["on-member-detail"]);

  // Props
  const { checkinItems, entityKey } = defineProps<{
    checkinItems: CategoryTypes[];
    entityKey: EntityURLKey;
  }>();

  const { locale } = useI18n({ useScope: "global" });

  const { dateFormatter } = useUtilities(locale.value);

  const i18nKeyMoreDialog = "more.mainMenuDialog";

  const computeIconPath = (item: any) => {
    return item.iconPath ? `${BLOB_URL}/${item.iconPath}` : "./img/icons/no_image_available.jpeg";
  };
  function handleDetail(item: any) {
    emits("on-member-detail", item);
  }
</script>
