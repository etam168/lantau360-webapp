<template>
  <q-card flat>
    <q-card-section class="text-center">
      <q-icon
        name="report_problem"
        size="4rem"
        :color="userStore.currentMonthFreeTransactionCount < 2 ? 'primary' : 'red'"
      />
      <div class="text-h6">{{ title }}</div>

      <div class="text-body2" v-if="userStore.currentMonthFreeTransactionCount < 2">
        {{ bodyMessage }}
      </div>

      <div class="text-body2" v-else>
        User can gets two free top-up requests in a month. Your free top-up request of current has
        been completed. You can either wait until next month to ask for more free top-ups or
        purchase some now.
      </div>
    </q-card-section>

    <q-card-actions class="q-px-none no-wrap">
      <app-button
        v-if="userStore.currentMonthFreeTransactionCount < 2"
        class="full-width"
        :label="$t('more.creditCard.claimYourFreePoint')"
        color="primary"
        type="submit"
        @click="claimFreePoints"
      />
      <app-button
        v-else
        class="full-width"
        :label="$t('more.creditCard.claimYourFreePoint')"
        color="primary"
        type="submit"
        @click="claimFreePoints"
        disabled
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
  import { useMoreInput } from "../../use-more-input";
  import { useUserStore } from "@/stores/user";

  import i18n from "@/plugins/i18n/i18n";

  const { topUpPoints } = useUserStore();
  const { claimFreePoints, userStore } = useMoreInput();
  const { t } = i18n.global;

  const title = computed(() => t("more.profileSetting.buyPoints"));

  const bodyMessage = computed(() =>
    t("more.profileSetting.claimFreePointText", { points: topUpPoints })
  );
</script>
