<template>
  <q-card-section class="text-center">
    <q-icon name="report_problem" size="4rem" color="primary" />
    <div class="text-h6">Top up points</div>
    <div class="text-body2 q-mt-sm">
      User can gets two free top-up requests in a month. Your free top-up request of current has
      been completed. You can either wait until next month to ask for more free top-ups or purchase
      some now.
    </div>
  </q-card-section>

  <q-card-actions class="q-px-none no-wrap">
    <app-button
      class="full-width"
      :label="$t('more.creditCard.claimYourFreePoint')"
      color="primary"
      type="submit"
      disabled
    />
  </q-card-actions>
</template>

<script setup lang="ts"></script>
