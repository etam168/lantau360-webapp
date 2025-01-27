<template>
  <div class="q-pa-md row items-start justify-center q-gutter-md">
    <q-card
      v-for="(item, index) in topUpDetail"
      :key="index"
      bordered
      class="text-center bg-grey-1"
      :style="$q.screen.lt.sm ? '' : 'width: 600px'"
    >
      <q-card-section>
        <div class="text-h6">{{ item.title }}</div>
        <div class="text-subtitle1">{{ item.subtitle }}</div>
        <div class="text-body2 text-justify q-mt-md">{{ item.description }}</div>
        <!-- <p v-if="error" class="text-red">{{ item.error }}</p> -->
        <q-btn
          color="primary"
          class="q-mt-md"
          :disable="item.disable"
          @click="handleClick(item.name)"
          >{{ item.buttonText }}</q-btn
        >
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
  import { useUserStore } from "@/stores/user";
  const { userInfo } = useUserStore();

  const { t } = useI18n({ useScope: "global" });
  const { api } = useApi();
  const { notify } = useUtilities();

  async function handleClick(itemName: string) {
    if (itemName == "freePoints") {
      claimFreePoints();
    }
  }

  async function claimFreePoints() {
    try {
      await api.get(`/Member/RequestFreePoints/${userInfo.userId}`);
    } catch (err: any) {
      if (err instanceof AxiosError) {
        if (
          err.response?.status === 500 &&
          err.response?.data.error.message === "pointsAlreadyAvailed"
        ) {
          notify(t("more.message.pointsAlreadyAvailed"), "negative");
        } else {
          notify(err.message, "negative");
        }
      } else {
        notify(err.message, "negative");
      }
    }
  }
  const topUpDetail = computed(() => {
    return [
      {
        name: "freePoints",
        title: t("more.topUp.freePoints.option1"),
        subtitle: t("more.topUp.freePoints.subtitle"),
        description: t("more.topUp.freePoints.description"),
        buttonText: t("more.topUp.freePoints.buttonText"),
        error: t("more.topUp.freePoints.error"),
        type: "option",
        disable: false // Update this dynamically if needed
      },
      {
        name: "purchasePoints",
        title: t("more.topUp.purchasePoints.title"),
        subtitle: t("more.topUp.purchasePoints.subtitle"),
        description: t("more.topUp.purchasePoints.description"),
        buttonText: t("more.topUp.purchasePoints.buttonText"),
        type: "option",
        disable: true // Update this dynamically if needed
      }
    ];
  });
</script>
