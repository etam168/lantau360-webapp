<template>
  <q-card class="bg-grey-1" style="border: 1px solid #9e9e9e">
    <q-card-section class="text-center">
      <div class="text-h6">{{ $t("more.topUpSection.option1") }}</div>
      <div class="text-subtitle1">{{ $t("more.topUpSection.freeTopUpPoints") }}</div>

      <div class="text-body2 q-mt-md text-justify">
        <!-- {{ $t("more.topUpSection.topUpSection", { topUpPoints }) }} -->
        {{
          $t("more.topUpSection.claimDescription", {
            points: topUpPoints
          })
        }}
      </div>
      <div
        v-if="currentMonthFreeTransactionCount > 1"
        class="text-body2 q-mt-md text-justify"
        style="color: red"
      >
        {{
          $t("more.topUpSection.alreadyClaimedDescription", {
            points: topUpPoints * 2
          })
        }}
      </div>
    </q-card-section>

    <q-card-actions class="row justify-center">
      <app-button
        class="q-mb-md"
        style="width: 200px"
        :label="$t('more.topUpSection.claimYourFreePoint')"
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
