<template>
  <q-dialog
    ref="dialogRef"
    transition-show="slide-up"
    transition-hide="slide-down"
    :model-value="isDialogVisible"
    maximized
  >
    <q-layout view="lHh lpr lFf" class="bg-white" style="max-width: 1024px">
      <q-header class="bg-transparent text-dark">
        <app-dialog-title>{{ $t(`more.checkIn.title`) }}</app-dialog-title>
      </q-header>

      <q-page-container>
        <q-page>
          <div v-if="data.length != 0">
            <q-card v-for="item in data" :key="item.checkInId" class="q-ma-md">
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
                      <q-item-label lines="2"
                        >{{
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

          <q-card
            flat
            v-else
            style="min-height: calc(100vh - 50px)"
            class="row justify-center items-center"
          >
            <q-card-section :style="$q.screen.gt.xs ? 'width: 480px' : 'width : 100%'">
              <q-img :src="noData" />
              <div
                class="text-h6 text-weight-regular q-mt-md text-grey-6 text-weight-bold text-center"
              >
                {{ $t("more.checkIn.noCheckIn") }}
              </div>
            </q-card-section>
          </q-card>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
  // Quasar Import
  import { throttle } from "quasar";
  import { BLOB_URL } from "@/constants";
  import { CheckIn } from "@/interfaces/models/entities/checkin";

  // Interface files

  defineProps({
    data: {
      type: Object as PropType<CheckIn[]>,
      required: true
    }
  });

  const { dialogRef } = useDialogPluginComponent();
  const isDialogVisible = ref();
  const $q = useQuasar();
  const { dateFormatter } = useUtilities();

  const noData = ref("/img/icons/noData2.png");

  const computeIconPath = (item: any) => {
    return item.iconPath ? `${BLOB_URL}/${item.iconPath}` : "./img/icons/no_image_available.jpeg";
  };

  const onItemClick = (item: any) => {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/checkin-detail-dialog.vue")
      ),
      componentProps: {
        item: item
      }
    });
  };

  const throttledHandleDialog = throttle(onItemClick, 2000);
</script>
