<template>
  <!-- Check if moreData exists and is not empty -->
  <div v-if="contentData && contentData.length">
    <q-card v-for="item in contentData" :key="item.checkInId" class="q-ma-md">
      <q-card-section class="q-pa-none">
        <q-list>
          <q-item clickable @click="throttledHandleDialog(item)">
            <q-item-section avatar>
              <q-avatar size="64px" square>
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
              <q-item-label lines="2">
                {{
                  $t("more.checkIn.lastCheckIn", {
                    date: dateFormatter(item.modifiedAt)
                  })
                }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </div>

  <!-- Show fallback image when moreData is empty -->
  <q-card
    v-else
    flat
    style="min-height: calc(100vh - 50px)"
    class="row justify-center items-center"
  >
    <q-card-section :style="$q.screen.gt.xs ? 'width: 480px' : 'width : 100%'">
      <q-img :src="IMAGES.NO_DATA_IMAGE" />
      <div class="text-h6 text-weight-regular q-mt-md text-grey-6 text-weight-bold text-center">
        {{ $t("more.checkIn.noCheckIn") }}
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  import { throttle } from "quasar";
  import { IMAGES } from "@/constants";

  // Props
  const { contentData } = defineProps<{
    contentData: Record<string, any>;
  }>();

  const { dateFormatter, getImageURL } = useUtilities();
  const $q = useQuasar();

  const computeIconPath = (item: any) => {
    return getImageURL(item.iconPath);
  };

  const onItemClick = (item: any) => {};

  const throttledHandleDialog = throttle(onItemClick, 2000);
</script>
