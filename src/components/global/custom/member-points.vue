<template>
  <q-card class="q-ma-md q-py-md text-white bg-primary">
    <q-card-actions align="between" class="q-px-md">
      <q-card-section class="text-white q-pa-none">
        <div class="text-subtitle1">
          {{
            $t(`${i18nKeyMoreDialog}.availablePoints`, {
              availablePoints: memberPointsStore.availabelPoints
            })
          }}
        </div>
      </q-card-section>

      <q-btn
        dense
        rounded
        class="text-primary bg-grey-1 text-caption q-px-lg"
        @click="handleTopUpPoints"
        >{{ $t(`${i18nKeyMoreDialog}.topUpPoints`) }}</q-btn
      >
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
  import { defineEmits } from "vue";
  import { useMemberPointsStore } from "@/stores/member-points-store";

  const memberPointsStore = useMemberPointsStore();
  const i18nKeyMoreDialog = "more.mainMenuDialog.account";

  const emit = defineEmits(["top-up-points"]);

  const handleTopUpPoints = () => {
    emit("top-up-points");
  };
</script>
