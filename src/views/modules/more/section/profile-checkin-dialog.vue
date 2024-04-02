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
        <app-dialog-title>{{ $t(`more.checkIn`) }}</app-dialog-title>
      </q-header>

      <q-page-container>
        <q-page>
          <q-card class="q-ma-md">
            <q-card-section class="q-pa-none">
              <q-list>
                <q-item clickable @click="throttledHandleDialog">
                  <q-item-section avatar>
                    <q-avatar size="64px" square>
                      <q-img ratio="1" :src="computeIconPath">
                        <template v-slot:error>
                          <div class="absolute-full flex flex-center bg-negative text-white">
                            {{ $t("errors.cannotLoadImage") }}
                          </div>
                        </template>
                      </q-img>
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>{{ data.siteName }}</q-item-label>
                    <q-item-label lines="2">
                      <app-text-editor v-model="translatedContent"
                    /></q-item-label>
                  </q-item-section>

                  <!-- <q-item-section side top>
                    <q-item-label caption>5 min ago</q-item-label>
                    <q-icon name="star" color="yellow" />
                  </q-item-section> -->
                </q-item>
              </q-list>
              <!-- {{ data }} -->
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

  // Interface files
  import { CheckIn } from "@/interfaces/models/entities/CheckIn";

  const props = defineProps({
    data: {
      type: Object as PropType<CheckIn>,
      required: true
    }
  });

  // const authStyle = computed(() => ($q.screen.gt.sm ? { width: "60vw" } : { width: "100vw" }));
  //const { claimFreePoints, userStore } = useMoreInput();

  const { translate } = useUtilities();

  const { dialogRef } = useDialogPluginComponent();
  const isDialogVisible = ref();
  const $q = useQuasar();

  const computeIconPath = computed(() => {
    return props?.data?.iconPath
      ? `${BLOB_URL}/${props?.data?.iconPath}`
      : "./img/icons/no_image_available.jpeg";
  });

  const translatedContent: any = ref(
    translate(props?.data?.description, props?.data?.meta, "description")
  );

  const onItemClick = () => {
    $q.dialog({
      component: defineAsyncComponent(
        () => import("@/components/dialog/checkin-detail-dialog.vue")
      ),
      componentProps: {
        data: props.data
      }
    });
  };

  const throttledHandleDialog = throttle(onItemClick, 2000);

  onMounted(() => {
    translatedContent;
  });
</script>
