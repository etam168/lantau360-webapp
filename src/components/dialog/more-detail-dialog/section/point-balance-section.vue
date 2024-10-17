<template>
  <q-card class="text-white bg-primary q-ma-md q-py-md">
    <q-card-section class="q-ma-none q-pa-none">
      <q-item>
        <q-item-section>
          <q-item-label class="text-subtitle1"
            >{{
              $t("more.profileSetting.availablePoints", {
                availablePoints: userStore.availabelPoints
              })
            }}
          </q-item-label>
          <q-item-label caption class="text-white">
            {{
              $t("more.profileSetting.bythisTimeText", {
                spentPoints: userStore.spendPoints
              })
            }}
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn
            dense
            rounded
            @click="onBtnBuyPoints"
            class="text-primary bg-grey-1 text-caption q-px-md"
            >{{ $t("more.profileSetting.buyPoints") }}</q-btn
          >
        </q-item-section>
      </q-item>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  import { useUserStore } from "@/stores/user";

  // Props
  const { moreData } = defineProps<{
    moreData: any;
  }>();

  const userStore = useUserStore();
  const $q = useQuasar();

  const onBtnBuyPoints = () => {
    alert("TOP UP POINTS");
    // $q.dialog({
    //   component: defineAsyncComponent(
    //     () => import("./top-up-points/purchase-options-dialog/index.vue")
    //   )
    // });
  };
</script>
