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
  const { currentMonthFreeTransactionCount, userId } = useUserStore();

  const { t } = useI18n({ useScope: "global" });
  const { api } = useApi();
  const { eventBus, notify } = useUtilities();

  async function handleClick(itemName: string) {
    if (itemName == "freePoints") {
      claimFreePoints();
    }
  }

  async function claimFreePoints() {
    const memberId = parseInt(userId);
    try {
      const res = await api.create(`/Points/RequestFreePoints/${memberId}`);
      eventBus("refresh-transaction-data").emit();
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status === 400 && err.response?.data === "have_enough_points") {
          notify(t("more.message.enoughPoints"), "negative");
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
        title: "Option 1",
        subtitle: "Free top-up points",
        description:
          "Claim 100 free points to publish a post in the community. Users have the opportunity to claim free points once a month, allowing them to participate and share their thoughts and content without any cost",
        buttonText: "CLAIM YOUR FREE POINT",
        error: "You have already claimed your 100 free points for this month.",
        type: "option",
        disable: currentMonthFreeTransactionCount > 1
      },
      {
        name: "purchasePoints",
        title: "Option 2",
        subtitle: "Purchase top-up points",
        description:
          "Purchase points to gain the ability to publish posts in the community module. By buying points, users can actively participate and share their thoughts, ideas, and content with the community",
        buttonText: "PURCHASE",
        type: "option",
        disable: true
      }
    ];
  });
</script>
