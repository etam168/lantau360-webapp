<template>
  <q-card class="bg-grey-1" style="border: 1px solid #9e9e9e">
    <q-card-section class="text-center">
      <div class="text-h6">Option 1</div>
      <div class="text-subtitle1">Free top-up points</div>

      <div class="text-body2 q-mt-md text-justify">
        Claim <span style="font-weight: bold">{{ topUpPoints }}</span> free points to publish a post
        in the community. Users have the opportunity to claim free points twice a month, allowing
        them to participate and share their thoughts and content without any cost.
      </div>
      <div
        v-if="currentMonthFreeTransactionCount > 1"
        class="text-body2 q-mt-md text-justify"
        style="color: red"
      >
        You have already claimed your
        <span style="font-weight: bold">{{ topUpPoints * 2 }}</span> free points for this month. To
        continue posting in the community, please purchase additional points and keep sharing your
        valuable insights and content.
      </div>
    </q-card-section>

    <q-card-actions class="row justify-center">
      <app-button
        class="q-mb-md"
        style="width: 200px"
        :label="$t('more.creditCard.claimYourFreePoint')"
        color="primary"
        type="submit"
        :disabled="currentMonthFreeTransactionCount > 1"
        @click="onBtnClick"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
  import { useUserStore } from "@/stores/user";
  import { useMoreInput } from "../../use-more-input";

  const { claimFreePoints } = useMoreInput();
  const { topUpPoints } = useUserStore();
  const emits = defineEmits(["close-dialog"]);

  async function onBtnClick() {
    const status = await claimFreePoints();
    if (status) emits("close-dialog", false);
  }
  const { currentMonthFreeTransactionCount } = useUserStore();
</script>
