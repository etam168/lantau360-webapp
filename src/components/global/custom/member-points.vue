<template>
  <q-card class="q-ma-md q-py-md text-white bg-primary">
    <q-card-actions align="between" class="q-px-md">
      <q-card-section class="text-white q-pa-none">
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
      </q-card-section>

      <q-btn
        dense
        rounded
        class="text-primary bg-grey-1 text-caption q-px-lg"
        @click="handleTopUpPoints"
        >{{ $t("more.profileSetting.buyPoints") }}</q-btn
      >
    </q-card-actions>
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
