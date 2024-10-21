<template>
  <q-card class="q-ma-md q-py-md text-white bg-primary">
    <q-card-section class="row items-center justify-between">
      <!-- Points Balance Section -->
      <div>
        <div class="text-subtitle1">
          {{
            $t("more.profileSetting.availablePoints", {
              availablePoints: 50
            })
          }}
        </div>
        <div class="text-caption">
          {{
            $t("more.profileSetting.bythisTimeText", {
              spentPoints: 50
            })
          }}
        </div>
      </div>

      <!-- Top-up Points Button -->
      <q-btn dense rounded class="text-primary bg-grey-1 text-caption q-px-md">{{
        $t("more.profileSetting.buyPoints")
      }}</q-btn>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
  import { defineEmits } from "vue";

  const emit = defineEmits(["top-up-points"]);

  const emitCloseEvent = () => {
    emit("top-up-points");
  };
</script>
