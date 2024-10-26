<template>
  <q-card class="q-ma-md q-py-md text-white bg-primary">
    <q-card-section class="row items-center justify-between">
      <!-- Points Balance Section -->
      <div>
        <div class="text-subtitle1">
          {{
            $t("more.profileSetting.availablePoints", {
              availablePoints: userStore.availabelPoints
            })
          }}
        </div>
        <div class="text-caption">
          {{
            $t("more.profileSetting.bythisTimeText", {
              spentPoints: userStore.spendPoints
            })
          }}
        </div>
      </div>

      <!-- Top-up Points Button -->
      <q-btn
        dense
        rounded
        class="text-primary bg-grey-1 text-caption q-px-md"
        @click="handleTopUpPoints"
        >{{ $t("more.profileSetting.buyPoints") }}</q-btn
      >
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  import { defineEmits } from "vue";
  import { useUserStore } from "@/stores/user";

  const userStore = useUserStore();

  const emit = defineEmits(["top-up-points"]);

  const handleTopUpPoints = () => {
    emit("top-up-points");
  };
</script>
